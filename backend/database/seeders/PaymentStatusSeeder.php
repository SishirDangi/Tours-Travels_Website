<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentStatusSeeder extends Seeder
{
    public function run()
    {
        DB::table('payment_statuses')->insert([
            ['name' => 'pending'],
            ['name' => 'completed'],
            ['name' => 'failed'],
            ['name' => 'refunded'],
        ]);
    }
}
