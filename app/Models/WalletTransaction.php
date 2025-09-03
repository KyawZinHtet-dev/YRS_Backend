<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    protected $fillable = [
        'wallet_id',
        'transaction_id',
        'user_id',
        'amount',
        'description',
        'sourceable_id',
        'sourceable_type',
        'type',
        'method',
    ];

    protected function type(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                switch ($attributes['type']) {
                    case 'manual':
                        $value = 'Manual';
                        break;
                    case 'top_up':
                        $value = 'Top Up';
                        break;
                    case 'buy_ticket':
                        $value = 'Buy Ticket';
                        break;
                    default:
                        $value = $attributes['type'];
                }

                return $value;
            }
        );
    }

    // public function wallet()
    // {
    //     return $this->belongsTo(Wallet::class);
    // }

    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }

    public function sourceable()
    {
        return $this->morphTo();
    }
}
