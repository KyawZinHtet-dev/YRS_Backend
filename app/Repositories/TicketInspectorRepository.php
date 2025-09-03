<?php

namespace App\Repositories;

use Illuminate\Http\Request;
use App\Models\TicketInspector;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Contracts\BaseRepository;

class TicketInspectorRepository implements BaseRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new TicketInspector();
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
