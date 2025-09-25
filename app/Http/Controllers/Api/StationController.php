<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StationDetailResource;
use App\Http\Resources\StationResource;
use App\Repositories\StationRepository;
use App\Services\ResponseService;
use Illuminate\Http\Request;

class StationController extends Controller
{
    public function __construct(protected StationRepository $stationRepository) {}

    public function index(Request $request)
    {
        $stations = $this->stationRepository->query()
            ->orderBy('updated_at', 'desc')
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    return $q->where('title', 'like', '%' . $request->search . '%')
                        ->orWhere('description', 'like', '%' . $request->search . '%');
                });
            })
            ->paginate(10);;
        return StationResource::collection($stations)->additional([
            'message' => 'success',
        ]);
    }

    public function show($slug)
    {
        $station = $this->stationRepository->queryBySlug($slug)
            ->with(['routes'])
            ->firstOrFail();
        return ResponseService::success(data: new StationDetailResource($station), message: 'success');
    }

    public function stationsByRegion(Request $request)
    {
        $stations = $this->stationRepository->query()
            ->whereBetween('latitude', [$request->south_west_latitude, $request->north_east_latitude])
            ->whereBetween('longitude', [$request->south_west_longitude, $request->north_east_longitude])
            ->take(20)
            ->get();
        return StationResource::collection($stations)->additional([
            'message' => 'success',
        ]);
    }
}
