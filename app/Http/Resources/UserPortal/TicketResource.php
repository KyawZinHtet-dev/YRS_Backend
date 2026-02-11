<?php

namespace App\Http\Resources\UserPortal;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'ticket_number' => $this->ticket_number,
            'type' => $this->acsr_type,
            'direction' => $this->acsr_direction,
            'is_expired' => Carbon::parse($this->expired_at)->isPast(),
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
