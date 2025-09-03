<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RouteStation extends Model
{
    protected $fillable = [
        'route_id',
        'station_id',
        'time'
    ];
}
