<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserPortal\AuthController;
use App\Http\Controllers\Api\UserPortal\ProfileController;


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('two-step-verification', [AuthController::class, 'twoStepVerification']);
Route::post('resend-otp', [AuthController::class, 'resendOtp']);

Route::middleware('auth:user_api')->group(function () {
    Route::get('profile', [ProfileController::class, 'profile']);
    Route::post('logout', [AuthController::class, 'logout']);
});
