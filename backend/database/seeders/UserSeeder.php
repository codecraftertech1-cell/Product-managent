<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create user with username "atta" and password "111"
        User::updateOrCreate(
            ['name' => 'atta'],
            [
                'name' => 'atta',
                'email' => 'atta@example.com',
                'password' => Hash::make('111'),
            ]
        );
    }
}
