<?php

namespace App\Http\Controllers\Api\UserPortal;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Services\ResponseService;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Repositories\TopUpHistoryRepository;

class TopUpController extends Controller
{
    public function __construct(protected TopUpHistoryRepository $topUpHistoryRepository) {}

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|integer|min:1',
            'description' => 'nullable|string|max:500',
            'image' => 'required|image|mimes:jpeg,png,jpg,heic|max:5120',
        ]);
        DB::beginTransaction();
        try {
            $user = auth('user_api')->user();
            $user_wallet = $user->wallet;
            if (!$user_wallet) {
                throw new \Exception('Wallet not found');
            }
            $image = $request->file('image');
            $image_name =  Str::random(6) . time() . '.' . $image->getClientOriginalExtension();
            Storage::put('top-up-images/' . $image_name, file_get_contents($image->getRealPath()));
            $top_up_history = $this->topUpHistoryRepository->create([
                'transaction_id' => Str::random(12),
                'user_id' => $user->id,
                'wallet_id' => $user_wallet->id,
                'amount' => $request->amount,
                'description' => $request->description,
                'image' => $image_name,
                'status' => 'pending',
            ]);
            DB::commit();
            return ResponseService::success(data: [
                'transaction_id' => $top_up_history->transaction_id,
            ], message: 'Successfully Requested For Top Up');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseService::fail($e->getMessage());
        }
    }
}
