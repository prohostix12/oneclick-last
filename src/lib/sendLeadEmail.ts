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

interface ContactData {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  message: string;
  createdAt?: string;
}

interface OfferLeadData {
  name: string;
  phone: string;
  email: string;
  businessName: string;
  offerWon: string;
  offerId?: string;
  date?: string;
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;

  if (!SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) {
    console.warn('SMTP credentials or notification recipient details missing in environment variables. Email notification skipped.');
    return null;
  }

  const host = SMTP_HOST || 'smtp.zoho.com';
  const port = parseInt(SMTP_PORT || '465', 10);
  const secure = SMTP_SECURE !== 'false'; // Defaults to true (SSL) unless explicitly 'false'

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return {
    transporter,
    fromEmail: SMTP_USER,
    toEmail: NOTIFY_EMAIL,
  };
}

export async function sendLeadNotificationEmail(lead: LeadData) {
  const mailConfig = getTransporter();
  if (!mailConfig) return;

  const { transporter, fromEmail, toEmail } = mailConfig;

  const submittedAt = new Date(lead.submittedAt || new Date()).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
      <div style="background: #e61e25; padding: 24px 32px;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🔔 New Service Enquiry</h1>
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
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">${lead.source || 'Website Lead Form'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">Submitted At</td>
            <td style="padding: 10px 0; color: #111; font-size: 14px; font-weight: 600;">${submittedAt}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #fff8f8; border-left: 4px solid #e61e25; border-radius: 4px;">
          <p style="margin: 0; color: #666; font-size: 13px;">View and manage this lead in your admin panel.</p>
        </div>
      </div>
      <div style="padding: 16px 32px; background: #f4f4f4; text-align: center;">
        <p style="margin: 0; color: #999; font-size: 12px;">One Click Advertisement · oneclick-adv.ae</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"One Click Enquiries" <${fromEmail}>`,
    to: toEmail,
    subject: `New Enquiry Lead: ${lead.fullName} — ${lead.interestedService}`,
    html,
  });
}

export async function sendContactNotificationEmail(contact: ContactData) {
  const mailConfig = getTransporter();
  if (!mailConfig) return;

  const { transporter, fromEmail, toEmail } = mailConfig;

  const sentAt = new Date(contact.createdAt || new Date()).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
      <div style="background: #e61e25; padding: 24px 32px;">
        <h1 style="color: white; margin: 0; font-size: 22px;">📩 New Contact Message</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">One Click Advertisement</p>
      </div>
      <div style="padding: 28px 32px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px; width: 40%;">Sender Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">${contact.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">
              <a href="mailto:${contact.email}" style="color: #e61e25;">${contact.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">
              ${contact.phone ? `<a href="tel:${contact.phone}" style="color: #e61e25;">${contact.phone}</a>` : 'Not provided'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Company</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">${contact.company || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Requested Service</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">
              ${
                contact.service 
                  ? {
                      branding: 'Branding & Corporate Identity',
                      'digital-graphics': 'Digital Printed Graphics',
                      'vehicle-graphics': 'Vehicle Graphics & Fleet Branding',
                      signage: 'Exhibition, Display & POS Solutions',
                      exhibition: 'Signage Production & Installation',
                      cladding: 'Cladding & Facade Solutions'
                    }[contact.service] || contact.service
                  : 'Not provided'
              }
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">Sent At</td>
            <td style="padding: 10px 0; color: #111; font-size: 14px; font-weight: 600;">${sentAt}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #fff8f8; border-left: 4px solid #e61e25; border-radius: 4px;">
          <p style="margin: 0 0 8px; color: #e61e25; font-size: 13px; font-weight: bold;">Message Content:</p>
          <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${contact.message}</p>
        </div>
      </div>
      <div style="padding: 16px 32px; background: #f4f4f4; text-align: center;">
        <p style="margin: 0; color: #999; font-size: 12px;">One Click Advertisement · oneclick-adv.ae</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"One Click Messages" <${fromEmail}>`,
    to: toEmail,
    subject: `New Message from ${contact.name}`,
    html,
  });
}

export async function sendOfferLeadNotificationEmail(offerLead: OfferLeadData) {
  const mailConfig = getTransporter();
  if (!mailConfig) return;

  const { transporter, fromEmail, toEmail } = mailConfig;

  const claimedAt = new Date(offerLead.date || new Date()).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
      <div style="background: #e61e25; padding: 24px 32px;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🎁 New Scratch Card Claim</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">One Click Advertisement Campaigns</p>
      </div>
      <div style="padding: 28px 32px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px; width: 40%;">Full Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">${offerLead.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">
              <a href="mailto:${offerLead.email}" style="color: #e61e25;">${offerLead.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">
              <a href="tel:${offerLead.phone}" style="color: #e61e25;">${offerLead.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Business Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 14px; font-weight: 600;">${offerLead.businessName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px; color: #e61e25; font-weight: bold;">Offer Won</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #e61e25; font-size: 14px; font-weight: bold;">${offerLead.offerWon}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">Claimed At</td>
            <td style="padding: 10px 0; color: #111; font-size: 14px; font-weight: 600;">${claimedAt}</td>
          </tr>
        </table>
      </div>
      <div style="padding: 16px 32px; background: #f4f4f4; text-align: center;">
        <p style="margin: 0; color: #999; font-size: 12px;">One Click Advertisement · oneclick-adv.ae</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"One Click Campaigns" <${fromEmail}>`,
    to: toEmail,
    subject: `Scratch Card Claim: ${offerLead.name} won ${offerLead.offerWon}`,
    html,
  });
}
