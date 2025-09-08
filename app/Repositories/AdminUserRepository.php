<?php

namespace App\Repositories;

use App\Models\AdminUser;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class AdminUserRepository implements BaseRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new AdminUser();
    }

    public function dataTable(Request $request)
    {
        $query = $this->model->query();
        return $query
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')->orWhere('email', 'like', '%' . $request->search . '%');
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
        $admin_user = $this->model->find($id);
        $admin_user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'] ? $data['password'] : $admin_user->password,
            'updated_at' => now(),
        ]);
        return $admin_user;
    }

    public function delete($id)
    {
        $admin_user = $this->model->find($id);
        $admin_user->delete();
        return $admin_user;
    }
}
