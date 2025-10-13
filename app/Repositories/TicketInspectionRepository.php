<?php

namespace App\Repositories;

use App\Models\TicketInspection;
use App\Repositories\Contracts\BaseRepository;

class TicketInspectionRepository implements BaseRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new TicketInspection();
    }

    public function all()
    {
        return $this->model->orderBy('updated_at', 'desc')->get();
    }

    public function queryByTicketInspector($ticket_inspector)
    {
        return $this->model->where('ticket_inspector_id', $ticket_inspector->id);
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function findByTicketId($ticket_id)
    {
        return $this->model->where('ticket_id', $ticket_id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $inspection = $this->model->find($id);
        $inspection->update($data);
        return $inspection;
    }

    public function delete($id)
    {
        $inspection = $this->model->find($id);
        $inspection->delete();
        return $inspection;
    }
}
