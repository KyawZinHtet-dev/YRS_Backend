<?php

namespace App\Http\Resources\UserPortal;

use App\Repositories\QRRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'qr' => (new QRRepository)->generate($this->ticket_number)->token,
            'ticket_number' => $this->ticket_number,
            'type' => $this->acsr_type,
            'direction' => $this->acsr_direction,
            'price' => number_format($this->price) . ' MMK',
            'is_expired' => Carbon::parse($this->expired_at)->isPast(),
            'valid_at' => Carbon::parse($this->valid_at)->format('Y-m-d H:i:s'),
            'expired_at' => Carbon::parse($this->expired_at)->format('Y-m-d H:i:s'),
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
