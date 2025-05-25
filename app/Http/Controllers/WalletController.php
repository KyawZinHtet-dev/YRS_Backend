<?php

namespace App\Http\Controllers;

use App\Repositories\WalletRepository;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    protected $walletRepository;
    public function __construct(WalletRepository $walletRepository)
    {
        $this->walletRepository = $walletRepository;
    }

    public function index(Request $request)
    {
        $wallets = $this->walletRepository->dataTable($request);
        return inertia('wallets/index', ['wallets' => $wallets]);
    }

    public function search()
    {
        return response()->json([
            'wallets' => $this->walletRepository->search(request('query'), request('offset'), request('size')),
        ]);
    }
}
