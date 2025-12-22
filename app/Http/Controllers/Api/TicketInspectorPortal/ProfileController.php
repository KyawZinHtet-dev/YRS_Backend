<?php

namespace App\Http\Controllers\Api\TicketInspectorPortal;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Services\ResponseService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\TicketInspectorPortal\ProfileResource;

class ProfileController extends Controller
{
    public function profile()
    {
        $ticket_inspector = auth()->guard('ticket_inspector_api')->user();
        return ResponseService::success(data: new ProfileResource($ticket_inspector));
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', Rules\Password::defaults()],
            'new_password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        try {
            $ticket_inspector = auth()->guard('ticket_inspector_api')->user();
            if (!Hash::check($request->current_password, $ticket_inspector->password)) {
                return ResponseService::fail(message: 'The current password is incorrect');
            }
            $ticket_inspector->password = $request->new_password;
            $ticket_inspector->save();
            return ResponseService::success(message: 'Password changed successfully');
        } catch (Exception $e) {
            return ResponseService::fail(message: $e->getMessage());
        }
    }
}
