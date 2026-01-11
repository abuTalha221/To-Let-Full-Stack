<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'division',
        'district',
        'area',
        'subarea',
        'category',
        'room',
        'move_in_month',
        'budget',
        'details',
        'package_code',
        'cost',
        'contact_name',
        'contact_phone',
        'contact_email',
        'payment_status',
        'payment_method',
        'transaction_id',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    /**
     * Transactions related to this order
     */
    public function transactions()
    {
        return $this->hasMany(\App\Models\Transaction::class);
    }
}
