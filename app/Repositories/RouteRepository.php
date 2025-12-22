<?php

namespace App\Repositories;

use App\Models\Route;
use App\Models\Station;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Contracts\BaseRepository;

class RouteRepository implements BaseRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new Route();
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
            ->with('stations')
            ->paginate($request->has('paginate') ? $request->paginate : 5)->appends($request->all());
    }

    public function combobox(Request $request)
    {
        $query = Station::select(['id', 'title']);
        return $query
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%');
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
        $route = $this->model->find($id);
        $route->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'direction' => $data['direction'],
            'updated_at' => now(),
        ]);
        return $route;
    }

    public function delete($id)
    {
        $route = $this->model->find($id);
        $route->delete();
        return $route;
    }

    public function query()
    {
        return $this->model->query();
    }

    public function queryBySlug($slug)
    {
        return $this->model->where('slug', $slug);
    }
}
