<?php

namespace App\Http\Controllers\Api\UserPortal;

use App\Http\Controllers\Controller;
use App\Services\BuyTicketService;
use App\Services\ResponseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BuyTicketController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'type' => ['required', 'in:one_time_ticket,one_month_ticket'],
            'origin_station_slug' => 'required_if:type,one_time_ticket|string',
            'destination_station_slug' => 'required_if:type,one_time_ticket|string',
        ], [
            'origin_station_slug.required_if' => 'The origin station field is required when the type is One Time Ticket.',
            'destination_station_slug.required_if' => 'The destination station field is required when the type is One Time Ticket.',
        ]);

        DB::beginTransaction();
        try {
            $ticket = BuyTicketService::create(user: auth('user_api')->user(), date_time: date('Y-m-d H:i:s'), type: $request->type, origin_station_slug: $request->origin_station_slug, destination_station_slug: $request->destination_station_slug);
            DB::commit();
            return ResponseService::success(data: ['ticket_number' => $ticket->ticket_number], message: 'Ticket bought successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseService::fail(message: $e->getMessage());
        }
    }
}
