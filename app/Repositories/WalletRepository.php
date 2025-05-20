<?php

namespace App\Repositories;

use App\Models\Wallet;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Contracts\BaseRepository;

class WalletRepository implements BaseRepository
{
    protected $model;

    public function __construct(Wallet $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->orderBy('updated_at', 'desc')->with('user')->get();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

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
