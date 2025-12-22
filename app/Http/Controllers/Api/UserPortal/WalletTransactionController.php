<?php

namespace App\Http\Controllers\Api\UserPortal;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserPortal\WalletTransactionDetailResource;
use App\Http\Resources\UserPortal\WalletTransactionResource;
use App\Repositories\WalletTransactionRepository;
use App\Services\ResponseService;
use Illuminate\Http\Request;

class WalletTransactionController extends Controller
{
    public function __construct(protected WalletTransactionRepository $walletTransactionRepository) {}

    public function index(Request $request)
    {
        $user = auth('user_api')->user();
        $wallet_transactions = $this->walletTransactionRepository->queryByUser($user)
            ->orderBy('updated_at', 'desc')
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    return $q->where('transaction_id', 'like', '%' . $request->search . '%')
                        ->orWhere('amount', 'like', '%' . $request->search . '%')
                        ->orWhere('created_at', 'like', '%' . $request->search . '%');
                });
            })
            ->paginate(10);
        return WalletTransactionResource::collection($wallet_transactions)->additional([
            'message' => 'success',
        ]);
    }

    public function show($trx_id)
    {
        $user = auth('user_api')->user();
        $wallet_transaction = $this->walletTransactionRepository->queryByUser($user)
            ->with(['user:id,name,email', 'sourceable'])
            ->where('transaction_id', $trx_id)
            ->firstOrFail();
        return ResponseService::success(data: new WalletTransactionDetailResource($wallet_transaction), message: 'success');
    }
}
