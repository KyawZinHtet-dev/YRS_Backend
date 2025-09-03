<?php

namespace App\Repositories;

use App\Models\Wallet;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class WalletRepository implements BaseRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new Wallet();
    }

    public function dataTable(Request $request)
    {
        $query = $this->model->join('users', 'wallets.user_id', '=', 'users.id')
            ->select('wallets.*', 'users.name', 'users.email');
        return  $query
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where('users.name', 'like', '%' . $request->search . '%')->orWhere('users.email', 'like', '%' . $request->search . '%');
            })
            ->when($request->has('col') && $request->has('dir'), function ($q) use ($request) {
                $q->orderBy($request->col, $request->dir);
            })
            ->when(!$request->has('col') && !$request->has('dir'), function ($q) {
                $q->orderBy('updated_at', 'desc');
            })
            ->paginate($request->has('paginate') ? $request->paginate : 5)->appends($request->all());
    }

    public function combobox(Request $request)
    {
        $query = Wallet::join('users', 'wallets.user_id', '=', 'users.id')
            ->select('wallets.*', 'users.name', 'users.email');
        return $query
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where('users.email', 'like', '%' . $request->search . '%');
            })
            ->paginate($request->has('paginate') ? $request->paginate : 5)->appends($request->all());
    }

    public function addBalance($id, $amount)
    {
        $wallet = $this->model::lockForUpdate()->find($id);
        $wallet->increment('balance', $amount);
        $wallet->save();
        return $wallet;
    }

    public function reduceBalance($id, $amount)
    {
        $wallet = $this->model::lockForUpdate()->find($id);
        if ($wallet->balance < $amount) {
            throw new \Exception('Your balance is insufficient.');
        }
        $wallet->decrement('balance', $amount);
        $wallet->save();
        return $wallet;
    }

    public function all()
    {
        return $this->model->orderBy('updated_at', 'desc')->with('user')->get();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    // public function search($query, $offset, $size)
    // {
    //     return $this->model->whereHas('user', function ($q) use ($query) {
    //         $q->where('name', 'like', '%' . $query . '%');
    //         $q->orWhere('email', 'like', '%' . $query . '%');
    //     })->with('user')
    //         ->offset($offset)
    //         ->limit($size)
    //         ->orderBy('updated_at', 'desc')
    //         ->get();
    // }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function firstOrCreate(array $data1, array $data2)
    {
        return $this->model->firstOrCreate($data1, $data2);
    }

    public function update($id, array $data)
    {
        $wallet = $this->model->find($id);
        $wallet->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'] ? Hash::make($data['password']) : $wallet->password,
            'updated_at' => now(),
        ]);
        return $wallet;
    }

    public function delete($id)
    {
        $wallet = $this->model->find($id);
        $wallet->delete();
        return $wallet;
    }
}
