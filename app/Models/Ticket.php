<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Ticket extends Model
{
    protected $fillable = [
        'ticket_number',
        'user_id',
        'ticket_pricing_id',
        'type',
        'direction',
        'price',
        'valid_at',
        'expired_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function ticket_pricing()
    {
        return $this->belongsTo(TicketPricing::class, 'ticket_pricing_id', 'id');
    }

    protected function acsrType(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                switch ($attributes['type']) {
                    case 'one_time_ticket':
                        $text = 'One Time Ticket';
                        $color = 'text-primary';
                        $icon = asset('storage/images/one-time-ticket.png');
                        break;
                    case 'one_month_ticket':
                        $text = 'One Month Ticket';
                        $color = 'text-amber-600';
                        $icon = asset('storage/images/one-month-ticket.png');
                        break;
                    default:
                        $text = '';
                        $color = '';
                        $icon = asset('storage/images/ticket.png');
                        break;
                }
                return [
                    'text' => $text,
                    'color' => $color,
                    'icon' => $icon,
                ];
            },
        );
    }

    protected function acsrDirection(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                switch ($attributes['direction']) {
                    case 'clockwise':
                        $text = 'Clockwise';
                        $color = 'text-green-500';
                        break;
                    case 'anticlockwise':
                        $text = 'Anticlockwise';
                        $color = 'text-red-500';
                        break;
                    case 'both':
                        $text = 'Both';
                        $color = 'text-amber-500';
                        break;
                    default:
                        $text = '';
                        $color = '';
                        break;
                }
                return [
                    'text' => $text,
                    'color' => $color,
                ];
            },
        );
    }
}
