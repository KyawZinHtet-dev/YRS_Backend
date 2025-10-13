<?php

namespace App\Http\Controllers\Api\TicketInspectorPortal;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketInspectorPortal\TicketInspectionResource;
use App\Repositories\TicketInspectionRepository;
use App\Services\ResponseService;
use App\Services\TicketInspectionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketInspectionController extends Controller
{
    public function index()
    {
        $ticket_inspections = (new TicketInspectionRepository)
            ->queryByTicketInspector(auth('ticket_inspector_api')
                ->user())
            ->with(['ticket:id,ticket_number,type', 'route:id,title'])
            ->paginate(10);

        return TicketInspectionResource::collection($ticket_inspections)->additional([
            'message' => 'success'
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'qr_token' => 'required',
            'route_slug' => 'required'
        ], [
            'qr_token.required' => 'The QR field is required.',
            'route_slug.required' => 'The route field is required.',
        ]);
        DB::beginTransaction();
        try {
            $inspection = TicketInspectionService::scanQR(ticket_inspector: auth('ticket_inspector_api')->user(), route_slug: $request->route_slug, qr_token: $request->qr_token);
            DB::commit();
            return ResponseService::success(data: ['ticket_inspection_id' => $inspection->id], message: 'Ticket inspection success');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseService::fail(message: $e->getMessage());
        }
    }
}
