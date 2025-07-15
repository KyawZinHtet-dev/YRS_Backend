<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'description',
        'latitude',
        'longitude',
    ];
}
