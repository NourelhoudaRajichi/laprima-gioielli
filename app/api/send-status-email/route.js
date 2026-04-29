import { Resend } from "resend";

const resend   = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://laprimagioielli.com";
const BANNER   = "https://laprimagioielli.com/wp-content/uploads/2025/10/logoemail.png";
const FB       = "https://www.facebook.com/laprimagioielli";
const IG       = "https://www.instagram.com/la_prima_gioielli/";

const fmt = (n) => {
  const num = parseFloat(n) || 0;
  const [int, dec] = num.toFixed(2).split(".");
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + dec + " €";
};

const BADGE_COLOR = "#ec9cb2";
const BADGE_BG    = "#f8e3e8";

const STATUS_CONFIG = {
  processing: {
    subject:  (id) => `Your Order #${id} Is Being Processed | La Prima Gioielli`,
    headline: "Your Order Is Being Processed",
    badge:    "Processing",
    message:  (fn) => `Hello ${fn},<br/>We have received your payment and your order is now being processed.<br/>We will notify you once it has been shipped.`,
  },
  "on-hold": {
    subject:  (id) => `Your Order #${id} Is On Hold | La Prima Gioielli`,
    headline: "Your Order Is On Hold",
    badge:    "On Hold",
    message:  (fn) => `Hello ${fn},<br/>Your order is currently on hold, pending payment confirmation or additional verification.<br/>Please contact our customer care if you have any questions.`,
  },
  completed: {
    subject:  (id) => `Your Order #${id} Is Complete | La Prima Gioielli`,
    headline: "Your Order Is Complete!",
    badge:    "Completed",
    message:  (fn) => `Hello ${fn},<br/>Great news! Your order has been fulfilled and is on its way.<br/>Thank you for shopping with La Prima Gioielli — we hope you love your jewels.`,
  },
  cancelled: {
    subject:  (id) => `Your Order #${id} Has Been Cancelled | La Prima Gioielli`,
    headline: "Your Order Has Been Cancelled",
    badge:    "Cancelled",
    message:  (fn) => `Hello ${fn},<br/>Your order has been cancelled. If you were charged, a refund will be processed shortly.<br/>If you believe this is a mistake, please contact our customer care immediately.`,
  },
  refunded: {
    subject:  (id) => `Your Refund for Order #${id} Has Been Issued | La Prima Gioielli`,
    headline: "Your Refund Has Been Issued",
    badge:    "Refunded",
    message:  (fn) => `Hello ${fn},<br/>Your refund for order #{{orderId}} has been processed. Please allow 5–10 business days for the amount to appear on your statement.<br/>Thank you for your understanding.`,
  },
};

