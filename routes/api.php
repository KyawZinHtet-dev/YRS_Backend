<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function (Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'Hello From Public API',
    ]);
});
