<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use App\Models\User;

class RegistrationSuccessMail extends Mailable
{
    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this
            ->subject('Registration Successful - Welcome to ToLet')
            ->view('emails.registration-success');
    }
}
