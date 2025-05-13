<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminUserController;


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';


Route::middleware(['auth:admin_user', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard');
    })->name('home');
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('users', function () {
        return Inertia::render('users');
    });

    Route::resource('admin-users', AdminUserController::class)->only(['index', 'store', 'update', 'destroy']);
});
