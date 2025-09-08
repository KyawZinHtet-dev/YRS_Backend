<?php

namespace App\Notifications;

use App\Models\OTP;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TwoStepVerification extends Notification
{
    use Queueable;

    protected $otp;
    /**
     * Create a new notification instance.
     */
    public function __construct(OTP $otp)
    {
        $this->otp = $otp;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(config('app.name') . ' - Two Step Verification')
            ->greeting('Hello ' . $this->otp->email)
            ->line('Your verification code is ' . $this->otp->otp_code)
            ->line('This code is valid for 5 minutes.')
            ->line('Please do not share this code with anyone.')
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
