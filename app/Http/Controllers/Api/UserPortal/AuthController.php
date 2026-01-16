<?php

namespace App\Http\Controllers\Api\UserPortal;

use Illuminate\Http\Request;
use App\Services\ResponseService;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Http\Requests\User\UserStoreRequest;
use App\Repositories\OTPRepository;
use App\Repositories\WalletRepository;
use Illuminate\Support\Facades\Auth;

class Authcontroller extends Controller
{
    public function register(UserStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = (new UserRepository)->create($request->all());
            (new WalletRepository)->firstOrCreate(['user_id' => $user->id], ['balance' => 0]);

            if ($user->email_verified_at) {
                $response = [
                    'is_verified' => true,
                    'access_token' => $user->createToken($user->email)->plainTextToken
                ];
            } else {
                $otp = (new OTPRepository)->send($user->email);
                $response = [
                    'is_verified' => false,
                    'otp_token' => $otp->otp_token
                ];
            }

            DB::commit();
            return ResponseService::success(data: $response, message: 'Successfully Registered');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseService::fail(message: $e->getMessage());
        }
    }

    public function twoStepVerification(Request $request)
    {
        $request->validate([
            'otp_token' => 'required',
            'otp_code' => 'required',
        ], [
            'otp_token.required' => 'The OTP Token is required',
            'otp_code.required' => 'The Verification Code is required',
        ]);
        DB::beginTransaction();
        try {
            (new OTPRepository)->verify($request->otp_token, $request->otp_code);
            $decrypted_data = decrypt($request->otp_token);
            $user = (new UserRepository)->findByEmail($decrypted_data['email']);
            if (!$user) {
                throw new \Exception('The user is not found');
            }
            $user->email_verified_at = now();
            $user->save();
            $response = [
                'access_token' => $user->createToken($user->email)->plainTextToken
            ];
            DB::commit();
            return ResponseService::success(data: $response, message: 'Verification Success');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseService::fail(message: $e->getMessage());
        }
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'otp_token' => 'required',
        ]);
        DB::beginTransaction();
        try {
            $otp = (new OTPRepository)->resend($request->otp_token);
            DB::commit();
            $response = [
                'otp_token' => $otp->otp_token
            ];
            return ResponseService::success(data: $response, message: 'Successfully Resend Verification Code');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseService::fail(message: $e->getMessage());
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        DB::beginTransaction();
        try {
            if (Auth::guard('user')->attempt($request->only('email', 'password'))) {
                $user = Auth::guard('user')->user();
                if ($user->email_verified_at) {
                    $response = [
                        'is_verified' => true,
                        'access_token' => $user->createToken($user->email)->plainTextToken
                    ];
                } else {
                    $otp = (new OTPRepository)->send($user->email);
                    $response = [
                        'is_verified' => false,
                        'otp_token' => $otp->otp_token
                    ];
                }
            } else {
                throw new \Exception('These credentials do not match our records.');
            }

            DB::commit();
            return ResponseService::success(data: $response, message: $response['is_verified'] ? 'Successfully Logged In' : 'Account Not Verified. Please Verify Your Account');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseService::fail(message: $e->getMessage());
        }
    }

    public function logout()
    {
        try {
            auth()->user()->currentAccessToken()->delete();
            return ResponseService::success(message: 'Successfully Logged Out');
        } catch (\Exception $e) {
            return ResponseService::fail(message: $e->getMessage());
        }
    }
}
