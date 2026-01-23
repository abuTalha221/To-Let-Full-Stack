<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$transactions = App\Models\Transaction::with('order')->orderBy('id', 'desc')->take(20)->get();
$total = App\Models\Transaction::count();

?>
<!DOCTYPE html>
<html>
<head>
    <title>Transactions Viewer</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .success { color: green; font-weight: bold; }
        .pending { color: orange; font-weight: bold; }
        .failed { color: red; font-weight: bold; }
        .info { background: #e7f3ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    </style>
    <meta http-equiv="refresh" content="10">
</head>
<body>
    <h1>Transactions Viewer (Auto-refresh every 10s)</h1>
    <div class="info">
        <strong>Total Transactions:</strong> <?= $total ?><br>
        <strong>Last Updated:</strong> <?= date('Y-m-d H:i:s') ?><br>
        <strong>Database:</strong> toletdb
    </div>
    
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Transaction ID</th>
                <th>User ID</th>
                <th>Package</th>
                <th>Amount</th>
                <th>Credits</th>
                <th>Order ID</th>
                <th>Gateway</th>
                <th>Status</th>
                <th>Created At</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($transactions as $t): ?>
            <tr>
                <td><?= $t->id ?></td>
                <td><?= $t->transaction_id ?></td>
                <td><?= $t->user_id ?></td>
                <td><?= $t->package_name ?></td>
                <td>৳<?= number_format($t->amount, 2) ?></td>
                <td><?= $t->credits ?></td>
                <td><?= $t->order_id ?? '-' ?></td>
                <td><?= $t->payment_gateway ?></td>
                <td class="<?= $t->status ?>"><?= strtoupper($t->status) ?></td>
                <td><?= $t->created_at->format('Y-m-d H:i:s') ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</body>
</html>
