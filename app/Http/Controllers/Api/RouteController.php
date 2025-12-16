<?php

namespace App\Http\Controllers\Api;

use App\Models\Station;
use App\Models\RouteStation;
use Illuminate\Http\Request;
use App\Services\ResponseService;
use App\Http\Controllers\Controller;
use App\Http\Resources\RouteResource;
use App\Repositories\RouteRepository;
use App\Http\Resources\RouteDetailResource;

class RouteController extends Controller
{

    public function __construct(protected RouteRepository $routeRepository) {}

    public function index(Request $request)
    {
        $routes = $this->routeRepository->query()
            ->with('stations')
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    return $q->where('title', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->has('direction'), function ($q) use ($request) {
                if ($request->direction) {
                    $q->where(function ($q) use ($request) {
                        return $q->where('direction', 'like', $request->direction);
                    });
                }
            })
            ->when($request->has('origin_station_slug') && $request->has('destination_station_slug'), function ($q) use ($request) {
                $origin_station = Station::where('slug', $request->origin_station_slug)->firstOrFail();
                $destination_station = Station::where('slug', $request->destination_station_slug)->firstOrFail();

                $route_ids = RouteStation::select('rs1.route_id')
                    ->from('route_stations as rs1')
                    ->join('route_stations as rs2', function ($join) use ($destination_station) {
                        $join->on('rs1.route_id', '=', 'rs2.route_id')->where('rs2.station_id', '=', $destination_station->id);
                    })
                    ->where('rs1.station_id', '=', $origin_station->id)
                    ->whereRaw('rs1.id < rs2.id')
                    ->orderBy('rs1.time')
                    ->pluck('rs1.route_id')
                    ->toArray();

                $q->whereIn('id', $route_ids);
            })
            ->paginate(10)->appends($request->all());
        return RouteResource::collection($routes)->additional([
            'message' => 'success',
        ]);
    }

    public function show($slug)
    {
        $station = $this->routeRepository->queryBySlug($slug)
            ->with(['stations'])
            ->firstOrFail();
        return ResponseService::success(data: new RouteDetailResource($station), message: 'success');
    }
}
