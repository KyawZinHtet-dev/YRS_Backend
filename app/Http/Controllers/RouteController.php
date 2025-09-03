<?php

namespace App\Http\Controllers;


use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Repositories\RouteRepository;
use App\Repositories\RouteStationRepository;
use App\Http\Requests\Route\RouteStoreRequest;

class RouteController extends Controller
{
    protected $routeRepository;
    protected $routeStationRepository;
    public function __construct()
    {
        $this->routeRepository = new RouteRepository();
        $this->routeStationRepository = new RouteStationRepository();
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $routes = $this->routeRepository->dataTable($request);
        return inertia('routes/index', ['routes' => $routes]);
    }

    public function combobox(Request $request)
    {
        try {
            $stations = $this->routeRepository->combobox($request);
            return response()->json($stations);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RouteStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $route = $this->routeRepository->create([
                'slug' => Str::slug($request->input('title')) . '-' . Str::random(5),
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'direction' => $request->input('direction'),
            ]);
            $schedule = collect($request->input('schedule'))->mapWithKeys(function ($item) {
                return [$item['station_id'] => ['time' => $item['time'], 'created_at' => now(), 'updated_at' => now()]];
            });
            $route->stations()->sync($schedule);
            DB::commit();
            return back()->with('response', ['status' => 'success', 'message' => 'Route created successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RouteStoreRequest $request, string $id)
    {
        DB::beginTransaction();
        try {
            $route = $this->routeRepository->update($id, [
                'slug' => Str::slug($request->input('title')) . '-' . Str::random(5),
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'direction' => $request->input('direction'),
                'updated_at' => now(),
            ]);
            $schedule = collect($request->input('schedule'))->mapWithKeys(function ($item) {
                return [$item['station_id'] => ['time' => $item['time'], 'created_at' => now(), 'updated_at' => now()]];
            });
            $route->stations()->sync($schedule);
            DB::commit();
            return back()->with('response', ['status' => 'success', 'message' => 'Route updated successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();
        try {
            $this->routeRepository->delete($id);
            $this->routeStationRepository->deleteByRoute($id);
            DB::commit();
            return back()->with('response', ['status' => 'success', 'message' => 'Route deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
