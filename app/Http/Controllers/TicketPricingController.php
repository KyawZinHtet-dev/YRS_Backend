<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\TicketPricingRepository;
use App\Http\Requests\TicketPricing\TicketPricingStoreRequest;

class TicketPricingController extends Controller
{
    protected $ticketPricingRepository;
    public function __construct(TicketPricingRepository $ticketPricingRepository)
    {
        $this->ticketPricingRepository = $ticketPricingRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $ticket_pricings = $this->ticketPricingRepository->dataTable($request);
        return inertia('ticket-pricings/index', ['ticket_pricings' => $ticket_pricings]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TicketPricingStoreRequest $request)
    {
        try {
            $this->ticketPricingRepository->create([
                'type' => $request->type,
                'price' => $request->price,
                'offer_quantity' => $request->offer_quantity,
                'remain_quantity' => $request->offer_quantity,
                'started_at' => $request->period['started_at'],
                'ended_at' => $request->period['ended_at']
            ]);

            return back()->with('response', ['status' => 'success', 'message' => 'New ticket pricing created successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TicketPricingStoreRequest $request, string $id)
    {
        try {
            $this->ticketPricingRepository->update($id, [
                'type' => $request->type,
                'price' => $request->price,
                'offer_quantity' => $request->offer_quantity,
                'remain_quantity' => $request->offer_quantity,
                'started_at' => $request->period['started_at'],
                'ended_at' => $request->period['ended_at']
            ]);
            return back()->with('response', ['status' => 'success', 'message' => 'Ticket pricing updated successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->ticketPricingRepository->delete($id);
            return back()->with('response', ['status' => 'success', 'message' => 'Ticket pricing deleted successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
