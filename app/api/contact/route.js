import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const RECEIVER = "nourelhoudarajichi@gmail.com";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "La Prima Gioielli <onboarding@resend.dev>",
      to: RECEIVER,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
          <img src="https://laprimagioielli.com/wp-content/uploads/2025/09/La-Prima-Logo.png" alt="La Prima Gioielli" style="height:40px;margin-bottom:24px"/>
          <h2 style="color:#004065;margin:0 0 24px">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:13px;width:120px">Name</td>
              <td style="padding:10px 0;color:#004065;font-weight:600">${name}</td>
            </tr>
            <tr style="border-top:1px solid #f3f4f6">
              <td style="padding:10px 0;color:#6b7280;font-size:13px">Email</td>
              <td style="padding:10px 0;color:#004065">
                <a href="mailto:${email}" style="color:#004065">${email}</a>
              </td>
            </tr>
            <tr style="border-top:1px solid #f3f4f6">
              <td style="padding:10px 0;color:#6b7280;font-size:13px;vertical-align:top">Message</td>
              <td style="padding:10px 0;color:#004065;white-space:pre-wrap">${message}</td>
            </tr>
          </table>
          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #f3f4f6;font-size:11px;color:#9ca3af">
            Sent from laprimagioielli.com contact form
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", JSON.stringify(error));
      return Response.json({ error: error.message || "Failed to send email" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error("Contact route error:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
