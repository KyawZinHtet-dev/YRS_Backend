<?php

namespace App\Http\Controllers;

use App\Repositories\WalletRepository;

class WalletController extends Controller
{
    protected $walletRepository;
    public function __construct(WalletRepository $walletRepository)
    {
        $this->walletRepository = $walletRepository;
    }

    public function index()
    {
        $wallets = $this->walletRepository->all();
        return inertia('wallets/index', ['wallets' => $wallets]);
    }
}
