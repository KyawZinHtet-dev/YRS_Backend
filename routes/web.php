<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\TicketInspectorController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WalletController;

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';


Route::middleware(['auth:admin_user', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard');
    })->name('home');
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('admin-users', AdminUserController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('ticket-inspectors', TicketInspectorController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('wallets', WalletController::class)->only(['index']);
});
