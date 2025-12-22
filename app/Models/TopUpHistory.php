<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class TopUpHistory extends Model
{
    protected $fillable = [
        'transaction_id',
        "user_id",
        "wallet_id",
        "amount",
        'description',
        'image',
        'status',
        'approved_at',
        'rejected_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected function acsrImagePath(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                return asset('storage/top-up-images/' . $attributes['image']);
            },
        );
    }


    protected function acsrStatus(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                switch ($attributes['status']) {
                    case 'pending':
                        $text = 'Pending';
                        $color = 'text-orange-500 hover:text-orange-600';
                        break;
                    case 'approve':
                        $text = 'Approve';
                        $color = 'text-green-500 hover:text-green-600';
                        break;
                    case 'reject':
                        $text = 'Reject';
                        $color = 'text-rose-500 hover:text-rose-600';
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
