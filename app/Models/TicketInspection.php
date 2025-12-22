<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketInspection extends Model
{
    protected $fillable = [
        'ticket_id',
        'ticket_inspector_id',
        'route_id',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'ticket_id', 'id');
    }

    public function route()
    {
        return $this->belongsTo(Route::class, 'route_id', 'id');
    }
}
