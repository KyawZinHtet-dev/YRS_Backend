<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketPricing extends Model
{
    protected $fillable = [
        'type',
        'price',
        'offer_quantity',
        'remain_quantity',
        'started_at',
        'ended_at',
    ];
}
