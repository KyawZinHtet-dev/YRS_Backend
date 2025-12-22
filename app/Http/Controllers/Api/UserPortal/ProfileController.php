<?php

namespace App\Http\Controllers\Api\UserPortal;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Services\ResponseService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserPortal\ProfileResource;

class ProfileController extends Controller
{
    public function profile()
    {
        $user = auth()->guard('user_api')->user();
        return ResponseService::success(data: new ProfileResource($user));
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', Rules\Password::defaults()],
            'new_password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        try {
            $user = auth()->guard('user_api')->user();
            if (!Hash::check($request->current_password, $user->password)) {
                return ResponseService::fail(message: 'The current password is incorrect');
            }
            $user->password = $request->new_password;
            $user->save();
            return ResponseService::success(message: 'Password changed successfully');
        } catch (Exception $e) {
            return ResponseService::fail(message: $e->getMessage());
        }
    }
}
