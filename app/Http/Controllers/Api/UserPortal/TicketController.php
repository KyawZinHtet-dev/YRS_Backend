<?php

namespace App\Http\Controllers\Api\UserPortal;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserPortal\TicketDetailResource;
use App\Http\Resources\UserPortal\TicketResource;
use App\Repositories\TicketRepository;
use App\Services\ResponseService;

class TicketController extends Controller
{
    public function __construct(protected TicketRepository $ticketRepository) {}

    public function index(Request $request)
    {
        $user = auth('user_api')->user();
        $tickets = $this->ticketRepository->queryByUser($user)
            ->orderBy('updated_at', 'desc')
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where('ticket_number', 'like', '%' . $request->search . '%');
            })
            ->paginate(10);;
        return TicketResource::collection($tickets)->additional([
            'message' => 'success',
        ]);
    }

    public function show($ticket_number)
    {
        $user = auth('user_api')->user();
        $ticket = $this->ticketRepository->queryByUser($user)
            ->where('ticket_number', $ticket_number)
            ->firstOrFail();
        return ResponseService::success(data: new TicketDetailResource($ticket), message: 'success');
    }
}
