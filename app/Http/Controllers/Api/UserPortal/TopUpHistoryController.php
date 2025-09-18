<?php

namespace App\Http\Controllers\Api\UserPortal;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserPortal\TopUpHistoryDetailResource;
use Illuminate\Http\Request;
use App\Http\Resources\UserPortal\TopUpHistoryResource;
use App\Repositories\TopUpHistoryRepository;
use App\Services\ResponseService;

class TopUpHistoryController extends Controller
{
    public function __construct(protected TopUpHistoryRepository $topUpHistoryRepository) {}

    public function index(Request $request)
    {
        $user = auth('user_api')->user();
        $top_up_histories = $this->topUpHistoryRepository->queryByUser($user)
            ->orderBy('updated_at', 'desc')
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    return $q->where('transaction_id', 'like', '%' . $request->search . '%')
                        ->orWhere('amount', 'like', '%' . $request->search . '%')
                        ->orWhere('created_at', 'like', '%' . $request->search . '%');
                });
            })
            ->paginate(10);;
        return TopUpHistoryResource::collection($top_up_histories)->additional([
            'message' => 'success',
        ]);
    }

    public function show($trx_id)
    {
        $user = auth('user_api')->user();
        $top_up_history = $this->topUpHistoryRepository->queryByUser($user)
            ->with(['user:id,name,email'])
            ->where('transaction_id', $trx_id)
            ->firstOrFail();
        return ResponseService::success(data: new TopUpHistoryDetailResource($top_up_history), message: 'success');
    }
}
