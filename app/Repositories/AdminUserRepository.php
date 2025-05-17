<?php

namespace App\Repositories;

use App\Models\AdminUser;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Contracts\BaseRepository;

class AdminUserRepository implements BaseRepository
{
    protected $model;

    public function __construct(AdminUser $model)
    {
        $this->model = $model;
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
            'password' => $data['password'] ? Hash::make($data['password']) : $admin_user->password,
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
