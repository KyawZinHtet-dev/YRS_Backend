<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\TopUpHistoryController;
use App\Http\Controllers\TicketInspectorController;
use App\Http\Controllers\TicketPricingController;
use App\Http\Controllers\WalletTransactionController;

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

    Route::resource('ticket-inspectors', TicketInspectorController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);

    Route::resource('wallets', WalletController::class)->only(['index']);
    Route::get('wallets/combobox', [WalletController::class, 'combobox'])->name('wallets.combobox');
    Route::post('wallets/balance/add', [WalletController::class, 'addBalance'])->name('wallets.balance.add');
    Route::post('wallets/balance/reduce', [WalletController::class, 'reduceBalance'])->name('wallets.balance.reduce');

    Route::resource('wallet-transactions', WalletTransactionController::class)->only(['index']);

    Route::resource('top-up-history', TopUpHistoryController::class)->only(['index']);
    Route::post('top-up-history/${id}/approve', [TopUpHistoryController::class, 'approve'])->name('top-up-history.approve');
    Route::post('top-up-history/${id}/reject', [TopUpHistoryController::class, 'reject'])->name('top-up-history.reject');

    Route::resource('stations', StationController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('routes', RouteController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('routes/combobox', [RouteController::class, 'combobox'])->name('routes.combobox');

    Route::resource('ticket-pricings', TicketPricingController::class)->only(['index', 'store', 'update', 'destroy']);
});
