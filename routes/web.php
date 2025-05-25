<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\TicketInspectorController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WalletController;
use App\Models\AdminUser;
use App\Models\Wallet;
use Illuminate\Http\Request;

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
    Route::get('wallets/test', function (Request $request) {
        $query = Wallet::join('users', 'wallets.user_id', '=', 'users.id')
            ->select('wallets.*', 'users.name', 'users.email');
        $wallets =  $query
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where('users.name', 'like', '%' . $request->search . '%')->orWhere('users.email', 'like', '%' . $request->search . '%');
            })
            ->when($request->has('col') && $request->has('dir'), function ($q) use ($request) {
                if ($request->col == 'user_name') {
                    $request->col = 'users.name';
                }
                if ($request->col == 'user_email') {
                    $request->col = 'users.email';
                }
                $q->orderBy($request->col, $request->dir);
            })
            ->when(!$request->has('col') && !$request->has('dir'), function ($q) {
                $q->orderBy('updated_at', 'desc');
            })
            ->paginate($request->has('paginate') ? $request->paginate : 5)->appends($request->all());
        return $wallets;
    })->name('wallets.test');

    Route::resource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('ticket-inspectors', TicketInspectorController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);

    Route::resource('wallets', WalletController::class)->only(['index']);
    Route::post('wallets/{wallet}/add', [WalletController::class, 'deposit'])->name('wallets.add');
    Route::post('wallets/{wallet}/reduce', [WalletController::class, 'withdraw'])->name('wallets.reduce');
});
