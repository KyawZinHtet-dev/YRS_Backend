<?php

namespace App\Repositories;

use App\Models\Ticket;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class TicketRepository implements BaseRepository
{
    protected $model;
    public function __construct()
    {
        $this->model = new Ticket();
    }

    public function dataTable(Request $request)
    {
        $query = $this->model->query()->join('users', 'tickets.user_id', '=', 'users.id')->select('tickets.*', 'users.email as user_email');
        return $query
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where('ticket_number', 'like', '%' . $request->search . '%')->orWhere('users.email', 'like', '%' . $request->search . '%');
            })
            ->when($request->has('col') && $request->has('dir'), function ($q) use ($request) {
                $q->orderBy($request->col, $request->dir);
            })
            ->when(!$request->has('col') && !$request->has('dir'), function ($q) {
                $q->orderBy('updated_at', 'desc');
            })
            ->paginate($request->has('paginate') ? $request->paginate : 5)->appends($request->all());
    }

    public function all() {}

    public function find($id) {}

    public function create(array $data) {}

    public function update($id, array $data) {}

    public function delete($id) {}
}
