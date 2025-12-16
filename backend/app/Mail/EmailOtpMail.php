<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class EmailOtpMail extends Mailable
{
    public $otp;

    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    public function build()
    {
        return $this
            ->subject('Your Verification OTP')
            ->view('emails.otp');
    }
}
