import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@lofy.ai";
const APP_NAME = "Lofy";

export async function sendVerificationEmail(
  to: string,
  name: string,
  code: string,
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `${code} is your ${APP_NAME} verification code`,
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
  <meta content="width=device-width" name="viewport" />
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta content="IE=edge" http-equiv="X-UA-Compatible" />
  <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;">
  <!-- Preheader -->
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">
    Verify your email address to complete registration - Lofy AI
  </div>

  <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f5;">
    <tbody>
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table border="0" width="600" cellpadding="0" cellspacing="0" role="presentation"
            style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
            <tbody>

              <!-- Header -->
              <tr>
                <td style="padding:32px 40px 24px;">
                  <img
                    alt="Lofy AI"
                    height="107"
                    src="https://resend-attachments.s3.amazonaws.com/46cf8e07-f04e-4cb1-9a55-7321c37fc183"
                    style="display:block;outline:none;border:none;text-decoration:none;border-radius:8px;"
                    width="104"
                  />
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:0 40px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Helvetica Neue',sans-serif;color:#1d3944;">

                  <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">
                    <span>Welcome to </span><strong>Lofy AI</strong><span>, ${name}.</span>
                  </p>

                  <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">
                    You&apos;re one step away.
                  </p>

                  <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#444;">
                    We need to verify your email address before you can access your account.
                    Enter the code below in your open browser window.
                  </p>

                  <!-- Code block -->
                  <div style="letter-spacing:10px;font-size:36px;font-weight:700;color:#111;text-align:center;padding:20px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:24px;">${code}</div>

                  <p style="margin:0 0 24px;font-size:13px;color:#7e8a9a;line-height:1.6;">
                    This code will expire in <strong>10 minutes</strong> and can only be used once.
                    Never share this code with anyone.
                  </p>

                  <blockquote style="border-left:3px solid #acb3be;color:#7e8a9a;margin:0;padding-left:0.8em;font-size:14px;">
                    <p style="margin:0;">- Lofy AI Team</p>
                  </blockquote>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#9ca3af;text-align:center;">
                  If you did not create an account, you can safely ignore this email.
                </td>
              </tr>

            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>`,
  });
}
