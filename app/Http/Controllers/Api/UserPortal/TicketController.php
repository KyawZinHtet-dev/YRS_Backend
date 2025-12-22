<?php

namespace App\Http\Controllers\Api\UserPortal;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserPortal\TicketDetailResource;
use App\Http\Resources\UserPortal\TicketResource;
use App\Repositories\QRRepository;
use App\Repositories\TicketRepository;
use App\Services\ResponseService;
use Illuminate\Support\Facades\DB;

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

    // QR 
    public function regenerateQR(Request $request)
    {
        $request->validate([
            'qr_token' => 'required'
        ]);
        DB::beginTransaction();
        try {
            $qr = (new QRRepository)->regenerate($request->qr_token);

            DB::commit();

            return ResponseService::success(data: ['qr_token' => $qr->token], message: 'Successfully regenerate new QR.');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseService::fail(message: $e->getMessage());
        }
    }
}
