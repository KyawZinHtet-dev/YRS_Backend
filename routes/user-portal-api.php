<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserPortal\AuthController;
use App\Http\Controllers\Api\UserPortal\TopUpController;
use App\Http\Controllers\Api\UserPortal\ProfileController;
use App\Http\Controllers\Api\UserPortal\TopUpHistoryController;
use App\Http\Controllers\Api\UserPortal\WalletTransactionController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('two-step-verification', [AuthController::class, 'twoStepVerification']);
Route::post('resend-otp', [AuthController::class, 'resendOtp']);

Route::middleware('auth:user_api')->group(function () {
    Route::get('profile', [ProfileController::class, 'profile']);
    Route::post('change-password', [ProfileController::class, 'changePassword']);
    Route::post('logout', [AuthController::class, 'logout']);

    // Wallet Transactions
    Route::get('wallet-transactions', [WalletTransactionController::class, 'index']);
    Route::get('wallet-transactions/{trx_id}', [WalletTransactionController::class, 'show']);

    // Top Up History
    Route::get('top-up-history', [TopUpHistoryController::class, 'index']);
    Route::get('top-up-history/{trx_id}', [TopUpHistoryController::class, 'show']);

    // Top Up
    Route::post('top-up', [TopUpController::class, 'topUp']);
});
