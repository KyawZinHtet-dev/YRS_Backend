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

    public function combobox(Request $request)
    {
        $wallets = $this->walletRepository->combobox($request);
        return response()->json($wallets);
    }
}
