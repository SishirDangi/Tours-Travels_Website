<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    public function run()
    {
        // List of all countries with country codes and phone codes
        $countries = [
            ['country_code' => 'AF', 'country_name' => 'Afghanistan', 'phone_code' => '+93'],
            ['country_code' => 'AL', 'country_name' => 'Albania', 'phone_code' => '+355'],
            ['country_code' => 'DZ', 'country_name' => 'Algeria', 'phone_code' => '+213'],
            ['country_code' => 'AD', 'country_name' => 'Andorra', 'phone_code' => '+376'],
            ['country_code' => 'AO', 'country_name' => 'Angola', 'phone_code' => '+244'],
            ['country_code' => 'AR', 'country_name' => 'Argentina', 'phone_code' => '+54'],
            ['country_code' => 'AM', 'country_name' => 'Armenia', 'phone_code' => '+374'],
            ['country_code' => 'AU', 'country_name' => 'Australia', 'phone_code' => '+61'],
            ['country_code' => 'AT', 'country_name' => 'Austria', 'phone_code' => '+43'],
            ['country_code' => 'AZ', 'country_name' => 'Azerbaijan', 'phone_code' => '+994'],
            ['country_code' => 'BD', 'country_name' => 'Bangladesh', 'phone_code' => '+880'],
            ['country_code' => 'BE', 'country_name' => 'Belgium', 'phone_code' => '+32'],
            ['country_code' => 'BR', 'country_name' => 'Brazil', 'phone_code' => '+55'],
            ['country_code' => 'CA', 'country_name' => 'Canada', 'phone_code' => '+1'],
            ['country_code' => 'CN', 'country_name' => 'China', 'phone_code' => '+86'],
            ['country_code' => 'EG', 'country_name' => 'Egypt', 'phone_code' => '+20'],
            ['country_code' => 'FR', 'country_name' => 'France', 'phone_code' => '+33'],
            ['country_code' => 'DE', 'country_name' => 'Germany', 'phone_code' => '+49'],
            ['country_code' => 'IN', 'country_name' => 'India', 'phone_code' => '+91'],
            ['country_code' => 'ID', 'country_name' => 'Indonesia', 'phone_code' => '+62'],
            ['country_code' => 'IR', 'country_name' => 'Iran', 'phone_code' => '+98'],
            ['country_code' => 'IT', 'country_name' => 'Italy', 'phone_code' => '+39'],
            ['country_code' => 'JP', 'country_name' => 'Japan', 'phone_code' => '+81'],
            ['country_code' => 'KE', 'country_name' => 'Kenya', 'phone_code' => '+254'],
            ['country_code' => 'KR', 'country_name' => 'South Korea', 'phone_code' => '+82'],
            ['country_code' => 'MY', 'country_name' => 'Malaysia', 'phone_code' => '+60'],
            ['country_code' => 'MX', 'country_name' => 'Mexico', 'phone_code' => '+52'],
            ['country_code' => 'NP', 'country_name' => 'Nepal', 'phone_code' => '+977'],
            ['country_code' => 'NL', 'country_name' => 'Netherlands', 'phone_code' => '+31'],
            ['country_code' => 'NZ', 'country_name' => 'New Zealand', 'phone_code' => '+64'],
            ['country_code' => 'NG', 'country_name' => 'Nigeria', 'phone_code' => '+234'],
            ['country_code' => 'NO', 'country_name' => 'Norway', 'phone_code' => '+47'],
            ['country_code' => 'PK', 'country_name' => 'Pakistan', 'phone_code' => '+92'],
            ['country_code' => 'PH', 'country_name' => 'Philippines', 'phone_code' => '+63'],
            ['country_code' => 'RU', 'country_name' => 'Russia', 'phone_code' => '+7'],
            ['country_code' => 'SA', 'country_name' => 'Saudi Arabia', 'phone_code' => '+966'],
            ['country_code' => 'ZA', 'country_name' => 'South Africa', 'phone_code' => '+27'],
            ['country_code' => 'ES', 'country_name' => 'Spain', 'phone_code' => '+34'],
            ['country_code' => 'LK', 'country_name' => 'Sri Lanka', 'phone_code' => '+94'],
            ['country_code' => 'SE', 'country_name' => 'Sweden', 'phone_code' => '+46'],
            ['country_code' => 'CH', 'country_name' => 'Switzerland', 'phone_code' => '+41'],
            ['country_code' => 'TH', 'country_name' => 'Thailand', 'phone_code' => '+66'],
            ['country_code' => 'TR', 'country_name' => 'Turkey', 'phone_code' => '+90'],
            ['country_code' => 'AE', 'country_name' => 'United Arab Emirates', 'phone_code' => '+971'],
            ['country_code' => 'GB', 'country_name' => 'United Kingdom', 'phone_code' => '+44'],
            ['country_code' => 'US', 'country_name' => 'United States', 'phone_code' => '+1'],
            ['country_code' => 'VN', 'country_name' => 'Vietnam', 'phone_code' => '+84'],
        ];

        // Insert into the database
        DB::table('countries')->insert($countries);
    }
}
