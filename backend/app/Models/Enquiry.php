<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    use HasFactory;

    protected $table = 'enquiries';

    protected $fillable = [
        'full_name',
        'phone',
        'email',
        'message',
        'status_id',
    ];

    // Relationship: each enquiry belongs to a status
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
