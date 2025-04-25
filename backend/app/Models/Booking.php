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
        'tour_date',
        'booking_code',
        'total_price',
        'contact_id',
        'package_id',
        'status_id',
        'payment_status_id',
        'no_of_persons',
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

    public function paymentStatus()
    {
        return $this->belongsTo(PaymentStatus::class);
    }
}
