<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Station extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'description',
        'latitude',
        'longitude',
    ];

    public function routes(): BelongsToMany
    {
        return $this->belongsToMany(Route::class, 'route_stations', 'station_id', 'route_id')->withPivot('route_id', 'station_id', 'time');
    }
}
