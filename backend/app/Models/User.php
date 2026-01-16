<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // ✅ Mass assignable
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_otp',
        'email_otp_expires_at',
        'email_verified_at',
        'is_admin',
        'is_blocked',
        'credits',
    ];

    // 🔒 Hidden fields
    protected $hidden = [
        'password',
        'remember_token',
        'email_otp',
    ];

    // 🕒 Casts
    protected $casts = [
        'email_verified_at' => 'datetime',
        'email_otp_expires_at' => 'datetime',
    ];

    /* ======================================
       🔓 PROPERTY UNLOCK RELATION
    ====================================== */
    public function unlockedProperties()
    {
        return $this->belongsToMany(
            \App\Models\Property::class,
            'property_unlocks'
        )->withTimestamps();
    }
}
