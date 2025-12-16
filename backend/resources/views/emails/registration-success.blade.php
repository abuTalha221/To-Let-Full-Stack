<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Registration Successful</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding:40px 0;">

      <table width="100%" max-width="500px"
        style="background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 8px 20px rgba(0,0,0,0.08);">

        <!-- Logo -->
        <tr>
          <td align="center" style="padding-bottom:20px;">
              <h1 style="margin:0; color:#e45716;">To Let</h1>
              <p style="margin:0; font-size:13px; color:#999;">
                Find Your Perfect Home
              </p>
            </td>
        </tr>

        <!-- Title -->
        <tr>
          <td align="center">
            <h2 style="color:#333;">Registration Successful 🎉</h2>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:20px 0; color:#555; font-size:15px; line-height:1.6;">
            <p>Hello <strong>{{ $user->name }}</strong>,</p>

            <p>
              Your email has been successfully verified and your account is now active.
            </p>

            <p>
              You can now log in and start finding your perfect home with <strong>To Let</strong>.
            </p>

            <p style="margin-top:25px;">
              If you have any questions, feel free to contact our support team.
            </p>

            <p>
              — Team <strong>To Let</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding-top:20px; font-size:12px; color:#999;">
            © {{ date('Y') }} To Let — Find Your Perfect Home
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
