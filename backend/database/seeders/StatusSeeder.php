<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    public function run()
    {
        $statuses = ['active', 'booked', 'booking', 'inactive', 'pending', 'resolved', 'cancelled', 'approved', 'deactivate', 'completed'];

        foreach ($statuses as $status) {
            DB::table('statuses')->insert([
                'status_name' => $status,

            ]);
        }
    }
}
