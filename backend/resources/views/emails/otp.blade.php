<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">

        <!-- Email Card -->
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:500px; background:#ffffff; border-radius:10px; box-shadow:0 8px 20px rgba(0,0,0,0.08); padding:30px;">

          <!-- Brand (TEXT fallback instead of logo for localhost) -->
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
              <h2 style="color:#333; margin-bottom:10px;">
                Email Verification
              </h2>
              <p style="color:#666; font-size:14px;">
                Use the OTP below to verify your email address
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:25px 0;">
              <div
                style="
                  font-size:32px;
                  letter-spacing:6px;
                  font-weight:bold;
                  color:#e45716;
                  background:#fff3ed;
                  padding:15px 25px;
                  border-radius:8px;
                  display:inline-block;
                "
              >
                {{ $otp }}
              </div>
            </td>
          </tr>

          <!-- Info -->
          <tr>
            <td align="center">
              <p style="color:#555; font-size:14px; margin-bottom:5px;">
                This OTP will expire in <strong>10 minutes</strong>.
              </p>
              <p style="color:#999; font-size:13px;">
                Please do not share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:20px 0;">
              <hr style="border:none; border-top:1px solid #eee;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center">
              <p style="font-size:12px; color:#999;">
                © {{ date('Y') }} To Let. All rights reserved.
              </p>
              <p style="font-size:12px; color:#999;">
                If you did not request this email, you can safely ignore it.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
