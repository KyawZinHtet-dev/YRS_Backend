<?php

namespace App\Http\Controllers;


use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Repositories\StationRepository;
use App\Http\Requests\Station\StationStoreRequest;

class StationController extends Controller
{
    protected $stationRepository;
    protected $walletRepository;
    public function __construct()
    {
        $this->stationRepository = new StationRepository();
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $stations = $this->stationRepository->dataTable($request);
        return inertia('stations/index', ['stations' => $stations]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StationStoreRequest $request)
    {
        try {
            $location = explode(',', $request->input('location'));
            $this->stationRepository->create([
                'slug' => Str::slug($request->input('title')) . '-' . Str::random(5),
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'latitude' => $location[0],
                'longitude' => $location[1],
            ]);
            return back()->with('response', ['status' => 'success', 'message' => 'Station created successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StationStoreRequest $request, string $id)
    {
        try {
            $location = explode(',', $request->input('location'));
            $this->stationRepository->update($id, [
                'slug' => Str::slug($request->input('title')) . '-' . Str::random(5),
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'latitude' => $location[0],
                'longitude' => $location[1],
            ]);
            return back()->with('response', ['status' => 'success', 'message' => 'Station updated successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->stationRepository->delete($id);
            return back()->with('response', ['status' => 'success', 'message' => 'Station deleted successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
