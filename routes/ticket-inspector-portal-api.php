<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TicketInspectorPortal\AuthController;
use App\Http\Controllers\Api\TicketInspectorPortal\ProfileController;

Route::post('login', [AuthController::class, 'login']);
Route::post('two-step-verification', [AuthController::class, 'twoStepVerification']);
Route::post('resend-otp', [AuthController::class, 'resendOtp']);

Route::middleware(['auth:ticket_inspector_api', 'verified'])->group(function () {
    Route::get('profile', [ProfileController::class, 'profile']);
    Route::post('change-password', [ProfileController::class, 'changePassword']);
    Route::post('logout', [AuthController::class, 'logout']);
});
