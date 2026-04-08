"use client";
import { useState } from "react";
import './cart.css'
// --- In a real Next.js app, replace this mock router with:
// import { useRouter } from "next/navigation";
// const router = useRouter();
// router.push("/checkout")

const navy   = "#004065";
const pink   = "#ec9cb2";
const blush  = "#f8e3e8";
const bdr    = "#dde4ea";
const muted  = "rgba(0,64,101,0.38)";

const INIT = [
  { id:1, name:"Verona Bangle with Diamonds", price:6710, qty:1,
    img:"https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=200&q=80" },
];

const fmt = n => n.toLocaleString("it-IT",{minimumFractionDigits:2}) + " \u20ac";

export default function CartPage() {
  const [items, setItems]         = useState(INIT);
  const [coupon, setCoupon]       = useState("");
  const [couponFocus, setCF]      = useState(false);
  const [navigating, setNav]      = useState(false);

  const updateQty = (id, d) =>
    setItems(p => p.map(it => it.id===id ? {...it,qty:Math.max(1,it.qty+d)} : it));
  const remove = id => setItems(p => p.filter(it=>it.id!==id));

  const subtotal = items.reduce((s,i)=>s+i.price*i.qty, 0);

  const goCheckout = () => {
    setNav(true);
    // Replace with: router.push("/checkout")
    setTimeout(()=>{ window.location.href="/checkout"; }, 200);
  };

  if (navigating) return (
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&display=swap');`}</style>
      <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,textTransform:"uppercase",color:pink,letterSpacing:".1em"}}>Redirecting to Checkout…</p>
    </div>
  );

  return (
    <>
    
      <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Inter',sans-serif"}}>
        <div style={{maxWidth:1160,margin:"0 auto",padding:"44px 36px 80px"}}>

          {/* TITLE */}
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:56,fontWeight:800,textTransform:"uppercase",color:navy,marginBottom:28}}>Cart</h1>

          {/* PROGRESS */}
          <div style={{display:"flex",alignItems:"flex-start",marginBottom:6}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${pink}`,background:blush,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="10" height="10" fill="none" stroke={pink} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:".08em",color:navy}}>Shopping Bag</span>
              </div>
              <p style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:pink,fontWeight:600,letterSpacing:".05em",marginLeft:30,marginTop:3}}>VIEW YOUR ITEMS</p>
            </div>
            <div style={{flex:1,display:"flex",justifyContent:"center"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:".08em",color:"rgba(0,64,101,0.32)"}}>Checkout</span>
            </div>
            <div style={{flex:1,textAlign:"right"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:".08em",color:"rgba(0,64,101,0.22)"}}>Confirmation</span>
              <p style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"rgba(0,64,101,0.22)",letterSpacing:".04em",marginTop:3}}>REVIEW YOUR ORDER!</p>
            </div>
          </div>
          <div style={{height:3,background:"#eaeef1",borderRadius:2,marginBottom:40,overflow:"hidden"}}>
            <div style={{height:"100%",width:"33%",background:pink,borderRadius:2}}/>
          </div>

          {/* TABLE */}
          <div style={{border:`1px solid ${bdr}`,borderRadius:10,overflow:"hidden",marginBottom:36}}>
            {/* Header */}
            <div className="trow" style={{display:"grid",gridTemplateColumns:"1fr 150px 180px 150px",background:"#f2f6f8",borderBottom:`1px solid ${bdr}`,padding:"12px 22px"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:navy}}>Product</span>
              <span className="th-p" style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:navy,textAlign:"center"}}>Price</span>
              <span className="th-q" style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:navy,textAlign:"center"}}>Quantity</span>
              <span className="th-s" style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:navy,textAlign:"right"}}>Subtotal</span>
            </div>

            {items.length === 0
              ? <div style={{padding:"52px",textAlign:"center"}}><p style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:muted}}>Your cart is empty.</p></div>
              : items.map((item,i) => (
                <div key={item.id} className="trow" style={{display:"grid",gridTemplateColumns:"1fr 150px 180px 150px",padding:"20px 22px",borderBottom:i<items.length-1?`1px solid ${bdr}`:"none",background:"#fff",alignItems:"center"}}>
                  {/* Product */}
                  <div style={{display:"flex",alignItems:"center",gap:16}}>
                    <img src={item.img} alt={item.name} style={{width:72,height:72,objectFit:"cover",borderRadius:8,background:blush,flexShrink:0}}/>
                    <div>
                      <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:navy,marginBottom:6}}>{item.name}</p>
                      <button onClick={()=>remove(item.id)} className="rem" style={{fontFamily:"'Inter',sans-serif",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",color:muted,background:"none",border:"none",cursor:"pointer",padding:0,transition:"color .15s"}}>Remove</button>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="td-p" style={{textAlign:"center"}}>
                    <span style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:navy}}>{fmt(item.price)}</span>
                  </div>
                  {/* Qty */}
                  <div className="td-q" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <button onClick={()=>updateQty(item.id,-1)} className="qbtn" style={{width:33,height:33,border:`1.5px solid ${bdr}`,borderRight:"none",borderRadius:"6px 0 0 6px",background:"#fff",color:navy,fontSize:17,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>−</button>
                    <div style={{width:42,height:33,border:`1.5px solid ${bdr}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:600,color:navy,background:"#fff"}}>{item.qty}</div>
                    <button onClick={()=>updateQty(item.id,+1)} className="qbtn" style={{width:33,height:33,border:`1.5px solid ${bdr}`,borderLeft:"none",borderRadius:"0 6px 6px 0",background:"#fff",color:navy,fontSize:17,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>+</button>
                  </div>
                  {/* Subtotal */}
                  <div className="td-s" style={{textAlign:"right"}}>
                    <span style={{fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:600,color:navy}}>{fmt(item.price*item.qty)}</span>
                  </div>
                </div>
              ))
            }
          </div>

          {/* COUPON + BASKET TOTALS */}
          <div className="cgrid" style={{display:"grid",gridTemplateColumns:"1fr 460px",gap:48,alignItems:"start"}}>

            {/* Coupon */}
            <div style={{display:"flex",maxWidth:380}}>
              <input type="text" value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Codice promozionale"
                onFocus={()=>setCF(true)} onBlur={()=>setCF(false)}
                style={{flex:1,fontFamily:"'Inter',sans-serif",fontSize:13,color:navy,background:"#fff",border:`1.5px solid ${couponFocus?pink:bdr}`,borderRight:"none",borderRadius:"6px 0 0 6px",padding:"10px 14px",outline:"none",transition:"border-color .18s"}}/>
              <button style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:navy,background:"#f2f6f8",border:`1.5px solid ${bdr}`,borderLeft:"none",borderRadius:"0 6px 6px 0",padding:"10px 22px",cursor:"pointer"}}>Apply</button>
            </div>

            {/* Basket Totals */}
            <div>
              <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:navy,marginBottom:14}}>Basket Totals</p>
              <div style={{border:`1px solid ${bdr}`,borderRadius:10,overflow:"hidden",marginBottom:16}}>
                {[
                  { label:"Subtotal", content: <span style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:navy}}>{fmt(subtotal)}</span> },
                  { label:"Shipping", content: <div><p style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:navy,marginBottom:5}}>Free Shipping</p><p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:muted,lineHeight:1.55}}>Shipping to <strong style={{color:navy,fontWeight:600}}>Via Dante Alighieri, 40/A, 36030, Costabissara, VICENZA</strong>.</p></div> },
                  { label:"Total",    content: <span style={{fontFamily:"'Inter',sans-serif",fontSize:15,fontWeight:700,color:navy}}>{fmt(subtotal)}</span>, last:true },
                ].map(row=>(
                  <div key={row.label} style={{display:"grid",gridTemplateColumns:"140px 1fr",borderBottom:row.last?"none":`1px solid ${bdr}`}}>
                    <div style={{background:"#f2f6f8",padding:"14px 18px",display:"flex",alignItems:"center"}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:row.last?14:13,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:navy}}>{row.label}</span>
                    </div>
                    <div style={{background:"#fff",padding:"14px 18px",display:"flex",alignItems:"center"}}>{row.content}</div>
                  </div>
                ))}
              </div>

              <button onClick={goCheckout} disabled={items.length===0} className="gobtn"
                style={{width:"100%",padding:"16px 0",borderRadius:8,border:"none",fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,textTransform:"uppercase",letterSpacing:".14em",color:"#fff",background:items.length===0?"rgba(236,156,178,0.45)":pink,cursor:items.length===0?"not-allowed":"pointer",transition:"filter .2s"}}>
                Checkout
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}