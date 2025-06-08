<?php

namespace App\Http\Controllers;

use App\Repositories\TopUpHistoryRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TopUpHistoryController extends Controller
{
    protected $topUpHistoryRepository;

    public function __construct()
    {
        $this->topUpHistoryRepository = new TopUpHistoryRepository();
    }

    public function index(Request $request)
    {
        $top_up_histories = $this->topUpHistoryRepository->dataTable($request);
        return inertia('top-up-history/index', ['top_up_histories' => $top_up_histories]);
    }

    public function approve($id)
    {
        DB::beginTransaction();
        try {
            $this->topUpHistoryRepository->approve($id);
            DB::commit();
            return back()->with('response', ['status' => 'success', 'message' => 'Top up approved successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function reject($id)
    {
        DB::beginTransaction();
        try {
            $this->topUpHistoryRepository->reject($id);
            DB::commit();
            return back()->with('response', ['status' => 'success', 'message' => 'Top up rejected successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
