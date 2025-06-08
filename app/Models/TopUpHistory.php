<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TopUpHistory extends Model
{
    protected $fillable = [
        'transaction_id',
        "user_id",
        "wallet_id",
        "amount",
        'description',
        'image',
        'status',
        'approved_at',
        'rejected_at',
    ];
}
