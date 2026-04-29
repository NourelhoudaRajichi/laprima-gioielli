import { Resend } from "resend";

const resend   = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://laprimagioielli.com";

const BANNER = "https://laprimagioielli.com/wp-content/uploads/2025/10/logoemail.png";
const FB = "https://www.facebook.com/laprimagioielli";
const IG = "https://www.instagram.com/la_prima_gioielli/";

export async function POST(request) {
  try {
    const { form, cartItems, orderNumber } = await request.json();

    const now = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

    const parsePrice = (str) => {
      const s = (str || "0").toString().trim();
      if (s.includes(",") && s.includes(".")) return parseFloat(s.replace(/\./g, "").replace(",", "."));
      if (s.includes(",")) return parseFloat(s.replace(",", "."));
      return parseFloat(s);
    };

    const fmt = (n) => {
      const [int, dec] = n.toFixed(2).split(".");
      return int.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + dec + " €";
    };

    const subtotal = cartItems.reduce((s, item) => s + parsePrice(item.price) * item.quantity, 0);

    const itemsHtml = cartItems.map(item => {
      const price = parsePrice(item.price);
      const lineTotal = fmt(price * item.quantity);
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #f0e8ec;vertical-align:top">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" width="80" style="display:block;border-radius:4px;border:1px solid #f0e8ec;margin-bottom:8px"/>` : ""}
            <span style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:15px;font-weight:700;color:#004065;text-transform:uppercase;letter-spacing:.04em;display:block">${item.name}</span>
            ${item.sku ? `<span style="font-size:12px;color:#7a9ab0;display:block;margin-top:2px">SKU: ${item.sku}</span>` : ""}
            ${item.variationName ? `<span style="font-size:12px;color:#7a9ab0;display:block">${item.variationName}</span>` : ""}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #f0e8ec;text-align:center;vertical-align:top;font-size:14px;color:#004065">${item.quantity}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #f0e8ec;text-align:right;vertical-align:top;font-size:14px;color:#004065;white-space:nowrap">${lineTotal}</td>
        </tr>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<title>Order Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f4eff1;font-family:Arial,sans-serif">
<div style="max-width:620px;margin:0 auto;background:#ffffff">

  <!-- BANNER IMAGE (contains logo) -->
  <img src="${BANNER}" alt="La Prima Gioielli" width="620" style="display:block;width:100%;max-width:620px"/>

  <!-- THANK YOU HEADER -->
  <div style="background:#ffffff;padding:32px 40px;text-align:center">
    <h1 style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:36px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#004065;margin:0 0 12px">Thank You For Your Order!</h1>
    <p style="font-size:14px;color:#004065;line-height:1.7;margin:0">
      Hello ${form.fn} ${form.ln}, welcome to La Prima Gioielli.<br/>
      Thank you for purchasing from our official store.<br/>
      Here are your order details:
    </p>
  </div>

  <!-- ORDER NUMBER + DATE -->
  <div style="background:#ffffff;padding:16px 40px;border-bottom:1px solid #f0e8ec">
    <p style="margin:0;font-size:13px;color:#004065">
      <strong style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:15px;letter-spacing:.04em">[Order #${orderNumber}]</strong>
      <span style="color:#7a9ab0;margin-left:8px">${now}</span>
    </p>
  </div>

  <!-- ORDER TABLE -->
  <div style="padding:0 40px">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #f0e8ec;border-radius:6px;overflow:hidden;margin:24px 0">
      <thead>
        <tr style="background:#f8e3e8">
          <th style="padding:11px 16px;text-align:left;font-family:'Barlow Condensed',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#004065">Product</th>
          <th style="padding:11px 16px;text-align:center;font-family:'Barlow Condensed',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#004065">Quantity</th>
          <th style="padding:11px 16px;text-align:right;font-family:'Barlow Condensed',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#004065">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <!-- Subtotal -->
        <tr>
          <td colspan="2" style="padding:10px 16px;font-size:13px;color:#004065;border-bottom:1px solid #f0e8ec"><strong>Subtotal</strong></td>
          <td style="padding:10px 16px;text-align:right;font-size:13px;color:#004065;border-bottom:1px solid #f0e8ec">${fmt(subtotal)}</td>
        </tr>
        <!-- Shipping -->
        <tr>
          <td colspan="2" style="padding:10px 16px;font-size:13px;color:#004065;border-bottom:1px solid #f0e8ec"><strong>Shipping</strong></td>
          <td style="padding:10px 16px;text-align:right;font-size:13px;color:#004065;border-bottom:1px solid #f0e8ec">Free Shipping</td>
        </tr>
        <!-- Payment -->
        <tr>
          <td colspan="2" style="padding:10px 16px;font-size:13px;color:#004065;border-bottom:1px solid #f0e8ec"><strong>Payment Method</strong></td>
          <td style="padding:10px 16px;text-align:right;font-size:13px;color:#004065;border-bottom:1px solid #f0e8ec">Credit / Debit Card</td>
        </tr>
        <!-- Total -->
        <tr style="background:#f8e3e8">
          <td colspan="2" style="padding:13px 16px;font-family:'Barlow Condensed',Arial,sans-serif;font-size:17px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#004065"><strong>Total</strong></td>
          <td style="padding:13px 16px;text-align:right;font-family:'Barlow Condensed',Arial,sans-serif;font-size:17px;font-weight:800;color:#004065">${fmt(subtotal)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ADDRESSES -->
  <div style="padding:0 40px 28px">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%" style="padding-right:12px;vertical-align:top">
          <p style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#004065;margin:0 0 10px;border-bottom:2px solid #f8e3e8;padding-bottom:6px">Billing Address</p>
          <p style="font-size:13px;color:#004065;line-height:1.8;margin:0">
            ${form.fn} ${form.ln}<br/>
            ${form.addr}${form.flat ? "<br/>" + form.flat : ""}<br/>
            ${form.city}, ${form.prov}<br/>
            ${form.zip}<br/>
            ${form.country}<br/>
            ${form.phone}<br/>
            ${form.email}
          </p>
        </td>
        <td width="50%" style="padding-left:12px;vertical-align:top">
          <p style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#004065;margin:0 0 10px;border-bottom:2px solid #f8e3e8;padding-bottom:6px">Shipping Address</p>
          <p style="font-size:13px;color:#004065;line-height:1.8;margin:0">
            ${form.fn} ${form.ln}<br/>
            ${form.addr}${form.flat ? "<br/>" + form.flat : ""}<br/>
            ${form.city}, ${form.prov}<br/>
            ${form.zip}<br/>
            ${form.country}<br/>
            ${form.phone}<br/>
            ${form.email}
          </p>
        </td>
      </tr>
    </table>
  </div>

  <!-- SUPPORT -->
  <div style="background:#ffffff;padding:28px 40px;text-align:center">
    <p style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#004065;margin:0 0 10px">Need Support?</p>
    <p style="font-size:13px;color:#004065;margin:0 0 4px">Contact our <a href="mailto:contact@laprimagioielli.it" style="color:#004065;font-weight:700">customer care</a></p>
    <p style="font-size:13px;color:#004065;margin:0 0 2px">Email: <a href="mailto:customercare@laprimagioielli.it" style="color:#004065">customercare@laprimagioielli.it</a></p>
    <p style="font-size:13px;color:#004065;margin:0 0 2px">Call: <a href="tel:+3904441791049" style="color:#004065">+39 0444 1791049</a></p>
    <p style="font-size:13px;color:#004065;margin:0 0 18px">From Monday to Friday · 9am – 5pm</p>
    <p style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#004065;margin:0 0 12px">Follow us on social media</p>
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
    <p style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:14px;font-weight:700;color:#004065;margin:0 0 2px;letter-spacing:.04em">
      La Prima Gioielli, A Brand Of
    </p>
    <p style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:14px;font-weight:700;color:#004065;margin:0 0 2px;letter-spacing:.04em">
      United Group International Srl
    </p>
    <p style="font-size:12px;color:#004065;margin:0">
      Via della Robbia Luca, 42, 36100 Vicenza VI (ITALY)
    </p>
  </div>

</div>
</body>
</html>`;

    // Internal company email
    const internalItemsHtml = cartItems.map(item => {
      const price = parsePrice(item.price);
      const lineTotal = fmt(price * item.quantity);
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;vertical-align:top">
            <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
              <tr>
                ${item.image ? `<td style="padding-right:12px;vertical-align:top">
                  <a href="${SITE_URL}/detailedPage?id=${item.id}">
                    <img src="${item.image}" alt="${item.name}" width="70" height="70" style="display:block;border-radius:4px;border:1px solid #e5e7eb;object-fit:cover"/>
                  </a>
                </td>` : ""}
                <td style="vertical-align:top">
                  <a href="${SITE_URL}/detailedPage?id=${item.id}" style="color:#004065;font-weight:700;font-size:14px;text-decoration:underline;display:block;margin-bottom:4px">${item.name}</a>
                  ${item.sku ? `<span style="font-size:12px;color:#6b7280;display:block">SKU: <strong>${item.sku}</strong></span>` : ""}
                  ${item.variationName ? `<span style="font-size:12px;color:#9ca3af;display:block">${item.variationName}</span>` : ""}
                </td>
              </tr>
            </table>
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:top;font-size:14px;color:#515151">${item.quantity}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;text-align:right;vertical-align:top;font-size:14px;color:#515151;white-space:nowrap">${lineTotal}</td>
        </tr>`;
    }).join("");

    const internalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>New Order #${orderNumber}</title>
</head>
<body style="margin:0;padding:16px;background:#f4eff1;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #dfdfdf">

  <!-- HEADER -->
  <div style="background:#f8e3e8;padding:20px 24px;text-align:center;border-bottom:1px solid #dfdfdf">
    <h1 style="margin:0;font-size:22px;font-weight:700;color:#004065">New Order #${orderNumber}</h1>
  </div>

  <!-- BODY -->
  <div style="padding:24px">
    <p style="margin:0 0 20px;font-size:14px;color:#515151">
      New order has been placed, here are the details:
    </p>

    <!-- Order number + date -->
    <p style="margin:0 0 16px;font-size:13px;color:#004065">
      <a href="${SITE_URL}/dashboard/orders" style="color:#004065;font-weight:600">[Order #${orderNumber}]</a>
      <span style="color:#515151">${now}</span>
    </p>

    <!-- Dashboard CTA -->
    <div style="margin:0 0 24px;text-align:center">
      <a href="${SITE_URL}/dashboard/orders"
         style="display:inline-block;background:#004065;color:#ffffff;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:12px 32px;text-decoration:none;border-radius:4px">
        View Order in Dashboard →
      </a>
    </div>

    <!-- ORDER TABLE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #dfdfdf;margin-bottom:24px">
      <thead>
        <tr style="background:#f8e3e8">
          <th style="padding:10px 16px;text-align:left;font-size:13px;font-weight:700;color:#004065;border-bottom:1px solid #dfdfdf">Product</th>
          <th style="padding:10px 16px;text-align:center;font-size:13px;font-weight:700;color:#004065;border-bottom:1px solid #dfdfdf">Quantity</th>
          <th style="padding:10px 16px;text-align:right;font-size:13px;font-weight:700;color:#004065;border-bottom:1px solid #dfdfdf">Price</th>
        </tr>
      </thead>
      <tbody>
        ${internalItemsHtml}
        <!-- Subtotal -->
        <tr>
          <td colspan="2" style="padding:10px 16px;font-size:13px;color:#515151;border-bottom:1px solid #e5e7eb;font-weight:600">Subtotal</td>
          <td style="padding:10px 16px;text-align:right;font-size:13px;color:#515151;border-bottom:1px solid #e5e7eb">${fmt(subtotal)}</td>
        </tr>
        <!-- Shipping -->
        <tr>
          <td colspan="2" style="padding:10px 16px;font-size:13px;color:#515151;border-bottom:1px solid #e5e7eb;font-weight:600">Shipping</td>
          <td style="padding:10px 16px;text-align:right;font-size:13px;color:#004065;border-bottom:1px solid #e5e7eb">Free Shipping</td>
        </tr>
        <!-- Payment -->
        <tr>
          <td colspan="2" style="padding:10px 16px;font-size:13px;color:#515151;border-bottom:1px solid #e5e7eb;font-weight:600">Payment Method</td>
          <td style="padding:10px 16px;text-align:right;font-size:13px;color:#515151;border-bottom:1px solid #e5e7eb">Credit / Debit Card</td>
        </tr>
        <!-- Total -->
        <tr>
          <td colspan="2" style="padding:10px 16px;font-size:13px;color:#004065;font-weight:700">Total</td>
          <td style="padding:10px 16px;text-align:right;font-size:13px;color:#004065;font-weight:700">${fmt(subtotal)}</td>
        </tr>
      </tbody>
    </table>

    <!-- ADDRESSES -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #dfdfdf">
      <tr>
        <td width="50%" style="padding:16px;vertical-align:top;border-right:1px solid #dfdfdf">
          <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#004065;border-bottom:1px solid #f8e3e8;padding-bottom:6px">Billing Address</p>
          <p style="margin:0;font-size:13px;color:#004065;line-height:1.8">
            ${form.fn} ${form.ln}<br/>
            ${form.addr}${form.flat ? "<br/>" + form.flat : ""}<br/>
            ${form.city}<br/>
            ${form.prov}<br/>
            ${form.zip}<br/>
            ${form.country}<br/>
            ${form.phone}<br/>
            <a href="mailto:${form.email}" style="color:#004065">${form.email}</a>
          </p>
        </td>
        <td width="50%" style="padding:16px;vertical-align:top">
          <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#004065;border-bottom:1px solid #f8e3e8;padding-bottom:6px">Shipping Address</p>
          <p style="margin:0;font-size:13px;color:#004065;line-height:1.8">
            ${form.fn} ${form.ln}<br/>
            ${form.addr}${form.flat ? "<br/>" + form.flat : ""}<br/>
            ${form.city}<br/>
            ${form.prov}<br/>
            ${form.zip}<br/>
            ${form.country}<br/>
            ${form.phone}<br/>
            <a href="mailto:${form.email}" style="color:#004065">${form.email}</a>
          </p>
        </td>
      </tr>
    </table>
  </div>

</div>
</body>
</html>`;

    const [{ error }, { error: internalError }] = await Promise.all([
      resend.emails.send({
        from: "La Prima Gioielli <onboarding@resend.dev>",
        to: form.email,
        subject: `Order Confirmed – #${orderNumber} | La Prima Gioielli`,
        html,
      }),
      resend.emails.send({
        from: "La Prima Gioielli <onboarding@resend.dev>",
        to: "nourelhoudarajichi@gmail.com",
        subject: `[NEW ORDER] #${orderNumber} – ${form.fn} ${form.ln} – ${fmt(subtotal)}`,
        html: internalHtml,
      }),
    ]);

    if (error) console.error("Customer email error:", error);
    if (internalError) console.error("Internal email error:", internalError);
    if (error && internalError) return Response.json({ error: "Failed to send emails" }, { status: 500 });

    return Response.json({ success: true });
  } catch (e) {
    console.error("send-order-email error:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
