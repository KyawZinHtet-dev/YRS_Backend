<?php

namespace App\Http\Resources;

use App\Models\Station;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RouteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $origin_station = $request->origin_station_slug ? $this->stations->where('slug', $request->origin_station_slug)->first() : $this->stations->first();
        $destination_station = $request->destination_station_slug ? $this->stations->where('slug', $request->destination_station_slug)->first() : $this->stations->last();

        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'direction' => $this->acsr_direction,
            'text' => $origin_station->title . ' (' . Carbon::parse($origin_station->pivot->time)->format('h:i A') . ')' . ' - ' . $destination_station->title . ' (' . Carbon::parse($destination_station->pivot->time)->format('h:i A') . ')',
        ];
    }
}
