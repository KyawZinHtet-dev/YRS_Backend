<?php

namespace App\Services;

use App\Repositories\QRRepository;
use App\Repositories\RouteRepository;
use App\Repositories\TicketInspectionRepository;
use App\Repositories\TicketRepository;

class TicketInspectionService
{
    static function scanQR($ticket_inspector, $route_slug, $qr_token)
    {
        $route = (new RouteRepository())->queryBySlug($route_slug)->first();
        if (!$route) {
            throw new \Exception('Route not found');
        }
        $qr = (new QRRepository)->findByToken($qr_token)->first();
        if (!$qr) {
            throw new \Exception('QR is invalid');
        }
        if ($qr->expired_at < date('Y-m-d H:i:s')) {
            throw new \Exception('QR is expired');
        }
        $ticket = (new TicketRepository)->findByTicketNumber($qr->ticket_number)->first();
        if (!$ticket) {
            throw new \Exception('Ticket not found');
        }
        if (!($ticket->valid_at <= date('Y-m-d H:i:s') && $ticket->expired_at >= date('Y-m-d H:i:s'))) {
            throw new \Exception('Ticket is expired');
        }
        if ($ticket->type === 'one_time_ticket') {
            if ($ticket->direction !== $route->direction) {
                throw new \Exception('Ticket is not valid for this route');
            }
            if ((new TicketInspectionRepository)->findByTicketId($ticket->id)->exists()) {
                throw new \Exception('Ticket is already used');
            }
        }
        $inspection = (new TicketInspectionRepository)->create([
            'ticket_id' => $ticket->id,
            'ticket_inspector_id' => $ticket_inspector->id,
            'route_id' => $route->id
        ]);
        return $inspection;
    }
}
