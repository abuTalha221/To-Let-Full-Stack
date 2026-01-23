<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Order Placed</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">

        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:10px; box-shadow:0 8px 20px rgba(0,0,0,0.08); padding:30px;">

          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h1 style="margin:0; color:#e45716;">To Let</h1>
              <p style="margin:0; font-size:13px; color:#999;">New order notification</p>
            </td>
          </tr>

          <tr>
            <td style="color:#333;">
              <h2 style="margin:0 0 10px 0;">New order placed #{{ $order->id }}</h2>
              <p style="margin:0 0 20px 0; color:#555;">A user submitted a new order. Details below.</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0; font-weight:bold; width:180px; color:#555;">Area</td>
                  <td style="padding:8px 0; color:#333;">{{ $order->area }}, {{ $order->district }}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#555;">Subarea</td>
                  <td style="padding:8px 0; color:#333;">{{ $order->subarea ?? 'N/A' }}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#555;">Category / Room</td>
                  <td style="padding:8px 0; color:#333;">{{ $order->category }} / {{ $order->room }}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#555;">Need from</td>
                  <td style="padding:8px 0; color:#333;">
                    {{ \Carbon\Carbon::createFromDate(null, $order->move_in_month, 1)->format('F') }}
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#555;">Budget</td>
                  <td style="padding:8px 0; color:#333;">{{ $order->budget }} BDT</td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#555;">Package</td>
                  <td style="padding:8px 0; color:#333;">{{ $order->package_code }} ({{ $order->cost }} BDT)</td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#555;">Contact</td>
                  <td style="padding:8px 0; color:#333;">
                    {{ $order->contact_name ?: 'N/A' }}<br>
                    Phone: {{ $order->contact_phone }}<br>
                    Email: {{ $order->contact_email ?: 'N/A' }}
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#555;">Submitted</td>
                  <td style="padding:8px 0; color:#333;">{{ $order->created_at ? $order->created_at->format('d M Y, h:i A') : 'N/A' }}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#555;">Details</td>
                  <td style="padding:8px 0; color:#333;">{{ $order->details ?: 'No additional details provided.' }}</td>
                </tr>
              </table>

              <p style="margin:24px 0 0 0; color:#555;">Please log in to the admin panel to review and process this order.</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:20px; font-size:12px; color:#999;">
              © {{ date('Y') }} To Let. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
