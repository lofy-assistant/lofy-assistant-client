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
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fafafa;border-radius:12px;">
        <h2 style="margin:0 0 8px;font-size:22px;color:#111;">Verify your email</h2>
        <p style="margin:0 0 24px;color:#555;">Hi ${name}, enter the 6-digit code below to complete your ${APP_NAME} registration.</p>
        <div style="letter-spacing:10px;font-size:36px;font-weight:700;color:#111;text-align:center;padding:20px;background:#fff;border-radius:8px;border:1px solid #e5e7eb;">${code}</div>
        <p style="margin:24px 0 0;color:#888;font-size:13px;">This code expires in <strong>10 minutes</strong>. If you did not create an account, you can safely ignore this email.</p>
      </div>
    `,
  });
}
