<?php

namespace App\Repositories;

use App\Models\WalletTransaction;
use App\Repositories\Contracts\BaseRepository;

class WalletTransactionRepository implements BaseRepository
{
    protected $walletTransaction;
    public function __construct()
    {
        $this->walletTransaction = new WalletTransaction();
    }

    public function all() {}

    public function find($id) {}

    public function create(array $data)
    {
        return $this->walletTransaction->create($data);
    }

    public function update($id, array $data) {}

    public function delete($id) {}
}
