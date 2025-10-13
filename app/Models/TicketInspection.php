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
}
