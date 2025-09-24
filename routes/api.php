<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StationController;

Route::get('stations', [StationController::class, 'index']);
Route::get('stations/{slug}', [StationController::class, 'show']);
