<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class BrevoMailService
{
    /**
     * Generic sender
     */
    public static function send($to, $subject, $html)
    {
        return Http::withHeaders([
            'api-key' => config('services.brevo.key'),
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post('https://api.brevo.com/v3/smtp/email', [
            'sender' => [
                'email' => config('services.brevo.from_email'),
                'name'  => config('services.brevo.from_name'),
            ],
            'to' => [
                ['email' => $to],
            ],
            'subject' => $subject,
            'htmlContent' => $html,
        ]);
    }

    /**
     * OTP-specific helper
     */
    public static function sendOtp($toEmail, $toName, $otp)
    {
        $html = "
            <div style='font-family: Arial, sans-serif'>
                <h2>Hello {$toName},</h2>
                <p>Your OTP code is:</p>
                <h1 style='letter-spacing: 4px'>{$otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <br>
                <p>— ToLet Team</p>
            </div>
        ";

        return self::send(
            $toEmail,
            'Verify Your Email - ToLet',
            $html
        );
    }
}
