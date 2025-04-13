<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_id',
        'review',
        'review_by',
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
