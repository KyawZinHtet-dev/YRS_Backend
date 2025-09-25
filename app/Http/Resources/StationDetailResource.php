<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StationDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'clockwise_route_schedules' => RouteScheduleOfStationResource::collection($this->routes->where('direction', 'clockwise')),
            'anticlockwise_route_schedules' => RouteScheduleOfStationResource::collection($this->routes->where('direction', 'anticlockwise')),
        ];
    }
}
