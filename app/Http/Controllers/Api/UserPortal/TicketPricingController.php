<?php

namespace App\Http\Controllers\Api\UserPortal;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\TicketPricingRepository;
use App\Services\ResponseService;

class TicketPricingController extends Controller
{
    public function __construct(protected TicketPricingRepository $ticketPricingRepository) {}

    public function index()
    {
        $pricings = [];
        $ticket_pricings = $this->ticketPricingRepository->queryByDateTime(date('Y-m-d H:i:s'))->get();
        foreach (['one_time_ticket', 'one_month_ticket'] as $type) {
            $filtered_ticket_pricings = $ticket_pricings->where('type', $type);
            if ($filtered_ticket_pricings->count()) {
                if ($type == 'one_time_ticket') {
                    $pricings[] = [
                        'type' => $type,
                        'title' => 'One Time Ticket',
                        'description' => 'One Time Ticket is valid for one day and can be used only once. It will be expired after the day you purchased and cannot be used again.',
                        'price' => implode(', ', collect($filtered_ticket_pricings)->map(function ($filtered_ticket_pricing) {
                            return $filtered_ticket_pricing->acsr_direction['text'] . ' : ' . number_format($filtered_ticket_pricing->price) . ' MMK';
                        })->toArray())
                    ];
                } elseif ($type == 'one_month_ticket') {
                    $pricings[] = [
                        'type' => $type,
                        'title' => 'One Month Ticket',
                        'description' => 'One Month Ticket is valid for one month and can be used unlimited times. It will be expired after the month you purchased.',
                        'price' => implode(', ', collect($filtered_ticket_pricings)->map(function ($filtered_ticket_pricing) {
                            return number_format($filtered_ticket_pricing->price) . ' MMK';
                        })->toArray())
                    ];
                }
            }
        }
        return ResponseService::success(data: $pricings, message: 'success');
    }
}
