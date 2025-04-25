<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use Illuminate\Support\Carbon;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            $bookingDate = Carbon::now()->subDays(rand(0, 30));
            $tourDate = (clone $bookingDate)->addDays(rand(1, 15)); // Tour date is 1–15 days after booking

            Booking::create([
                'booking_date' => $bookingDate,
                'tour_date' => $tourDate,
                'booking_code' => $this->generateUniqueBookingCode(),
                'total_price' => rand(500, 10000),
                'contact_id' => rand(1, 2),
                'package_id' => rand(1, 2),
                'status_id' => 1,
                'payment_status_id' => null,
                'no_of_persons' => rand(1, 2),
            ]);
        }
    }

    private function generateUniqueBookingCode()
    {
        do {
            $code = 'BK-' . strtoupper(uniqid());
        } while (Booking::where('booking_code', $code)->exists());

        return $code;
    }
}
