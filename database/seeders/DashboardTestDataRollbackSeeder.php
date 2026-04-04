<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Ticket;
use App\Models\WalletTransaction;
use App\Models\TopUpHistory;
use App\Models\Wallet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DashboardTestDataRollbackSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Rolling back dashboard test data...');
        
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Delete test users and their related data
        $testUserIds = User::where('email', 'like', '%test%')->pluck('id');
        if ($testUserIds->isNotEmpty()) {
            $this->command->info('Found ' . $testUserIds->count() . ' test users to delete...');
            
            Wallet::whereIn('user_id', $testUserIds)->delete();
            WalletTransaction::whereIn('user_id', $testUserIds)->delete();
            TopUpHistory::whereIn('user_id', $testUserIds)->delete();
            Ticket::whereIn('user_id', $testUserIds)->delete();
            User::whereIn('id', $testUserIds)->delete();
        }
        
        // Also clean any 2025 data that might be orphaned
        $transactionCount = WalletTransaction::whereYear('created_at', 2025)->delete();
        $topUpCount = TopUpHistory::whereYear('created_at', 2025)->delete();
        $ticketCount = Ticket::whereYear('created_at', 2025)->delete();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $this->command->info('Dashboard test data rollback completed!');
        $this->command->info('Deleted:');
        $this->command->info('- ' . $testUserIds->count() . ' test users and their related data');
        $this->command->info('- ' . $transactionCount . ' wallet transactions from 2025');
        $this->command->info('- ' . $topUpCount . ' top-up requests from 2025');
        $this->command->info('- ' . $ticketCount . ' tickets from 2025');
    }
}
