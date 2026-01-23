<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'package_name',
        'credits',
        'amount',
        'payment_gateway',
        'transaction_id',
        'status',
        'raw_response',
        'order_id',
    ];

    protected $casts = [
        'credits' => 'integer',
        'amount' => 'float',
        'raw_response' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Order::class);
    }
}
