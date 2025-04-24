<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentStatus extends Model
{
    // If you want to protect any fields from mass-assignment, use the 'fillable' property
    protected $fillable = [
        'name'
    ];

    /**
     * A payment status can have many bookings.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
