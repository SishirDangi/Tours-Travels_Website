<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Contact extends Model
{
    use HasFactory;

    protected $table = 'contacts';

    protected $fillable = [
        'first_name',
        'last_name',
        'gender',
        'mobile_no',
        'email',
        'address',
        'country_id',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

}
