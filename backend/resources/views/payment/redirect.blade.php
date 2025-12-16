<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Redirecting to Payment</title>
  <meta http-equiv="refresh" content="5;url={{ $gateway }}" />
  <style>
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; text-align:center; padding:40px; }
    .card { display:inline-block; padding:20px 30px; border-radius:12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
    a.button { display:inline-block; margin-top:12px; padding:10px 16px; background:#ec733b; color:#fff; text-decoration:none; border-radius:8px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Redirecting to payment gateway…</h2>
    <p>If your browser does not auto-redirect, click the button below.</p>
    <p><a class="button" href="{{ $gateway }}">Go to Payment Gateway</a></p>
    <p style="font-size:.9rem;color:#666;margin-top:10px;">Transaction #{{ $transaction->id ?? '' }}</p>
  </div>

  <script>
    (function(){
      try {
        window.location.replace({!! json_encode($gateway) !!});
      } catch (e) {
        console.warn('auto redirect failed', e);
      }
    })();
  </script>
</body>
</html>
