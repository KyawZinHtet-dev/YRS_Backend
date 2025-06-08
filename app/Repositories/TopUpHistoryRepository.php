<?php

namespace App\Repositories;

use App\Models\TopUpHistory;
use App\Models\WalletTransaction;
use App\Repositories\Contracts\BaseRepository;
use App\Services\WalletService;
use Illuminate\Http\Request;

class TopUpHistoryRepository implements BaseRepository
{
    protected $model;
    public function __construct()
    {
        $this->model = new TopUpHistory();
    }

    public function dataTable(Request $request)
    {
        $query = $this->model->query()->join('users', 'top_up_histories.user_id', '=', 'users.id')->select('top_up_histories.*', 'users.email as user_email');
        return $query
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where('transaction_id', 'like', '%' . $request->search . '%')->orWhere('users.email', 'like', '%' . $request->search . '%');
            })
            ->when($request->has('col') && $request->has('dir'), function ($q) use ($request) {
                $q->orderBy($request->col, $request->dir);
            })
            ->when(!$request->has('col') && !$request->has('dir'), function ($q) {
                $q->orderBy('updated_at', 'desc');
            })
            ->paginate($request->has('paginate') ? $request->paginate : 5)->appends($request->all());
    }

    public function approve($id)
    {
        $record = $this->model->lockForUpdate()->find($id);
        if ($record->status !== 'pending') {
            throw new \Exception('Top up is already approved or rejected.');
        }
        $record->update(['status' => 'approve', 'approved_at' => date('Y-m-d H:i:s')]);
        WalletService::addBalance(
            [
                'wallet_id' => $record->wallet_id,
                'amount' => $record->amount,
                'description' => $record->description,
                'sourceable_id' => $record->id,
                'sourceable_type' => TopUpHistory::class,
                'type' => 'top_up',
            ]
        );
        return $record;
    }

    public function reject($id)
    {
        $record = $this->model->lockForUpdate()->find($id);
        if ($record->status !== 'pending') {
            throw new \Exception('Top up is already approved or rejected.');
        }
        $record->update(['status' => 'reject', 'rejected_at' => date('Y-m-d H:i:s')]);
        return $record;
    }

    public function all() {}

    public function find($id) {}

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        return $this->model->find($id)->update($data);
    }

    public function delete($id) {}
}
