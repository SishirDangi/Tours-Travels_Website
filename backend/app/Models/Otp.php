<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    use HasFactory;

    protected $fillable = [
        'contact_id', 'otp', 'expires_at', 'is_used',
    ];

    // Contact relationship
    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }
}
