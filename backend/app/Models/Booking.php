<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $table = 'bookings';

    protected $fillable = [
        'booking_date',
        'booking_time',
        'total_price',
        'discount',
        'contact_id',
        'package_id',
        'status_id',
    ];

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
