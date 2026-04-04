<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Ticket;
use App\Models\WalletTransaction;
use App\Models\TopUpHistory;
use App\Models\Wallet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardTestDataSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Cleaning up existing test data...');
        
        // Clear existing test data to avoid duplicates
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Delete test users and their related data
        $testUserIds = User::where('email', 'like', '%test%')->pluck('id');
        if ($testUserIds->isNotEmpty()) {
            Wallet::whereIn('user_id', $testUserIds)->delete();
            WalletTransaction::whereIn('user_id', $testUserIds)->delete();
            TopUpHistory::whereIn('user_id', $testUserIds)->delete();
            Ticket::whereIn('user_id', $testUserIds)->delete();
            User::whereIn('id', $testUserIds)->delete();
        }
        
        // Also clean any 2025 data that might be orphaned
        WalletTransaction::whereYear('created_at', 2025)->delete();
        TopUpHistory::whereYear('created_at', 2025)->delete();
        Ticket::whereYear('created_at', 2025)->delete();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $this->command->info('Creating new test data for 2025...');

        // Create test users for 2025
        $testUsers = [];
        for ($i = 1; $i <= 20; $i++) {
            $createdAt = $this->getRandomDate2025();
            $user = User::create([
                'name' => "Test User {$i}",
                'email' => "testuser{$i}@example.com",
                'password' => bcrypt('password'),
                'email_verified_at' => (clone $createdAt)->addMinutes(rand(5, 60)), // Verified 5-60 minutes after creation
                'created_at' => $createdAt,
            ]);
            
            // Create wallet for each user
            Wallet::create([
                'user_id' => $user->id,
                'balance' => rand(100, 1000) * 100, // in cents
                'created_at' => $this->getRandomDate2025(),
                'updated_at' => $this->getRandomDate2025(),
            ]);
            
            $testUsers[] = $user;
        }

        // Create tickets for 2025
        $ticketTypes = ['one_time_ticket', 'one_month_ticket'];
        $oneTimeDirections = ['clockwise', 'anticlockwise'];
        
        for ($i = 0; $i < 50; $i++) {
            $user = $testUsers[array_rand($testUsers)];
            $createdAt = $this->getRandomDate2025();
            $expiredAt = (clone $createdAt)->addDays(rand(1, 30));
            
            $ticketType = $ticketTypes[array_rand($ticketTypes)];
            
            // Set direction based on ticket type
            if ($ticketType === 'one_time_ticket') {
                $direction = $oneTimeDirections[array_rand($oneTimeDirections)];
            } else {
                $direction = 'both'; // one_month_ticket always uses 'both'
            }
            
            Ticket::create([
                'user_id' => $user->id,
                'ticket_number' => 'TK' . str_pad(rand(100000, 999999), 6, '0', STR_PAD_LEFT), // Random 6-digit ticket number
                'ticket_pricing_id' => 1, // Assuming pricing ID exists
                'type' => $ticketType,
                'direction' => $direction,
                'price' => rand(50, 200) * 100, // in cents
                'valid_at' => $createdAt,
                'expired_at' => $expiredAt,
                'created_at' => $createdAt,
            ]);
        }

        // Create wallet transactions for 2025
        $transactionTypes = ['buy_ticket', 'top_up', 'manual'];
        
        for ($i = 0; $i < 80; $i++) {
            $user = $testUsers[array_rand($testUsers)];
            $createdAt = $this->getRandomDate2025();
            $type = $transactionTypes[array_rand($transactionTypes)];
            
            // Determine method based on type
            $method = ($type === 'manual' || $type === 'top_up') ? 'add' : 'reduce';
            $amount = rand(10, 300) * 100; // in cents
            
            WalletTransaction::create([
                'wallet_id' => $user->wallet->id,
                'transaction_id' => 'TXN' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'user_id' => $user->id,
                'amount' => $amount,
                'description' => "Test {$type} transaction",
                'sourceable_id' => $user->id,
                'sourceable_type' => User::class,
                'type' => $type,
                'method' => $method,
                'created_at' => $createdAt,
            ]);
        }

        // Create top-up history for 2025
        $statuses = ['approve', 'pending', 'reject'];
        
        for ($i = 0; $i < 30; $i++) {
            $user = $testUsers[array_rand($testUsers)];
            $createdAt = $this->getRandomDate2025();
            $status = $statuses[array_rand($statuses)];
            $amount = rand(50, 500) * 100; // in cents
            
            $topUp = TopUpHistory::create([
                'transaction_id' => 'TOP' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'user_id' => $user->id,
                'wallet_id' => $user->wallet->id,
                'amount' => $amount,
                'description' => "Test top-up request",
                'image' => null,
                'status' => $status,
                'created_at' => $createdAt,
            ]);
            
            // Set approved/rejected timestamps
            if ($status === 'approve') {
                $topUp->approved_at = (clone $createdAt)->addHours(rand(1, 24));
                $topUp->save();
            } elseif ($status === 'reject') {
                $topUp->rejected_at = (clone $createdAt)->addHours(rand(1, 24));
                $topUp->save();
            }
        }

        $this->command->info('Dashboard test data for 2025 created successfully!');
        $this->command->info('Created:');
        $this->command->info('- 20 test users with wallets');
        $this->command->info('- 50 tickets across 2025');
        $this->command->info('- 80 wallet transactions');
        $this->command->info('- 30 top-up requests');
    }

    private function getRandomDate2025()
    {
        // Generate random date throughout 2025
        $start = Carbon::create(2025, 1, 1);
        $end = Carbon::create(2025, 12, 31);
        $randomDays = rand(0, $start->diffInDays($end));
        
        return $start->addDays($randomDays)
            ->addHours(rand(0, 23))
            ->addMinutes(rand(0, 59));
    }
}
