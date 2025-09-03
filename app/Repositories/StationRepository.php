<?php

namespace App\Repositories;

use App\Models\Station;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class StationRepository implements BaseRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new Station();
    }

    public function dataTable(Request $request)
    {
        $query = $this->model->query();
        return $query
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')->orWhere('description', 'like', '%' . $request->search . '%');
            })
            ->when($request->has('col') && $request->has('dir'), function ($q) use ($request) {
                $q->orderBy($request->col, $request->dir);
            })
            ->when(!$request->has('col') && !$request->has('dir'), function ($q) {
                $q->orderBy('updated_at', 'desc');
            })
            ->paginate($request->has('paginate') ? $request->paginate : 5)->appends($request->all());
    }

    public function all()
    {
        return $this->model->orderBy('updated_at', 'desc')->get();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $station = $this->model->find($id);
        $station->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'updated_at' => now(),
        ]);
        return $station;
    }

    public function delete($id)
    {
        $station = $this->model->find($id);
        $station->delete();
        return $station;
    }
}
