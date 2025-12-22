<?php

namespace App\Http\Resources\UserPortal;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TopUpHistoryDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'transaction_id' => $this->transaction_id,
            'amount' => number_format($this->amount) . ' MMK',
            'user' => $this->user ? [
                'name' => $this->user->name,
                'email' => $this->user->email,
            ] : null,
            'description' => $this->description,
            'status' => $this->acsr_status,
            'image' => $this->acsr_image_path,
            'approved_at' => $this->approved_at ? Carbon::parse($this->approved_at)->format('Y-m-d H:i:s') : null,
            'rejected_at' => $this->rejected_at ? Carbon::parse($this->rejected_at)->format('Y-m-d H:i:s') : null,
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
