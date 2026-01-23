<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$transactions = App\Models\Transaction::orderBy('id', 'desc')->take(5)->get();

echo "Total transactions: " . App\Models\Transaction::count() . PHP_EOL;
echo "Recent transactions:" . PHP_EOL;

foreach ($transactions as $t) {
    echo sprintf(
        "ID: %d | TXN: %s | Status: %s | Amount: %.2f | Order: %s | Created: %s" . PHP_EOL,
        $t->id,
        $t->transaction_id,
        $t->status,
        $t->amount,
        $t->order_id ?? 'null',
        $t->created_at
    );
}
