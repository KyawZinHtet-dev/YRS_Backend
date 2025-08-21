<?php

namespace App\Repositories;

use App\Models\Route;
use App\Models\RouteStation;
use App\Models\Station;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Contracts\BaseRepository;

class RouteStationRepository implements BaseRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new RouteStation();
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

    public function deleteByRoute($route_id)
    {
        return $this->model->where('route_id', $route_id)->delete();
    }
}
