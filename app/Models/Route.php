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

    protected function acsrDirection(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                switch ($attributes['direction']) {
                    case 'clockwise':
                        $text = 'Clockwise';
                        $color = 'text-green-500';
                        break;
                    case 'anticlockwise':
                        $text = 'Anticlockwise';
                        $color = 'text-red-500';
                        break;
                    default:
                        $text = '';
                        $color = '';
                        break;
                }
                return [
                    'text' => $text,
                    'color' => $color,
                ];
            },
        );
    }
}
