// app/api/send-confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';

const FROM = 'My Medicine Route <noreply@mymedicineroute.org>';

function studentHTML(name: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#111113;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111113;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#18191b;padding:24px 40px;border-radius:16px 16px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="width:10px;height:24px;background:#E11D48;border-radius:2px;"></td>
              <td style="padding-left:10px;font-size:17px;font-weight:800;color:#f1f5f9;letter-spacing:-0.3px;">My Medicine Route</td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="background:#18191b;padding:48px 40px 40px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#E11D48;letter-spacing:3px;text-transform:uppercase;">Welcome</p>
            <h1 style="margin:0 0 24px;font-size:32px;font-weight:800;color:#f1f5f9;letter-spacing:-1px;line-height:1.15;">Hey ${name}, you're in!</h1>
            <p style="margin:0 0 16px;font-size:16px;color:#94a3b8;line-height:1.7;">
              Your application to <strong style="color:#f1f5f9;">My Medicine Route</strong> has been received. We're reviewing applications and will be in touch within a few days to match you with a research project.
            </p>
            <p style="margin:0 0 36px;font-size:16px;color:#94a3b8;line-height:1.7;">
              In the meantime, follow us on Instagram for updates.
            </p>
            <a href="https://instagram.com/mymedicineroute" style="display:inline-block;background:#E11D48;color:#ffffff;font-size:15px;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;">
              Follow @mymedicineroute
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:#18191b;padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);border-radius:0 0 16px 16px;">
            <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">
              Founded by Gasser Mohamed &amp; Co-founder Hussain KR · Bahrain · 2026 ·
              <a href="mailto:mymedicineroute@gmail.com" style="color:#475569;text-decoration:none;">mymedicineroute@gmail.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function mentorHTML(name: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#111113;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111113;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#18191b;padding:24px 40px;border-radius:16px 16px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="width:10px;height:24px;background:#E11D48;border-radius:2px;"></td>
              <td style="padding-left:10px;font-size:17px;font-weight:800;color:#f1f5f9;letter-spacing:-0.3px;">My Medicine Route</td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="background:#18191b;padding:48px 40px 40px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#E11D48;letter-spacing:3px;text-transform:uppercase;">Mentor Application</p>
            <h1 style="margin:0 0 24px;font-size:32px;font-weight:800;color:#f1f5f9;letter-spacing:-1px;line-height:1.15;">Thank you, ${name}</h1>
            <p style="margin:0 0 16px;font-size:16px;color:#94a3b8;line-height:1.7;">
              Your mentor application to <strong style="color:#f1f5f9;">My Medicine Route</strong> is in. We're building the first student medical research network in Bahrain — and mentors like you make it possible.
            </p>
            <p style="margin:0 0 36px;font-size:16px;color:#94a3b8;line-height:1.7;">
              We'll reach out shortly with next steps on getting you matched with a student project.
            </p>
            <a href="https://instagram.com/mymedicineroute" style="display:inline-block;background:#E11D48;color:#ffffff;font-size:15px;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;">
              Follow @mymedicineroute
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:#18191b;padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);border-radius:0 0 16px 16px;">
            <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">
              Founded by Gasser Mohamed &amp; Co-founder Hussain KR · Bahrain · 2026 ·
              <a href="mailto:mymedicineroute@gmail.com" style="color:#475569;text-decoration:none;">mymedicineroute@gmail.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const { role, name, email } = await req.json();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: email,
      subject: role === 'student'
        ? 'Your application to My Medicine Route is in'
        : 'Your mentor application to My Medicine Route is in',
      html: role === 'student' ? studentHTML(name) : mentorHTML(name),
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
