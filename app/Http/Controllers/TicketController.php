<?php

namespace App\Http\Controllers;

use App\Http\Requests\TicketPricing\TicketPricingStoreRequest;
use App\Repositories\TicketRepository;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    protected $ticketRepository;
    public function __construct(TicketRepository $ticketRepository)
    {
        $this->ticketRepository = $ticketRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tickets = $this->ticketRepository->dataTable($request);
        return inertia('tickets/index', ['tickets' => $tickets]);
    }
}