function buildItemsHtml(lineItems) {
  return (lineItems || []).map(item => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f0e8ec;vertical-align:top">
        ${item.image?.src ? `<img src="${item.image.src}" alt="${item.name}" width="70" style="display:block;border-radius:4px;border:1px solid #f0e8ec;margin-bottom:8px"/>` : ""}
        <span style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:15px;font-weight:700;color:#004065;text-transform:uppercase;letter-spacing:.04em;display:block">${item.name}</span>
        ${item.sku ? `<span style="font-size:12px;color:#7a9ab0;display:block;margin-top:2px">SKU: ${item.sku}</span>` : ""}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0e8ec;text-align:center;vertical-align:top;font-size:14px;color:#004065">${item.quantity}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0e8ec;text-align:right;vertical-align:top;font-size:14px;color:#004065;white-space:nowrap">${fmt(item.total)}</td>
    </tr>`).join("");
}

function buildStatusEmail({ order, status }) {
  const cfg      = STATUS_CONFIG[status];
  const billing  = order.billing || {};
  const fn       = billing.first_name || "Valued Customer";
  const ln       = billing.last_name  || "";
  const orderId  = order.id;
  const total    = fmt(order.total || 0);
  const itemsHtml = buildItemsHtml(order.line_items);
  const now = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const message = cfg.message(fn).replace("{{orderId}}", orderId);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<title>${cfg.headline}</title>
</head>
<body style="margin:0;padding:0;background:#f4eff1;font-family:Arial,sans-serif">
<div style="max-width:620px;margin:0 auto;background:#ffffff">

  <!-- BANNER -->
  <img src="${BANNER}" alt="La Prima Gioielli" width="620" style="display:block;width:100%;max-width:620px"/>

  <!-- STATUS BADGE + HEADLINE -->
  <div style="background:#ffffff;padding:32px 40px;text-align:center">
    <span style="display:inline-block;padding:6px 18px;border-radius:20px;background:${BADGE_BG};color:${BADGE_COLOR};font-family:'Barlow Condensed',Arial,sans-serif;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:18px">${cfg.badge}</span>
    <h1 style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:34px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#004065;margin:0 0 14px">${cfg.headline}</h1>
    <p style="font-size:14px;color:#004065;line-height:1.8;margin:0">${message}</p>
  </div>

  <!-- ORDER NUMBER + DATE -->
  <div style="background:#ffffff;padding:14px 40px;border-bottom:1px solid #f0e8ec;border-top:1px solid #f0e8ec">
    <p style="margin:0;font-size:13px;color:#004065">
      <strong style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:15px;letter-spacing:.04em">[Order #${orderId}]</strong>
      <span style="color:#7a9ab0;margin-left:8px">${now}</span>
    </p>
  </div>

  <!-- ORDER TABLE -->
  <div style="padding:0 40px">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #f0e8ec;border-radius:6px;overflow:hidden;margin:24px 0">
      <thead>
        <tr style="background:#f8e3e8">
          <th style="padding:11px 16px;text-align:left;font-family:'Barlow Condensed',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#004065">Product</th>
          <th style="padding:11px 16px;text-align:center;font-family:'Barlow Condensed',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#004065">Qty</th>
          <th style="padding:11px 16px;text-align:right;font-family:'Barlow Condensed',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#004065">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr style="background:#f8e3e8">
          <td colspan="2" style="padding:13px 16px;font-family:'Barlow Condensed',Arial,sans-serif;font-size:17px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#004065"><strong>Total</strong></td>
          <td style="padding:13px 16px;text-align:right;font-family:'Barlow Condensed',Arial,sans-serif;font-size:17px;font-weight:800;color:#004065">${total}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- BILLING ADDRESS -->
  <div style="padding:0 40px 28px">
    <p style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#004065;margin:0 0 10px;border-bottom:2px solid #f8e3e8;padding-bottom:6px">Billing Address</p>
    <p style="font-size:13px;color:#004065;line-height:1.8;margin:0">
      ${fn} ${ln}<br/>
      ${[billing.address_1, billing.address_2, billing.city, billing.state, billing.postcode, billing.country].filter(Boolean).join("<br/>")}
      ${billing.phone ? `<br/>${billing.phone}` : ""}
      ${billing.email ? `<br/><a href="mailto:${billing.email}" style="color:#004065">${billing.email}</a>` : ""}
    </p>
  </div>

  <!-- SUPPORT -->
  <div style="background:#ffffff;padding:28px 40px;text-align:center;border-top:1px solid #f0e8ec">
    <p style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#004065;margin:0 0 10px">Need Help?</p>
    <p style="font-size:13px;color:#004065;margin:0 0 4px">Email: <a href="mailto:customercare@laprimagioielli.it" style="color:#004065;font-weight:700">customercare@laprimagioielli.it</a></p>
    <p style="font-size:13px;color:#004065;margin:0 0 18px">Call: <a href="tel:+3904441791049" style="color:#004065">+39 0444 1791049</a> &nbsp;·&nbsp; Mon–Fri 9am–5pm</p>
    <div>
      <a href="${FB}" style="display:inline-block;margin:0 6px;text-decoration:none">
        <img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" width="36" height="36" style="display:inline-block"/>
      </a>
      <a href="${IG}" style="display:inline-block;margin:0 6px;text-decoration:none">
        <img src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="Instagram" width="36" height="36" style="display:inline-block"/>
      </a>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background:#f8e3e8;padding:24px 40px;text-align:center">
    <p style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:14px;font-weight:700;color:#004065;margin:0 0 2px;letter-spacing:.04em">La Prima Gioielli, A Brand Of</p>
    <p style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:14px;font-weight:700;color:#004065;margin:0 0 2px;letter-spacing:.04em">United Group International Srl</p>
    <p style="font-size:12px;color:#004065;margin:0">Via della Robbia Luca, 42, 36100 Vicenza VI (ITALY)</p>
  </div>

</div>
</body>
</html>`;
}

export async function POST(request) {
  try {
    const { order, status } = await request.json();

    const cfg = STATUS_CONFIG[status];
    if (!cfg) return Response.json({ error: "No email template for this status" }, { status: 400 });

    const toEmail = order.billing?.email;
    if (!toEmail) return Response.json({ error: "No customer email on order" }, { status: 400 });

    const html = buildStatusEmail({ order, status });

    const { error } = await resend.emails.send({
      from:    "La Prima Gioielli <onboarding@resend.dev>",
      to:      toEmail,
      subject: cfg.subject(order.id),
      html,
    });

    if (error) {
      console.error("Status email error:", error);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    console.error("send-status-email error:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
