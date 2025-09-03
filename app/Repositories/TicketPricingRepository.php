<?php

namespace App\Repositories;

use App\Models\AdminUser;
use App\Models\TicketPricing;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class TicketPricingRepository implements BaseRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new TicketPricing();
    }

    public function dataTable(Request $request)
    {
        $query = $this->model->query();
        return $query
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where('type', 'like', '%' . $request->search . '%')->orWhere('price', 'like', '%' . $request->search . '%');
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
        $ticket_pricing = $this->model->find($id);
        $ticket_pricing->update($data);
        return $ticket_pricing;
    }

    public function delete($id)
    {
        $ticket_pricing = $this->model->find($id);
        $ticket_pricing->delete();
        return $ticket_pricing;
    }
}
