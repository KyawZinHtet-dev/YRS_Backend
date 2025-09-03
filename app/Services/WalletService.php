<?php

namespace App\Services;

use Illuminate\Support\Str;
use App\Models\WalletTransaction;
use App\Repositories\WalletRepository;
use App\Repositories\WalletTransactionRepository;

class WalletService
{
    public static function addBalance(array $data)
    {
        // Wallet add balance
        $wallet = (new WalletRepository())->addBalance($data['wallet_id'], $data['amount']);

        // Wallet Transaction
        (new WalletTransactionRepository())->create([
            "transaction_id" => Str::random(10),
            'wallet_id' => $wallet->id,
            'user_id' => $wallet->user_id,
            'amount' => $data['amount'],
            'description' => $data['description'],
            'sourceable_id' => $data['sourceable_id'],
            'sourceable_type' => $data['sourceable_type'],
            'type' => $data['type'],
            'method' => 'add',
        ]);
    }

    public static function reduceBalance(array $data)
    {
        // Wallet reduce balance
        $wallet = (new WalletRepository())->reduceBalance($data['wallet_id'], $data['amount']);

        // Wallet Transaction
        (new WalletTransactionRepository())->create([
            'wallet_id' => $wallet->id,
            "transaction_id" => Str::random(10),
            'user_id' => $wallet->user_id,
            'amount' => $data['amount'],
            'description' => $data['description'],
            'sourceable_id' => $data['sourceable_id'],
            'sourceable_type' => $data['sourceable_type'],
            'type' => $data['type'],
            'method' => 'reduce',
        ]);
    }
}
