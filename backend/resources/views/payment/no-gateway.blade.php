<!doctype html>
<html>
<head><meta charset="utf-8"/><title>Payment Error</title></head>
<body style="font-family:Arial;padding:40px;text-align:center;">
  <h2>Payment temporarily unavailable</h2>
  <p>We couldn't find the payment gateway URL for this transaction (id: {{ $transaction->id }}).</p>
  <p>Please try again or contact support.</p>
</body>
</html>
