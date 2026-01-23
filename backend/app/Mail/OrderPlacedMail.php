<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Mail\Mailable;

class OrderPlacedMail extends Mailable
{
    /**
     * @var Order
     */
    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this
            ->subject('New order placed #' . $this->order->id)
            ->view('emails.order-placed-admin');
    }
}
