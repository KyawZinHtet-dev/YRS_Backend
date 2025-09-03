<?php

namespace App\Http\Controllers;

use App\Http\Requests\Wallet\WalletBalanceStoreRequest;
use App\Repositories\WalletRepository;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        try {
            $wallets = $this->walletRepository->combobox($request);
            return response()->json($wallets);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function addBalance(WalletBalanceStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            WalletService::addBalance(
                [
                    'wallet_id' => $request->wallet_id,
                    'amount' => $request->amount,
                    'description' => $request->description,
                    'sourceable_id' => null,
                    'sourceable_type' => null,
                    'type' => 'manual',
                ]
            );
            DB::commit();
            return back()->with('response', ['status' => 'success', 'message' => 'Balance added successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function reduceBalance(WalletBalanceStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            WalletService::reduceBalance(
                [
                    'wallet_id' => $request->wallet_id,
                    'amount' => $request->amount,
                    'description' => $request->description,
                    'sourceable_id' => null,
                    'sourceable_type' => null,
                    'type' => 'manual',
                ]
            );
            DB::commit();
            return back()->with('response', ['status' => 'success', 'message' => 'Balance reduced successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
