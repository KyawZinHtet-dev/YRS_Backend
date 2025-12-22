<?php

namespace App\Repositories;

use App\Models\WalletTransaction;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class WalletTransactionRepository implements BaseRepository
{
    protected $model;
    public function __construct()
    {
        $this->model = new WalletTransaction();
    }

    public function dataTable(Request $request)
    {
        $query = $this->model->query()->join('users', 'wallet_transactions.user_id', '=', 'users.id')->select('wallet_transactions.*', 'users.email as user_email');
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

    public function all() {}

    public function find($id) {}

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data) {}

    public function delete($id) {}

    public function queryByUser($user)
    {
        return $this->model->where('user_id', $user->id);
    }
}
