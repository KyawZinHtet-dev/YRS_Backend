<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'ticket_number',
        'user_id',
        'ticket_pricing_id',
        'type',
        'direction',
        'price',
        'valid_at',
        'expired_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function ticket_pricing()
    {
        return $this->belongsTo(TicketPricing::class, 'ticket_pricing_id', 'id');
    }
}
