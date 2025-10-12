<?php

namespace App\Repositories;

use App\Models\QR;
use Illuminate\Support\Str;
use App\Notifications\TwoStepVerification;
use Illuminate\Support\Facades\Notification;
use App\Repositories\Contracts\BaseRepository;

class QRRepository implements BaseRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new QR();
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
        $qr = $this->model->find($id);
        $qr->update($data);
        return $qr;
    }

    public function delete($id)
    {
        $qr = $this->model->find($id);
        $qr->delete();
        return $qr;
    }

    public function generate($ticket_number)
    {
        $qr = $this->model->where('ticket_number', $ticket_number)->where('expired_at', '>', date('Y-m-d H:i:s'))->first();
        if (!$qr) {
            $qr = $this->create([
                'ticket_number' => $ticket_number,
                'token' => Str::uuid(),
                'expired_at' => now()->addMinutes(5)->format('Y-m-d H:i:s'),
            ]);
        }
        return $qr;
    }

    public function regenerate($qr_token)
    {
        $qr = $this->model->where('token', $qr_token)->first();
        if (!$qr) {
            throw new \Exception('The given data is invalid');
        }
        $ticket_number = $qr->ticket_number;
        if ($qr->expired_at > date('Y-m-d H:i:s')) {
            throw new \Exception('QR is already sent for (#' . $ticket_number . '). It will expire in ' . now()->diff($qr->expired_at)->format('%i minutes %s seconds'));
        }
        $qr->delete();
        $qr = $this->generate($ticket_number);
        return $qr;
    }
}
