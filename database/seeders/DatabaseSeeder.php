<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use App\Models\TicketInspector;
use App\Models\User;
use App\Models\Wallet;
use Database\Seeders\RouteSeeder;
use Database\Seeders\StationSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
           RouteSeeder::class,
           StationSeeder::class,
        ]);
        
        AdminUser::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        TicketInspector::create([
            'name' => 'Ticket Inspector',
            'email' => 'inspector@gmail.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $users = User::factory(40)->create();

        foreach ($users as $user) {
            Wallet::firstOrCreate(['user_id' => $user->id], ['balance' => 0]);
        }
    }
}
