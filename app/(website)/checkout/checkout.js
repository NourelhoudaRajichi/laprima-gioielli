"use client";
import { useState } from "react";
import './checkout.css'
import { useCart } from "@/components/Context"; // adjust path if needed

const COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (DRC)","Congo (Republic)","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

const navy = "#004065";
const pink = "#ec9cb2";
const blush = "#f8e3e8";
const border = "#dde4ea";
const muted = "rgba(0,64,101,0.42)";

function Label({ children, required }) {
  return (
    <label style={{ display:"block", fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:navy, marginBottom:6 }}>
      {children}{required && <span style={{ color:pink, marginLeft:2 }}>*</span>}
    </label>
  );
}

function Field({ label, required, type="text", placeholder, value, onChange }) {
  const [f,setF] = useState(false);
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{ width:"100%", fontFamily:"'Inter',sans-serif", fontSize:14, color:navy, background:"#fff", border:`1.5px solid ${f?pink:border}`, borderRadius:6, padding:"10px 14px", outline:"none", transition:"border-color .18s", boxSizing:"border-box" }} />
    </div>
  );
}

function CountrySelect({ value, onChange }) {
  const [f,setF] = useState(false);
  return (
    <div>
      <Label required>Country / Region</Label>
      <div style={{ position:"relative" }}>
        <select value={value} onChange={onChange} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
          style={{ width:"100%", fontFamily:"'Inter',sans-serif", fontSize:14, color:value?navy:muted, background:"#fff", border:`1.5px solid ${f?pink:border}`, borderRadius:6, padding:"10px 14px", outline:"none", appearance:"none", cursor:"pointer", boxSizing:"border-box" }}>
          <option value="" disabled>Select a country…</option>
          {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <svg style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} width="14" height="14" fill="none" stroke={pink} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  // ✅ Read live cart from context
  const { cartItems, totalPrice = 0 } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat((item.price || "0").replace(",", "")) * item.quantity, 0);
  const total = subtotal; // shipping is free

  const [form, setForm] = useState({ fn:"",ln:"",co:"",tax:"",country:"",addr:"",flat:"",city:"",prov:"",zip:"",phone:"",email:"" });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const [diffAddr, setDiffAddr] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);

  const handlePlace = () => {
    if (!agreed) return;
    setLoading(true);
    setTimeout(()=>{ setLoading(false); setPlaced(true); }, 1600);
  };

  if (placed) return (
    <div style={{ minHeight:"100vh", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <div style={{ textAlign:"center", maxWidth:380, padding:24 }}>
        <div style={{ width:64,height:64,borderRadius:"50%",background:pink,color:"#fff",fontSize:28,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px" }}>✓</div>
        <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:46,fontWeight:800,textTransform:"uppercase",color:navy,marginBottom:12 }}>Order Confirmed</h1>
        <p style={{ fontFamily:"'Inter',sans-serif",fontSize:14,color:navy,opacity:.6,lineHeight:1.7,marginBottom:24 }}>Thank you for your purchase. A confirmation email has been sent with your order details.</p>
        <p style={{ fontFamily:"'Inter',sans-serif",fontSize:11,textTransform:"uppercase",letterSpacing:"0.18em",color:pink }}>Order #ATL-29471</p>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"'Inter',sans-serif" }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"44px 36px 72px" }}>

          {/* BIG TITLE */}
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:800, textTransform:"uppercase", color:navy, marginBottom:28 }}>Checkout</h1>

          {/* PROGRESS STEPPER */}
          <div style={{ display:"flex", alignItems:"flex-start", gap:0, marginBottom:6 }}>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:22,height:22,borderRadius:"50%",border:`2px solid ${pink}`,background:blush,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <svg width="10" height="10" fill="none" stroke={pink} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:".08em",color:navy }}>Shopping Bag</span>
              </div>
              <p className="pstep" style={{ fontFamily:"'Inter',sans-serif",fontSize:11,color:pink,fontWeight:600,letterSpacing:".05em",marginLeft:30 }}>VIEW YOUR ITEMS</p>
            </div>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4, alignItems:"center" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:".08em",color:pink }}>Checkout</span>
            </div>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:".08em",color:"rgba(0,64,101,.28)" }}>Confirmation</span>
              <p className="pstep" style={{ fontFamily:"'Inter',sans-serif",fontSize:11,color:"rgba(0,64,101,.28)",letterSpacing:".04em" }}>REVIEW YOUR ORDER!</p>
            </div>
          </div>
          {/* Track */}
          <div style={{ height:3,background:"#eaeef1",borderRadius:2,marginBottom:36,overflow:"hidden" }}>
            <div style={{ height:"100%",width:"65%",background:pink,borderRadius:2 }} />
          </div>

          {/* COUPON */}
          <div style={{ marginBottom:34 }}>
            <span style={{ fontFamily:"'Inter',sans-serif",fontSize:14,color:muted }}>Have a coupon? </span>
            <button onClick={()=>setCouponOpen(p=>!p)} style={{ fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,color:navy,background:"none",border:"none",cursor:"pointer",textDecoration:"underline" }}>
              Click here to enter your code
            </button>
            {couponOpen && (
              <div className="fin" style={{ display:"flex",gap:10,marginTop:12,maxWidth:420 }}>
                <input type="text" placeholder="Coupon code"
                  style={{ flex:1,fontFamily:"'Inter',sans-serif",fontSize:13,color:navy,border:`1.5px solid ${border}`,borderRadius:6,padding:"9px 14px",outline:"none" }}
                  onFocus={e=>(e.target.style.borderColor=pink)} onBlur={e=>(e.target.style.borderColor=border)} />
                <button style={{ background:navy,color:"#fff",border:"none",borderRadius:6,padding:"9px 22px",fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer" }}>Apply</button>
              </div>
            )}
          </div>

          {/* MAIN GRID */}
          <div className="mgrid" style={{ display:"grid", gridTemplateColumns:"1fr 430px", gap:52, alignItems:"start" }}>

            {/* ══ LEFT – Billing Details ══ */}
            <div className="fin">
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:19,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:navy,borderBottom:`2px solid ${blush}`,paddingBottom:10,marginBottom:22 }}>
                Billing Details
              </p>
              <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                  <Field label="First Name" required value={form.fn} onChange={set("fn")} />
                  <Field label="Last Name"  required value={form.ln} onChange={set("ln")} />
                </div>
                <Field label="Company Name (Optional)" value={form.co} onChange={set("co")} />
                <Field label="Tax Code (Optional)" value={form.tax} onChange={set("tax")} />
                <CountrySelect value={form.country} onChange={set("country")} />
                <Field label="Address" required placeholder="Street address" value={form.addr} onChange={set("addr")} />
                <Field label="Flat, Suite, Unit, etc. (Optional)" placeholder="Apartment, suite, unit, etc." value={form.flat} onChange={set("flat")} />
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                  <Field label="Città" required value={form.city} onChange={set("city")} />
                  <Field label="Province" required value={form.prov} onChange={set("prov")} />
                </div>
                <Field label="Postal / ZIP Code" required value={form.zip} onChange={set("zip")} />
                <Field label="Phone" required type="tel" value={form.phone} onChange={set("phone")} />
                <Field label="E-mail Address" required type="email" value={form.email} onChange={set("email")} />
              </div>

              {/* Deliver to different address */}
              <label style={{ display:"flex",alignItems:"center",gap:10,marginTop:22,cursor:"pointer" }}>
                <input type="checkbox" checked={diffAddr} onChange={e=>setDiffAddr(e.target.checked)} />
                <span style={{ fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:600,color:navy }}>Deliver to a different address?</span>
              </label>

              {diffAddr && (
                <div className="fin" style={{ marginTop:18,padding:18,border:`1.5px solid ${blush}`,borderRadius:10,background:"#fdfbfb",display:"flex",flexDirection:"column",gap:14 }}>
                  <p style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:navy }}>Shipping Address</p>
                  <CountrySelect value="" onChange={()=>{}} />
                  <Field label="Address" required placeholder="Street address" />
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                    <Field label="City" required />
                    <Field label="Province" required />
                  </div>
                  <Field label="Postal / ZIP Code" required />
                </div>
              )}

              <div style={{ marginTop:22 }}>
                <Label>Order Notes (Optional)</Label>
                <textarea placeholder="Notes about your order, e.g. special notes for delivery." rows={4}
                  style={{ width:"100%",fontFamily:"'Inter',sans-serif",fontSize:14,color:navy,background:"#fff",border:`1.5px solid ${border}`,borderRadius:6,padding:"10px 14px",outline:"none",resize:"vertical",boxSizing:"border-box" }}
                  onFocus={e=>(e.target.style.borderColor=pink)} onBlur={e=>(e.target.style.borderColor=border)} />
              </div>
            </div>

            {/* ══ RIGHT – Your Order ══ */}
            <div className="fin" style={{ animationDelay:".12s" }}>

              {/* Order table */}
              <div style={{ border:`1.5px solid ${border}`,borderRadius:10,overflow:"hidden",marginBottom:18 }}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr auto",background:"#f2f6f8",padding:"11px 18px",borderBottom:`1px solid ${border}` }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:navy }}>Product</span>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:navy }}>Subtotal</span>
                </div>

                {/* ✅ Live cart items from context */}
                {cartItems.length === 0 ? (
                  <div style={{ padding:"24px 18px", textAlign:"center" }}>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:muted }}>Your cart is empty.</p>
                  </div>
                ) : (
                  cartItems.map(item => {
                    const itemPrice = parseFloat((item.price || "0").replace(",", ""));
                    const itemTotal = itemPrice * item.quantity;
                    return (
                      <div key={`${item.id}-${item.variationName}`} style={{ display:"flex",alignItems:"center",gap:14,padding:"15px 18px",borderBottom:`1px solid ${border}`,background:"#fff" }}>
                        <img src={item.image} alt={item.name} style={{ width:54,height:54,objectFit:"cover",borderRadius:8,background:blush,flexShrink:0 }} />
                        <div style={{ flex:1 }}>
                          <p style={{ fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,color:navy }}>{item.name}</p>
                          <p style={{ fontFamily:"'Inter',sans-serif",fontSize:11,color:muted,marginTop:2 }}>{item.variationName}</p>
                          <p style={{ fontFamily:"'Inter',sans-serif",fontSize:12,color:pink,marginTop:3 }}>× {item.quantity}</p>
                        </div>
                        <span style={{ fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:600,color:navy,whiteSpace:"nowrap" }}>
                          {itemTotal.toLocaleString("it-IT",{minimumFractionDigits:2})} €
                        </span>
                      </div>
                    );
                  })
                )}

                {/* Totals rows */}
                {[
                  { label:"Subtotal", val:`${subtotal.toLocaleString("it-IT",{minimumFractionDigits:2})} €`, dim:false },
                  { label:"Shipping", val:"Free", dim:false },
                  { label:"Total",    val:`${total.toLocaleString("it-IT",{minimumFractionDigits:2})} €`,    bold:true },
                ].map(r=>(
                  <div key={r.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 18px",borderBottom:r.label!=="Total"?`1px solid ${border}`:"none",background:r.label==="Total"?"#f9fbfc":"#fff" }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:r.bold?16:13,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:navy }}>{r.label}</span>
                    <span style={{ fontFamily:"'Inter',sans-serif",fontSize:r.bold?15:13,fontWeight:r.bold?700:400,color:r.dim?muted:navy,fontStyle:r.dim?"italic":"normal" }}>{r.val}</span>
                  </div>
                ))}
              </div>

              {/* Payment box */}
              <div style={{ border:`1.5px solid ${border}`,borderRadius:10,overflow:"hidden",marginBottom:18,background:"#f7f9fb" }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,padding:"13px 18px",borderBottom:`1px solid ${border}`,background:"#f2f6f8" }}>
                  <svg width="17" height="17" fill="none" stroke={navy} viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" strokeWidth={1.8}/><line x1="1" y1="10" x2="23" y2="10" strokeWidth={1.8}/></svg>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:navy }}>Credit / Debit Card</span>
                </div>
                <div style={{ padding:"16px 18px",display:"flex",flexDirection:"column",gap:12 }}>
                  <label style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}>
                    <input type="radio" name="card" defaultChecked />
                    <span style={{ fontFamily:"'Inter',sans-serif",fontSize:13,color:navy }}>Visa ending in 7553 <span style={{ color:muted }}>(expires 06/26)</span></span>
                  </label>
                  <label style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}>
                    <input type="radio" name="card" />
                    <span style={{ fontFamily:"'Inter',sans-serif",fontSize:13,color:navy }}>Use a new payment method</span>
                  </label>
                  <div style={{ display:"flex",flexDirection:"column",gap:10,marginTop:2 }}>
                    <input type="text" placeholder="Card number"
                      style={{ width:"100%",fontFamily:"'Inter',sans-serif",fontSize:13,color:navy,background:"#fff",border:`1.5px solid ${border}`,borderRadius:6,padding:"9px 13px",outline:"none",boxSizing:"border-box" }}
                      onFocus={e=>(e.target.style.borderColor=pink)} onBlur={e=>(e.target.style.borderColor=border)} />
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                      <input type="text" placeholder="MM / YY"
                        style={{ fontFamily:"'Inter',sans-serif",fontSize:13,color:navy,background:"#fff",border:`1.5px solid ${border}`,borderRadius:6,padding:"9px 13px",outline:"none",boxSizing:"border-box" }}
                        onFocus={e=>(e.target.style.borderColor=pink)} onBlur={e=>(e.target.style.borderColor=border)} />
                      <input type="text" placeholder="CVV"
                        style={{ fontFamily:"'Inter',sans-serif",fontSize:13,color:navy,background:"#fff",border:`1.5px solid ${border}`,borderRadius:6,padding:"9px 13px",outline:"none",boxSizing:"border-box" }}
                        onFocus={e=>(e.target.style.borderColor=pink)} onBlur={e=>(e.target.style.borderColor=border)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy note */}
              <p style={{ fontFamily:"'Inter',sans-serif",fontSize:12.5,color:navy,opacity:.6,lineHeight:1.7,marginBottom:13 }}>
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
                <a href="#" style={{ color:navy,fontWeight:600,opacity:1,textDecoration:"underline" }}>privacy policy</a>.
              </p>

              {/* T&C checkbox */}
              <label style={{ display:"flex",alignItems:"flex-start",gap:10,marginBottom:18,cursor:"pointer" }}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:2 }} />
                <span style={{ fontFamily:"'Inter',sans-serif",fontSize:13,color:navy,lineHeight:1.5 }}>
                  I have read and agree to the website{" "}
                  <a href="#" style={{ color:navy,fontWeight:700,textDecoration:"underline" }}>terms and conditions</a>
                  <span style={{ color:pink,marginLeft:2 }}>*</span>
                </span>
              </label>

              {/* PLACE ORDER */}
              <button
                onClick={handlePlace}
                disabled={loading || !agreed || cartItems.length === 0}
                className="place-btn"
                style={{
                  width:"100%", padding:"16px 0", borderRadius:8, border:"none",
                  fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:800,
                  textTransform:"uppercase", letterSpacing:".14em",
                  color:"#fff", cursor:(!agreed||loading||cartItems.length===0)?"not-allowed":"pointer",
                  background: loading ? undefined : (!agreed || cartItems.length===0 ? "rgba(236,156,178,0.48)" : pink),
                  position:"relative", overflow:"hidden", transition:"filter .2s",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}
              >
                {loading
                  ? <span className="shimmer" style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase" }}>Processing…</span>
                  : <>
                      <svg width="15" height="15" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      <span style={{ position:"relative",zIndex:1 }}>Place Order</span>
                    </>
                }
              </button>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}