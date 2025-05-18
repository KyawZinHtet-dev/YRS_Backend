<?php

namespace App\Repositories;

use App\Models\TicketInspector;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Contracts\BaseRepository;

class TicketInspectorRepository implements BaseRepository
{
    protected $model;

    public function __construct(TicketInspector $model)
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
        $ticket_inspector = $this->model->find($id);
        $ticket_inspector->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'] ? Hash::make($data['password']) : $ticket_inspector->password,
            'updated_at' => now(),
        ]);
        return $ticket_inspector;
    }

    public function delete($id)
    {
        $ticket_inspector = $this->model->find($id);
        $ticket_inspector->delete();
        return $ticket_inspector;
    }
}
