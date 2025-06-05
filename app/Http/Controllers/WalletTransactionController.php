<?php

namespace App\Http\Controllers;

use App\Repositories\WalletTransactionRepository;
use Illuminate\Http\Request;

class WalletTransactionController extends Controller
{
    protected $walletTransactionRepository;

    public function __construct()
    {
        $this->walletTransactionRepository = new WalletTransactionRepository();
    }

    public function index(Request $request)
    {
        $wallet_transactions = $this->walletTransactionRepository->dataTable($request);
        return inertia('wallet-transactions/index', ['wallet_transactions' => $wallet_transactions]);
    }
}
