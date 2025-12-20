<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        Admin::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Abu Talha',
                'email' => 'admin@gmail.com', // ✅ VERY IMPORTANT
                'password' => Hash::make('admin221'),
            ]
        );
    }
}
