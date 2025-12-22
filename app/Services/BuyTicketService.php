<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Ticket;
use App\Models\RouteStation;
use App\Repositories\RouteRepository;
use App\Repositories\TicketRepository;
use App\Repositories\StationRepository;
use App\Repositories\TicketPricingRepository;

class BuyTicketService
{
    static function create($user, $date_time, $type, $origin_station_slug, $destination_station_slug)
    {
        if ($type === 'one_time_ticket') {
            $origin_station = (new StationRepository)->queryBySlug($origin_station_slug)->first();
            if (!$origin_station) {
                throw new \Exception('Origin station not found');
            }
            $destination_station = (new StationRepository)->queryBySlug($destination_station_slug)->first();
            if (!$destination_station) {
                throw new \Exception('Destination station not found');
            }
            $route_id = optional(RouteStation::select('rs1.route_id')
                ->from('route_stations as rs1')
                ->join('route_stations as rs2', function ($join) use ($destination_station) {
                    $join->on('rs1.route_id', '=', 'rs2.route_id')->where('rs2.station_id', '=', $destination_station->id);
                })
                ->where('rs1.station_id', '=', $origin_station->id)
                ->whereRaw('rs1.id < rs2.id')
                ->orderBy('rs1.time')
                ->first())->route_id;
            $route = (new RouteRepository)->find($route_id);
            if (!$route) {
                throw new \Exception('Route not found');
            }
            $direction = $route->direction;
            $valid_at =  Carbon::parse($date_time)->startOfDay()->format('Y-m-d H:i:s');
            $expired_at =  Carbon::parse($date_time)->endOfDay()->format('Y-m-d H:i:s');
        } elseif ($type === 'one_month_ticket') {
            $direction = 'both';
            $valid_at =  Carbon::parse($date_time)->startOfMonth()->format('Y-m-d H:i:s');
            $expired_at =  Carbon::parse($date_time)->endOfMonth()->format('Y-m-d H:i:s');
        }
        $ticket_pricing = (new TicketPricingRepository)->queryByDateTime($date_time)->where('type', $type)
            ->where('direction', $direction)->lockForUpdate()->first();
        if (!$ticket_pricing) {
            throw new \Exception('Ticket pricing not found');
        }
        if ($ticket_pricing->remain_quantity <= 0) {
            throw new \Exception('Ticket is out of stock');
        }
        if (!$user->wallet) {
            throw new \Exception('Wallet not found');
        }
        if ($ticket_pricing->price > $user->wallet->balance) {
            throw new \Exception('Insufficient balance');
        }
        $ticket_pricing->decrement('remain_quantity', 1);
        $ticket_pricing->save();
        $ticket = (new TicketRepository)->create([
            'ticket_number' => null,
            'user_id' => $user->id,
            'ticket_pricing_id' => $ticket_pricing->id,
            'type' => $ticket_pricing->type,
            'direction' => $ticket_pricing->direction,
            'price' => $ticket_pricing->price,
            'valid_at' => $valid_at,
            'expired_at' => $expired_at,
        ]);
        $ticket = (new TicketRepository)->update($ticket->id, [
            'ticket_number' => str_pad($ticket->id, 9, '0', STR_PAD_LEFT),
        ]);

        WalletService::reduceBalance([
            'wallet_id' => $user->wallet->id,
            'amount' => $ticket->price,
            'description' => 'Buy Ticket (#' . $ticket->ticket_number . ')',
            'sourceable_id' => $ticket->id,
            'sourceable_type' => Ticket::class,
            'type' => 'buy_ticket',
        ]);

        return $ticket;
    }
}
