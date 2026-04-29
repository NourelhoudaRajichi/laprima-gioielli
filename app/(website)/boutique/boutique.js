"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import './boutique.css'



// ─── Data ─────────────────────────────────────────────────────────────────────

const STORES = [
  // SAUDI ARABIA — AL BAGSHI
  { id: 1,  name: "AL BAGSHI 1", city: "Al-Hasa",          country: "Saudi Arabia", address: "Al-Dhahran Road, Albustan, Al Mubarraz, Al Othaim Mall", zip: "36341", lat: 25.3945, lng: 49.5958 },
  { id: 2,  name: "AL BAGSHI 2", city: "Riyadh",           country: "Saudi Arabia", address: "Exit 9, Al Imam Saud Ibn Abdul Aziz Branch Rd, Al Mughrizat, Riyadh 12483, Al Nakheel Mall", zip: "", lat: 24.7578, lng: 46.6971 },
  { id: 3,  name: "AL BAGSHI 3", city: "Al-Ahsa",          country: "Saudi Arabia", address: "King Abdullah Road, Granada, Al Hofuf 36441, Al Ahsa Mall", zip: "", lat: 25.4004, lng: 49.5780 },
  { id: 4,  name: "AL BAGSHI 4", city: "Dhahran",          country: "Saudi Arabia", address: "Mall of Dhahran Blvd, Al Dawhah Al Janubiyah, Dhahran 34457, Mall Of Dhahran", zip: "", lat: 26.3034, lng: 50.1661 },
  { id: 5,  name: "AL BAGSHI 5", city: "Dammam",           country: "Saudi Arabia", address: "3543 King Fahd Road, Al Manar, Dammam 32274, Al Nakheel Mall", zip: "", lat: 26.3915, lng: 50.0350 },
  // LUXEMBOURG
  { id: 6,  name: "GALERIES LAFAYETTE LUXEMBOURG – ROYAL QUARTZ", city: "Boulevard Royal", country: "Luxembourg", address: "427 GL Luxembourg 45 Boulevard Royal L-2449", zip: "", lat: 49.6121, lng: 6.1238 },
  { id: 7,  name: "ISABELLE KASS BIJOUTERIE JOAILLERIE",           city: "Bertrange",       country: "Luxembourg", address: "Rte d'Arlon, 8050 Bertrange", zip: "", lat: 49.6231, lng: 6.0489 },
  // FRANCE — PRINTEMPS
  { id: 8,  name: "PRINTEMPS HAUSSMAN", city: "Rue Charras",       country: "France", address: "9 Rue Charras- 75009 – Paris", zip: "", lat: 48.8730, lng: 2.3281 },
  { id: 9,  name: "PRINTEMPS LILLE",    city: "Lille",             country: "France", address: "39 Place Rihour-59800 Lille", zip: "", lat: 50.6361, lng: 3.0597 },
  { id: 10, name: "PRINTEMPS LYON",     city: "Lyon",              country: "France", address: "26 rue Thomassin-69002 Lyon", zip: "", lat: 45.7609, lng: 4.8344 },
  { id: 11, name: "PRINTEMPS MARSEILLE TDP", city: "Marseille",    country: "France", address: "Terrasses Port – 9 Quai Lazaret, 13002 Marseille", zip: "", lat: 43.3046, lng: 5.3657 },
  { id: 12, name: "PRINTEMPS PARLY",    city: "Le Chesnay",        country: "France", address: "Av. Charles de Gaulle, 78150 Le Chesnay", zip: "", lat: 48.8280, lng: 2.1153 },
  { id: 13, name: "PRINTEMPS ROUEN",    city: "Rouen",             country: "France", address: "4 Rue du Gros Horloge, 76000 Rouen", zip: "", lat: 49.4412, lng: 1.0935 },
  { id: 14, name: "PRINTEMPS TOULON",   city: "La Valette-du-Var", country: "France", address: "CC Grand Var, RN 98, 83160 La Valette-du-Var", zip: "", lat: 43.1390, lng: 5.9890 },
  { id: 15, name: "PRINTEMPS NATION",   city: "Paris",             country: "France", address: "21-25 Cours de Vincennes, 75020 Paris", zip: "", lat: 48.8483, lng: 2.4014 },
  // FRANCE — OTHER
  { id: 16, name: "FARADAY",            city: "Paris",             country: "France", address: "5/7 Rue du Grenier-Saint-Lazare, 75003 Paris", zip: "", lat: 48.8627, lng: 2.3535 },
  { id: 17, name: "BIJOUTERIE MASSON",  city: "Troyes",            country: "France", address: "116 Rue Emile Zola, 10000 Troyes", zip: "", lat: 48.2957, lng: 4.0728 },
  { id: 18, name: "DORISE JOAILLIER",   city: "Toulouse",          country: "France", address: "41 Rue Croix Baragnon, 31000 Toulouse", zip: "", lat: 43.5997, lng: 1.4482 },
  // UAE
  { id: 19, name: "SOLENE JEWELLERS",   city: "Abu Dhabi",         country: "UAE",    address: "Ground Floor H-415, Reem Mall, Al Reem Island, Abu Dhabi", zip: "", lat: 24.4882, lng: 54.4003 },
  // KENYA
  { id: 20, name: "ARVO JEWELLERS",     city: "Nairobi",           country: "Kenya",  address: "Masari Road, Nairobi", zip: "", lat: -1.2582, lng: 36.8187 },
  // SPAIN
  { id: 21, name: "ELITE JEWELLERY",    city: "Altea",             country: "Spain",  address: "Urb. Altea Hills, Heidelberg 390, 03590 Altea, Alicante", zip: "", lat: 38.6038, lng: -0.0451 },
  { id: 22, name: "GENEVE 1989",        city: "Las Palmas",        country: "Spain",  address: "Calle Triana, 114, 35002 Las Palmas de Gran Canaria", zip: "", lat: 28.1064, lng: -15.4159 },
  { id: 23, name: "GENEVE 1989",        city: "Marbella",          country: "Spain",  address: "Avenida Puerto José Banús, Calle Muelle Ribera, Bloque K, 29660 Nueva Andalucía", zip: "", lat: 36.4884, lng: -4.9513 },
  { id: 24, name: "JOYERIA IRANTZU",    city: "San Sebastián",     country: "Spain",  address: "Bergara Kalea, 16, 20005 Donostia / San Sebastián, Gipuzkoa", zip: "", lat: 43.3187, lng: -1.9802 },
  // ANDORRA
  { id: 25, name: "GRAPHEN",            city: "Escaldes-Engordany", country: "Andorra", address: "Avinguda Carlemany 103, AD700 Escaldes-Engordany", zip: "", lat: 42.5086, lng: 1.5362 },
  // VENEZUELA
  { id: 26, name: "CABOCHON JOYAS",     city: "Caracas",           country: "Venezuela", address: "Centro Comercial Altamira Village, Av. Luis Roche, PB 14, Caracas", zip: "", lat: 10.5026, lng: -66.8512 },
  // GERMANY
  { id: 27, name: "CARL HILSCHER GMBH", city: "Munich",            country: "Germany",   address: "Nordendstrasse 50, 80801 Munich", zip: "", lat: 48.1572, lng: 11.5752 },
  // NETHERLANDS
  { id: 28, name: "JUWELIER DE VRIES B.V.", city: "Weesp",         country: "Netherlands", address: "Slijkstraat 48-50, 1381 BA Weesp", zip: "", lat: 52.3084, lng: 5.0406 },
];

