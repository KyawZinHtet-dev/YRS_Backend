<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Route extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'description',
        'direction',
    ];

    public function stations(): BelongsToMany
    {
        return $this->belongsToMany(Station::class, 'route_stations', 'route_id', 'station_id')->withPivot('route_id', 'station_id', 'time');
    }
}
