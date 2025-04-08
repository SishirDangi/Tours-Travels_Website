<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['password', 'last_logged_in', 'contact_id', 'role_id'];

    protected $hidden = ['password'];

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