// ─── Marker ───────────────────────────────────────────────────────────────────

const MARKER_IMG = "https://laprimagioielli.com/wp-content/uploads/2025/12/4-1.png";

// ─── MapPane ──────────────────────────────────────────────────────────────────

function MapPaneInner({ stores, selectedId, onSelect, flyTarget, onFlyDone }) {
  const mapRef      = useRef(null);
  const instanceRef = useRef(null);
  const markersRef  = useRef({});

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;
    const L   = require("leaflet");
    const map = L.map(mapRef.current, {
      center: [30, 15],
      zoom: 2.5,
      zoomControl: false,
      attributionControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© OpenStreetMap",
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    instanceRef.current = map;
    return () => { map.remove(); instanceRef.current = null; };
  }, []);

  useEffect(() => {
    const map = instanceRef.current;
    if (!map) return;
    const L = require("leaflet");
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};
    stores.forEach((store) => {
      const active = store.id === selectedId;
      const sz     = active ? 72 : 56;
      const icon   = L.icon({
        iconUrl:     MARKER_IMG,
        iconSize:    [sz, sz],
        iconAnchor:  [sz / 2, sz],
        popupAnchor: [0, -sz],
      });
      const marker = L.marker([store.lat, store.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="padding:14px 16px 12px;min-width:180px;font-family:'DM Sans',sans-serif">
            <div style="font-size:12px;font-weight:700;color:#004065;margin-bottom:4px;text-decoration:underline;text-underline-offset:3px;">${store.name}</div>
            <div style="font-size:11px;color:#6a9ab0;margin-bottom:2px">${store.city}</div>
            <div style="font-size:10px;color:#9ab5c5;line-height:1.5">${store.address}</div>
            <div style="font-size:10px;color:#9ab5c5">${store.country}</div>
          </div>`
        )
        .on("click", () => onSelect(store.id));
      markersRef.current[store.id] = marker;
    });
  }, [stores, selectedId, onSelect]);

  useEffect(() => {
    const map = instanceRef.current;
    if (!map || !selectedId) return;
    const store = STORES.find((s) => s.id === selectedId);
    if (store) map.flyTo([store.lat, store.lng], 13, { duration: 1.1 });
  }, [selectedId]);

  useEffect(() => {
    const map = instanceRef.current;
    if (!map || !flyTarget) return;
    map.flyTo([flyTarget.lat, flyTarget.lng], flyTarget.zoom ?? 6, { duration: 1.2 });
    if (onFlyDone) onFlyDone();
  }, [flyTarget]);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
  );
}

const MapPane = dynamic(() => Promise.resolve(MapPaneInner), { ssr: false });

// ─── StoreCard ────────────────────────────────────────────────────────────────

function StoreCard({ store, active, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 6,
        background: active ? "#f0f7fc" : hovered ? "#fdf8fa" : "#fff",
        border: `1px solid ${active ? "#004065" : hovered ? "#f8d0dc" : "#edf2f5"}`,
        boxShadow: active ? "0 1px 12px rgba(0,64,101,0.10)" : "none",
        transform: hovered && !active ? "translateX(2px)" : "none",
        transition: "all 0.18s ease",
        animation: "slideIn 0.3s ease both",
        animationDelay: `${index * 0.025}s`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* NAME — bold + underlined like screenshot */}
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#004065",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            marginBottom: 5,
            lineHeight: 1.3,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: 0.3,
          }}>
            {store.name}
          </div>
          {/* CITY */}
          <div style={{ fontSize: 11.5, color: "#6a9ab0", marginBottom: 2 }}>
            {store.city}
          </div>
          {/* ADDRESS */}
          <div style={{ fontSize: 11, color: "#8aA8b8", lineHeight: 1.55 }}>
            {store.address}
          </div>
          {/* COUNTRY */}
          <div style={{ fontSize: 11, color: "#8aA8b8", marginTop: 1 }}>
            {store.country}
          </div>
        </div>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: active ? "#004065" : "#f0f6fa",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginTop: 2, transition: "background 0.18s",
        }}>
          <svg width="9" height="9" fill="none" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" stroke={active ? "#fff" : "#004065"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── DetailPopup ──────────────────────────────────────────────────────────────

function DetailPopup({ store, onClose }) {
  if (!store) return null;
  const gmapsUrl = `https://www.google.com/maps?q=${store.lat},${store.lng}`;
  return (
    <div style={{
      position: "absolute", top: 16, right: 16, zIndex: 1000,
      background: "#fff",
      border: "1px solid #d0e4ee",
      borderRadius: 16,
      padding: "17px 19px",
      maxWidth: 260, minWidth: 230,
      boxShadow: "0 8px 32px rgba(0,64,101,0.13)",
      animation: "popIn 0.26s cubic-bezier(0.34,1.56,0.64,1) both",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ flex: 1, paddingRight: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#004065", textDecoration: "underline", textUnderlineOffset: "3px", marginBottom: 4, lineHeight: 1.3 }}>
            {store.name}
          </div>
          <div style={{ fontSize: 11, color: "#6a9ab0", marginBottom: 2 }}>{store.city}</div>
          <div style={{ fontSize: 10.5, color: "#9ab5c5", lineHeight: 1.55 }}>{store.address}</div>
          <div style={{ fontSize: 10.5, color: "#9ab5c5" }}>{store.country}</div>
        </div>
        <button onClick={onClose} style={{ background: "#f0f6fa", border: "1px solid #d0e4ee", borderRadius: 8, padding: "4px 8px", cursor: "pointer", color: "#6a9ab0", fontSize: 11, fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}>✕</button>
      </div>
      <a
        href={gmapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: 9, borderRadius: 10, background: "#004065", color: "#fff", fontSize: 11, textDecoration: "none", fontWeight: 500, letterSpacing: 0.5 }}
      >
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
        </svg>
        Directions
      </a>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StoreLocator() {
  const [selectedId,  setSelectedId]  = useState(null);
  const [search,      setSearch]      = useState("");
  const [focused,     setFocused]     = useState(false);
  const [flyTarget,   setFlyTarget]   = useState(null);
  const [searching,   setSearching]   = useState(false);

  // Filter sidebar list by search text (name / city / country)
  const filtered = useMemo(() => {
    if (!search) return STORES;
    const q = search.toLowerCase();
    return STORES.filter((s) =>
      [s.name, s.city, s.country, s.address].some((v) => v.toLowerCase().includes(q))
    );
  }, [search]);

  const selectedStore = STORES.find((s) => s.id === selectedId) ?? null;
  const handleSelect  = (id) => setSelectedId((prev) => (prev === id ? null : id));

  const handleSearch = async () => {
    const q = search.trim().toLowerCase();
    if (!q) return;

    // --- exact store name match → fly there and select it
    const exactStore = STORES.find((s) => s.name.toLowerCase() === q);
    if (exactStore) { setSelectedId(exactStore.id); return; }

    // --- country match → gather all stores for that country, fit bounds
    const countryStores = STORES.filter((s) => s.country.toLowerCase().includes(q));
    if (countryStores.length > 0) {
      // Compute centroid
      const avgLat = countryStores.reduce((s, st) => s + st.lat, 0) / countryStores.length;
      const avgLng = countryStores.reduce((s, st) => s + st.lng, 0) / countryStores.length;
      setFlyTarget({ lat: avgLat, lng: avgLng, zoom: countryStores.length > 3 ? 6 : 8 });
      return;
    }

    // --- city match → same
    const cityStores = STORES.filter((s) => s.city.toLowerCase().includes(q));
    if (cityStores.length > 0) {
      const avgLat = cityStores.reduce((s, st) => s + st.lat, 0) / cityStores.length;
      const avgLng = cityStores.reduce((s, st) => s + st.lng, 0) / cityStores.length;
      setFlyTarget({ lat: avgLat, lng: avgLng, zoom: 12 });
      return;
    }

    // --- partial store name match
    const nameMatch = STORES.find((s) => s.name.toLowerCase().includes(q));
    if (nameMatch) { setSelectedId(nameMatch.id); return; }

    // --- fallback: geocode via Nominatim
    setSearching(true);
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const placeType = data[0].type;
        const zoomMap   = { country: 5, state: 6, county: 8, city: 10, town: 11, suburb: 13 };
        setFlyTarget({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), zoom: zoomMap[placeType] ?? 8 });
      }
    } catch (e) { /* silent */ }
    finally { setSearching(false); }
  };

  return (
    <>
   

      <div style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        marginTop: 64,
        marginBottom: 48,
        background: "#fff",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        color: "#004065",
        borderTop: "1px solid #edf2f5",
        borderRadius: "0 0 12px 12px",
      }}>

        {/* ── Sidebar ── */}
        <div style={{ width: 360, flexShrink: 0, display: "flex", flexDirection: "column", background: "#fff", borderRight: "1px solid #edf2f5" }}>

          <div style={{ padding: "28px 24px 0" }}>
          
            <h1 className={'font-barlow'} style={{  fontSize: 26, fontWeight: 400, lineHeight: 1.2, marginBottom: 20, color: "#ec9cb2" }}>
               Our Points of Sale
            </h1>

            {/* Search */}
            <div style={{
              display: "flex",
              marginBottom: 18,
              border: `1.5px solid ${focused ? "#ec9cb2" : "#d0e4ee"}`,
              borderRadius: 10,
              overflow: "hidden",
              background: "#fff",
              transition: "border 0.2s",
            }}>
              <div style={{ position: "relative", flex: 1 }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="7" stroke="#b0c8d4" strokeWidth="2" />
                  <path d="m16.5 16.5 3.5 3.5" stroke="#b0c8d4" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Country, city or store name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={()  => setFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  style={{ width: "100%", padding: "11px 12px 11px 34px", border: "none", background: "transparent", color: "#004065", fontSize: 12, fontFamily: "'DM Sans',sans-serif", outline: "none" }}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searching}
                style={{ padding: "0 18px", background: "#ec9cb2", border: "none", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.3, flexShrink: 0, opacity: searching ? 0.7 : 1, transition: "opacity 0.2s" }}
              >
                {searching ? "…" : "Search"}
              </button>
            </div>
          </div>

          {/* Store list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 20px" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "44px 0", color: "#c8dce8", fontSize: 13 }}>No stores found</div>
            ) : (
              filtered.map((store, i) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  active={selectedId === store.id}
                  onClick={() => handleSelect(store.id)}
                  index={i}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Map ── */}
        <div style={{ flex: 1, position: "relative" }}>
          <MapPane
            stores={filtered}
            selectedId={selectedId}
            onSelect={handleSelect}
            flyTarget={flyTarget}
            onFlyDone={() => setFlyTarget(null)}
          />
          <DetailPopup store={selectedStore} onClose={() => setSelectedId(null)} />
          <div style={{ position: "absolute", bottom: 16, left: 16, zIndex: 1000, background: "rgba(255,255,255,0.9)", border: "1px solid #d0e4ee", borderRadius: 8, padding: "5px 11px", fontSize: 10, color: "#9ab5c5", letterSpacing: 1, textTransform: "uppercase", pointerEvents: "none" }}>
            Click a pin or card to explore
          </div>
        </div>
      </div>
    </>
  );
}