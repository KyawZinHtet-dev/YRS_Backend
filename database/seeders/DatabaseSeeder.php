<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use App\Models\TicketInspector;
use App\Models\User;
use App\Models\Wallet;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = User::factory(40)->create();

        foreach ($users as $user) {
            Wallet::firstOrCreate(['user_id' => $user->id], ['balance' => 0]);
        }

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // AdminUser::factory(10)->create();
        // TicketInspector::factory(10)->create();
    }
}
