<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class TicketPricing extends Model
{
    protected $fillable = [
        'type',
        'direction',
        'price',
        'offer_quantity',
        'remain_quantity',
        'started_at',
        'ended_at',
    ];

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
