<?php

namespace App\Repositories;

use App\Models\OTP;
use Illuminate\Support\Str;
use App\Notifications\TwoStepVerification;
use Illuminate\Support\Facades\Notification;
use App\Repositories\Contracts\BaseRepository;

class OTPRepository implements BaseRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new OTP();
    }

    public function all()
    {
        return $this->model->orderBy('updated_at', 'desc')->get();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $otp = $this->model->find($id);
        $otp->update($data);
        return $otp;
    }

    public function delete($id)
    {
        $otp = $this->model->find($id);
        $otp->delete();
        return $otp;
    }

    public function generate()
    {
        if (config('app.env') == 'production') {
            $otp_code = strval(rand(100000, 999999));
        } else {
            $otp_code = '123456';
        }
        return $otp_code;
    }

    public function send($email)
    {
        $otp = $this->model->where('email', $email)->where('expired_at', '>', date('Y-m-d H:i:s'))->first();
        if (!$otp) {
            $otp = $this->create([
                'email' => $email,
                'otp_code' => $this->generate(),
                'otp_token' => encrypt(['email' => $email, 'uuid' => Str::uuid()]),
                'expired_at' => now()->addMinutes(5)->format('Y-m-d H:i:s'),
            ]);
            if (config('app.env') == 'production') {
                // Notification::send(User::where('email', $email)->first(), new TwoStepVerification($otp));
                Notification::route('mail', $email)->notify(new TwoStepVerification($otp));
            }
        }
        return $otp;
    }

    public function resend($otp_token)
    {
        $decrypted_data = decrypt($otp_token);
        $email = $decrypted_data['email'];
        $otp = $this->model->where('otp_token', $otp_token)->first();
        if (!$otp) {
            throw new \Exception('The given data is invalid');
        }
        if ($otp->expired_at > date('Y-m-d H:i:s')) {
            throw new \Exception('The OTP Code is already sent. This code will expire in ' . now()->diff($otp->expired_at)->format('%i minutes %s seconds'));
        }
        $otp->delete();
        $otp = $this->create([
            'email' => $email,
            'otp_code' => $this->generate(),
            'otp_token' => encrypt(['email' => $email, 'uuid' => Str::uuid()]),
            'expired_at' => now()->addMinutes(5)->format('Y-m-d H:i:s'),
        ]);
        if (config('app.env') == 'production') {
            Notification::route('mail', $email)->notify(new TwoStepVerification($otp));
        }
        return $otp;
    }

    public function verify($otp_token, $otp_code)
    {
        $otp = $this->model->where('otp_token', $otp_token)->first();
        if (!$otp) {
            throw new \Exception('The given data is invalid');
        }
        if ($otp->expired_at < date('Y-m-d H:i:s')) {
            throw new \Exception('The OTP is expired');
        }
        if ($otp->otp_code != $otp_code) {
            throw new \Exception('The OTP Code is incorrect');
        }
        $this->delete($otp->id);
    }
}
