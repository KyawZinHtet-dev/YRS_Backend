<?php

namespace App\Http\Controllers;



use App\Http\Requests\TicketInspector\TicketInspectorUpdateRequest;
use App\Http\Requests\TicketInspector\TicketInspectorStoreRequest;
use App\Repositories\TicketInspectorRepository;
use Illuminate\Http\Request;

class TicketInspectorController extends Controller
{
    protected $ticketInspectorRepository;
    public function __construct(TicketInspectorRepository $ticketInspectorRepository)
    {
        $this->ticketInspectorRepository = $ticketInspectorRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $ticket_inspectors = $this->ticketInspectorRepository->dataTable($request);
        return inertia('ticket-inspectors/index', ['ticket_inspectors' => $ticket_inspectors]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TicketInspectorStoreRequest $request)
    {
        try {
            $this->ticketInspectorRepository->create($request->all());

            return back()->with('response', ['status' => 'success', 'message' => 'Ticket Inspector created successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TicketInspectorUpdateRequest $request, string $id)
    {
        try {
            $this->ticketInspectorRepository->update($id, $request->all());
            return back()->with('response', ['status' => 'success', 'message' => 'Ticket Inspector updated successfully']);
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
            $this->ticketInspectorRepository->delete($id);
            return back()->with('response', ['status' => 'success', 'message' => 'Ticket Inspector deleted successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
