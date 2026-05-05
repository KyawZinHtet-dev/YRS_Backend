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

    protected function acsrMethod(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                switch ($attributes['method']) {
                    case 'add':
                        $text = 'Add';
                        $sign = '+';
                        $color = 'bg-green-500 dark:bg-green-600';
                        break;
                    case 'reduce':
                        $text = 'Reduce';
                        $sign = '-';
                        $color = 'bg-rose-500 dark:bg-rose-600';
                        break;
                    default:
                        $text = '';
                        $sign = '';
                        $color = '';
                        break;
                }
                return [
                    'text' => $text,
                    'sign' => $sign,
                    'color' => $color
                ];
            },
        );
    }

    protected function acsrType(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                switch ($attributes['type']) {
                    case 'manual':
                        $text = 'Manual';
                        $color = 'bg-sky-500 dark:bg-sky-600';
                        $icon = asset('images/transaction.png');
                        break;
                    case 'top_up':
                        $text = 'Top Up';
                        $color = 'bg-purple-500 dark:bg-purple-600';
                        $icon = asset('images/top-up.png');
                        break;
                    case 'buy_ticket':
                        $text = 'Buy Ticket';
                        $color = 'bg-amber-500 dark:bg-amber-600';
                        $icon = asset('images/buy-ticket.png');
                        break;
                    default:
                        $text = '';
                        $color = '';
                        $icon = '';
                        break;
                }
                return [
                    'text' => $text,
                    'color' => $color,
                    'icon' => $icon
                ];
            },
        );
    }

    protected function acsrFrom(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                switch ($attributes['method']) {
                    case 'add':
                        $from = $this->acsr_type['text'];
                        break;
                    case 'reduce':
                        $from = $this->user->name;
                        break;
                    default:
                        $from = '';
                        break;
                }
                return $from;
            },
        );
    }

    protected function acsrTo(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                switch ($attributes['method']) {
                    case 'add':
                        $to = $this->user->name;
                        break;
                    case 'reduce':
                        $to = $this->acsr_type['text'];
                        break;
                    default:
                        $to = '';
                        break;
                }
                return $to;
            },
        );
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sourceable()
    {
        return $this->morphTo();
    }
}
