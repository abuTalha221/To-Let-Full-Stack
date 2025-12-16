<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // ✅ Allow these fields to be saved
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_otp',
        'email_otp_expires_at',
        'email_verified_at',
        'is_admin',
    ];

    // 🔒 Hide sensitive fields
    protected $hidden = [
        'password',
        'remember_token',
        'email_otp',
    ];

    // 🕒 Tell Laravel these are date fields
    protected $casts = [
        'email_verified_at' => 'datetime',
        'email_otp_expires_at' => 'datetime',
    ];
}
