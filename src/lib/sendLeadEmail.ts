import nodemailer from 'nodemailer';

interface LeadData {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  interestedService: string;
  source: string;
  submittedAt: string;
}

export async function sendLeadNotificationEmail(lead: LeadData) {
  const { SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;

  if (!SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) {
    console.warn('Email env vars not set — skipping lead notification email.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const submittedAt = new Date(lead.submittedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
      <div style="background: #e61e25; padding: 24px 32px;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🔔 New Enquiry Lead</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">One Click Advertisement</p>
      </div>
      <div style="padding: 28px 32px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px; width: 40%;">Full Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">${lead.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">
              <a href="mailto:${lead.email}" style="color: #e61e25;">${lead.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">
              <a href="tel:${lead.phone}" style="color: #e61e25;">${lead.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Company</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">${lead.companyName || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Interested Service</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">${lead.interestedService}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Source</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">${lead.source}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">Submitted At</td>
            <td style="padding: 10px 0; color: #111; font-size: 14px; font-weight: 600;">${submittedAt}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #fff8f8; border-left: 4px solid #e61e25; border-radius: 4px;">
          <p style="margin: 0; color: #666; font-size: 13px;">View and manage this lead in your <a href="http://localhost:3000/admin/leads" style="color: #e61e25; font-weight: 600;">Admin Dashboard</a>.</p>
        </div>
      </div>
      <div style="padding: 16px 32px; background: #f4f4f4; text-align: center;">
        <p style="margin: 0; color: #999; font-size: 12px;">One Click Advertisement · oneclick-adv.ae</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"One Click Leads" <${SMTP_USER}>`,
    to: NOTIFY_EMAIL,
    subject: `New Lead: ${lead.fullName} — ${lead.interestedService}`,
    html,
  });
}
