const base = process.env.WP_BASE_URL;
const key = process.env.WC_CONSUMER_KEY;
const secret = process.env.WC_CONSUMER_SECRET;
const auth = Buffer.from(`${key}:${secret}`).toString("base64");

export async function POST(request) {
  try {
    const { form, cartItems, agentRef } = await request.json();

    const lineItems = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      ...(item.variationId ? { variation_id: item.variationId } : {}),
    }));

    const order = {
      status: "pending",
      billing: {
        first_name: form.fn,
        last_name: form.ln,
        company: form.co || "",
        address_1: form.addr,
        address_2: form.flat || "",
        city: form.city,
        state: form.prov,
        postcode: form.zip,
        country: form.country,
        email: form.email,
        phone: form.phone,
      },
      shipping: {
        first_name: form.fn,
        last_name: form.ln,
        address_1: form.addr,
        address_2: form.flat || "",
        city: form.city,
        state: form.prov,
        postcode: form.zip,
        country: form.country,
      },
      line_items: lineItems,
      shipping_lines: [{ method_id: "free_shipping", method_title: "Free Shipping", total: "0.00" }],
      ...(agentRef ? { meta_data: [{ key: "agent_ref", value: agentRef }] } : {}),
    };

    const res = await fetch(`${base}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    const data = await res.json();
    if (!res.ok) return Response.json({ error: data.message || "WC order failed" }, { status: 500 });

    return Response.json({ orderId: data.id, orderNumber: data.number });
  } catch (e) {
    console.error("create-order error:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
