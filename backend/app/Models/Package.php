<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Package extends Model
{
    use HasFactory;

    protected $table = 'packages';

    protected $fillable = [
        'package_name',
        'package_description',
        'package_type',
        'package_price',
        'pkg_image_path',
        'duration',
        'status_id',
        'tour_category',
    ];

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
