<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_id',
        'main_information',
        'cost_includes',
        'cost_excludes',
        'itinerary',
        'trip_highlights',
    ];

    protected $casts = [
        'cost_includes' => 'array',
        'cost_excludes' => 'array',
        'itinerary' => 'array',
        'trip_highlights' => 'array',
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
