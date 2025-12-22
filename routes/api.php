<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\StationController;

// Stations
Route::get('stations', [StationController::class, 'index']);
Route::get('stations/{slug}', [StationController::class, 'show']);
Route::get('stations-by-region', [StationController::class, 'stationsByRegion']);

// Routes
Route::get('routes', [RouteController::class, 'index']);
Route::get('routes/{slug}', [RouteController::class, 'show']);
