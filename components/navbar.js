"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  X,
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  User,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Heart
} from "lucide-react";
import { useCart } from "./Context.js";
import { useLanguage } from "./LanguageContext.js";
import { getStoredUser, loginUser, logoutUser } from "@/lib/wordpress/api";

const LaprimaMenu = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [agentRef, setAgentRef]     = useState(null);
  const [agentPage, setAgentPage]   = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [menuLevel, setMenuLevel] = useState("main");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { lang, changeLang, t } = useLanguage();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalCount,
    totalPrice = 0,
    wishlistItems,
    removeFromWishlist,
    wishlistCount
  } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Re-read sessionStorage on every route change so agent mode persists
  // across all pages navigated to from /melissa or /vip.
  // sessionStorage is cleared by the popstate handler when user exits via back.
  useEffect(() => {
    const ref  = sessionStorage.getItem("lpg_agent_ref");
    const page = sessionStorage.getItem("lpg_agent_page");
    setAgentRef(ref   || null);
    setAgentPage(page || null);
  }, [pathname]);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setIsLoggedIn(true);
      setUserName(stored.name ?? stored.nicename ?? "");
      setUserEmail(stored.email ?? "");
    }
  }, []);

  // Lock body scroll when overlays are open on mobile
  useEffect(() => {
    const isOpen = isMenuOpen || showCart || showUserMenu;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, showCart, showUserMenu]);

  const menuItems = [
    {
      title: t.nav.jewels,
      items: [
        {
          title: t.nav.jewelsByType,
          links: [
            { name: t.jewels.bangles, link: "/bangles" },
            { name: t.jewels.bracelets, link: "/bracelets" },
            { name: t.jewels.necklaces, link: "/necklaces" },
            { name: t.jewels.earrings, link: "/earrings" },
            { name: t.nav.exploreAll, link: "/jewels/all" }
          ]
        },
        {
          title: t.nav.jewelsByStone,
          links: [
            { name: t.jewels.diamond, link: "/diamond" },
            { name: t.jewels.motherOfPearl, link: "/mother-of-pearl" },
            { name: t.jewels.lapis, link: "/lapis" }
          ]
        },
        {
          title: t.nav.jewelsByColor,
          links: [
            { name: t.jewels.whiteGold, link: "/white-gold" },
            { name: t.jewels.yellowGold, link: "/yellow-gold" },
            { name: t.jewels.roseGold, link: "/rose-gold" }
          ]
        }
      ],
      media: [
        {
          type: "image",
          url: "/img/menu/VRN0009BAFUPE00D_R.jpg",
          title: "Bangles",
          link: "/bangles"
        },
        {
          type: "image",
          url: "/img/menu/bloomy.98.jpg",
          title: "Bracelets",
          link: "/bracelets"
        },
        {
          type: "image",
          url: "/img/menu/VEL0003EAFUPE00D_W.jpg",
          title: "Earrings",
          link: "/earrings"
        },
        {
          type: "image",
          url: "/img/menu/VRN0007CLFUPE00D_R.jpg",
          title: "Necklace",
          link: "/necklace"
        }
      ]
    },
    { title: t.nav.highJewels, link: "/prestige" },
    {
      title: t.nav.collections,
      items: [
        {
          title: t.nav.collections,
          links: [
            { name: t.nav.bloomy, link: "/bloomy" },
            { name: t.nav.velluto, link: "/velluto" },
            { name: t.nav.verona, link: "/verona" }
          ]
        }
      ],
      media: [
        { type: "image", url: "/img/menu/LaPrimaGioielli_SS26_0706_VERONA.jpg", title: t.nav.verona, link: "/verona" },
        { type: "image", url: "/img/menu/LaPrimaGioielli_SS26_0246_VELLUTO.jpg", title: t.nav.velluto, link: "/velluto" },
        { type: "image", url: "/img/menu/LaPrimaGioielli_SS26_1543_VERONA.jpg", title: t.nav.bloomy, link: "/bloomy" }
      ]
    },
    {
      title: t.nav.maison,
      items: [
        {
          title: t.nav.maison,
          links: [
            { name: t.nav.theBrand, link: "/theBrand" },
            { name: t.nav.keyValue, link: "/keyVisual" },
            { name: t.nav.womenAndPink, link: "/womenAndPink" },
            { name: t.nav.stories, link: "/news" }
          ]
        }
      ],
      media: [
        { type: "image", url: "/img/menu/LaPrimaGioielli_SS26_1543_VERONA.jpg", link: "#" }
      ]
    },
    { title: t.nav.boutique, link: "/boutique" },
    { title: t.nav.contact, link: "/contact" }
  ];

  const handleMenuItemClick = idx => {
    if (menuItems[idx].items) {
      setActiveMenuItem(idx);
      setMenuLevel("submenu");
      setShowUserMenu(false);
      setShowLangMenu(false);
      setShowSearch(false);
      setShowCart(false);
    }
  };

  const handleBackClick = () => {
    setMenuLevel("main");
    setActiveMenuItem(null);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setMenuLevel("main");
    setActiveMenuItem(null);
  };

  const isMaisonMenu =
    activeMenuItem !== null &&
    menuItems[activeMenuItem].title === t.nav.maison;

  /* ── Agent-mode minimal navbar ── */
  if (agentRef) {
    const productListHref = agentPage ? `/${agentPage}` : "/melissa";
    return (
      <>
        <nav className="nav-agent-bar" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
          background: "#fff", borderBottom: "1px solid #f0e8ed",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px" }}>

          {/* LEFT: back to main site — new tab, sessionStorage not inherited so regular navbar shows */}
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.12em", color: "#004065",
              textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
              opacity: 0.55, whiteSpace: "nowrap" }}>
            {t.nav.mainSite}
          </a>

          {/* CENTER: logo — opens new tab, keeps agent session alive */}
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <img src="/img/La-Prima-Logo.png" alt="La Prima Gioielli" className="nav-logo" style={{ cursor: "pointer" }} />
            </a>
          </div>

          {/* RIGHT: lang | product list | user */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Language */}
            <button
              onClick={() => changeLang(lang === "fr" ? "en" : lang === "en" ? "it" : "fr")}
              style={{ background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700,
                color: "#004065", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 3 }}>
              {lang.toUpperCase()} <ChevronDown size={12} />
            </button>

            {/* Product list */}
            <Link href={productListHref}
              style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.1em", color: "#004065",
                textDecoration: "none", whiteSpace: "nowrap" }}>
              {t.nav.productList}
            </Link>

            {/* User */}
            <div className="relative">
              <button onClick={() => setShowUserMenu(prev => !prev)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
                  display: "flex", alignItems: "center", color: "#004065", position: "relative" }}>
                <User size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ec9cb2] text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/20 sm:hidden"
                    onClick={() => setShowUserMenu(false)} />
                  <div className="
                    fixed bottom-0 left-0 right-0 z-[9999] rounded-t-2xl bg-white font-barlow
                    text-[#004065] shadow-2xl sm:absolute sm:bottom-auto sm:left-auto sm:right-0
                    sm:top-full sm:mt-2 nav-user-panel sm:rounded-md sm:shadow-lg sm:ring-1
                    sm:ring-black sm:ring-opacity-5
                  ">
                    <div className="flex justify-center pb-1 pt-3 sm:hidden">
                      <div className="h-1 w-10 rounded-full bg-gray-200" />
                    </div>
                    <div className="flex max-h-[85vh] flex-col overflow-y-auto sm:max-h-none sm:flex-row sm:overflow-visible">
                      {/* Wishlist Panel */}
                      <div className="w-full border-b border-gray-200 p-5 sm:w-1/2 sm:border-b-0 sm:border-r sm:p-6">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                          <Heart size={14} className="text-[#ec9cb2]" />
                          Wishlist
                          <span className="text-xs font-normal text-gray-400">{wishlistCount}</span>
                        </h3>
                        {wishlistItems.length === 0 ? (
                          <p className="text-sm text-gray-400">{t.account.wishlistEmpty}</p>
                        ) : (
                          <ul className="max-h-52 space-y-4 overflow-y-auto pr-1 sm:max-h-72">
                            {wishlistItems.map(item => (
                              <li key={`${item.id}-${item.variationName}`} className="flex items-center gap-3">
                                <div className="h-14 w-14 flex-shrink-0 overflow-hidden bg-gray-50">
                                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-semibold uppercase tracking-wide text-[#004065]">{item.name}</p>
                                  <p className="text-xs text-gray-400">{item.variationName}</p>
                                  <p className="mt-0.5 text-xs text-[#004065]">€ {item.price}</p>
                                </div>
                                <button onClick={() => removeFromWishlist(item.id, item.variationName)}
                                  className="flex-shrink-0 touch-manipulation text-gray-300 transition-colors hover:text-[#ec9cb2]">
                                  <X size={14} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Account Panel */}
                      <div className="w-full p-5 sm:w-1/2 sm:p-6">
                        <div className="mb-4 flex items-center gap-2 sm:hidden">
                          <span className="text-xs uppercase tracking-wide text-gray-400">{t.nav.language}:</span>
                          {["EN","FR","IT","AR"].map(code => (
                            <button key={code} onClick={() => changeLang(code)}
                              className={`rounded border px-2 py-1 text-xs text-[#004065] transition-colors hover:border-[#ec9cb2] ${lang === code ? "border-[#ec9cb2] font-semibold" : "border-gray-200"}`}>
                              {code}
                            </button>
                          ))}
                        </div>
                        {isLoggedIn ? (
                          <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-3 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#ec9cb2] flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-white" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-sm font-medium text-[#004065] truncate">{userName}</p>
                                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <a href="/profile" onClick={() => setShowUserMenu(false)} className="block py-1 text-sm transition-colors hover:text-[#ec9cb2]">{t.account.myAccount}</a>
                              <a href="/profile" onClick={() => setShowUserMenu(false)} className="block py-1 text-sm transition-colors hover:text-[#ec9cb2]">{t.account.orders}</a>
                              <a href="/profile" onClick={() => setShowUserMenu(false)} className="block py-1 text-sm transition-colors hover:text-[#ec9cb2]">{t.account.settings}</a>
                            </div>
                            <button onClick={() => { logoutUser(); setIsLoggedIn(false); setUserName(""); setUserEmail(""); setShowUserMenu(false); }}
                              className="mt-4 w-full rounded bg-[#ec9cb2] py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-[#f8e3e8] hover:text-[#004065]">
                              {t.account.logOut}
                            </button>
                          </div>
                        ) : (
                          <>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
                              {isSignUpMode ? t.account.createAccount : t.account.signIn}
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <label className="mb-1 block text-xs text-gray-600">
                                  Username or email address <span className="text-red-500">*</span>
                                </label>
                                <input type="text" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                                  className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm transition focus:border-[#004065] focus:outline-none" />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs text-gray-600">
                                  Password <span className="text-red-500">*</span>
                                </label>
                                <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                                  className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm transition focus:border-[#004065] focus:outline-none" />
                              </div>
                              {loginError && <p className="text-xs text-red-500">{loginError}</p>}
                              <div className="flex items-center">
                                <input type="checkbox" id="agent-remember" className="h-4 w-4 rounded border-gray-300 text-[#004065] focus:ring-[#ec9cb2]" />
                                <label htmlFor="agent-remember" className="ml-2 text-xs text-gray-600">Remember me</label>
                              </div>
                              <button disabled={loginLoading}
                                onClick={async () => {
                                  if (!loginEmail || !loginPassword) return;
                                  setLoginLoading(true); setLoginError("");
                                  try {
                                    const { user } = await loginUser(loginEmail, loginPassword);
                                    setIsLoggedIn(true);
                                    setUserName(user.name ?? user.nicename ?? "");
                                    setUserEmail(user.email ?? "");
                                    setLoginEmail(""); setLoginPassword(""); setShowUserMenu(false);
                                  } catch (err) {
                                    setLoginError(err.message || "Login failed.");
                                  } finally { setLoginLoading(false); }
                                }}
                                className="w-full rounded bg-[#ec9cb2] py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-[#f8e3e8] hover:text-[#004065] disabled:opacity-50">
                                {loginLoading ? t.account.pleaseWait : t.account.signIn}
                              </button>
                              <div className="mt-3 flex justify-between pb-2 text-xs">
                                <button onClick={() => setIsSignUpMode(!isSignUpMode)}
                                  className="text-[#004065] underline transition-colors hover:text-[#ec9cb2]">
                                  {t.account.createAccount}
                                </button>
                                <a href="/forgot-password" className="text-[#004065] underline transition-colors hover:text-[#ec9cb2]">
                                  {t.account.forgotPassword}
                                </a>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      {/* ── Navigation Bar ─────────────────────────────────────────── */}
      {/* On mobile always show white bg so pink icons are visible; on larger screens keep the transparent-until-scroll behaviour */}
      <nav
        className={`fixed left-0 right-0 z-[9999] bg-white shadow-sm transition-all duration-300 sm:shadow-none ${isScrolled ? "sm:bg-white sm:shadow-md" : "sm:bg-transparent"}`}
        style={{ top: 0 }}
        id="main-nav" >
        <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          {/* LEFT: Menu burger */}
          <button
            onClick={() => {
              setIsMenuOpen(true);
              setShowUserMenu(false);
              setShowLangMenu(false);
              setShowSearch(false);
              setShowCart(false);
            }}
            className="touch-manipulation text-[#ec9cb2] transition-colors hover:opacity-70"
            aria-label="Open menu">
            <Menu size={24} />
          </button>

          {/* CENTER: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 transform">
            <a href="/" aria-label="Go to homepage">
              <img
                src="/img/La-Prima-Logo.png"
                alt="logo"
                className="h-5 nav-logo cursor-pointer"
              />
            </a>
          </div>
          {/* RIGHT: Icons */}
          <div className="relative flex items-center gap-3 text-[#ec9cb2] sm:gap-4">
            {/* Language — hidden on small phones, visible sm+ */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setShowLangMenu(prev => !prev);
                  setShowUserMenu(false);
                  setShowSearch(false);
                  setShowCart(false);
                }}
                className="flex touch-manipulation items-center gap-1 font-barlow text-sm font-light hover:opacity-70">
                {lang} <ChevronDown size={14} />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 z-[9999] mt-2 w-28 rounded-md bg-white font-barlow text-[#004065] shadow-lg">
                  {[["EN","English"],["FR","Français"],["IT","Italiano"],["AR","العربية"]].map(([code, label]) => (
                    <button key={code} onClick={() => { changeLang(code); setShowLangMenu(false); }}
                      className={`block w-full px-3 py-2 text-left hover:bg-gray-100 ${lang === code ? "font-semibold text-[#ec9cb2]" : ""}`}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <button
              className="touch-manipulation hover:opacity-70"
              aria-label="Search"
              onClick={() => {
                setShowSearch(prev => !prev);
                setShowUserMenu(false);
                setShowLangMenu(false);
                setShowCart(false);
              }}>
              <Search size={20} />
            </button>

            {/* Cart */}
            <button
              className="relative touch-manipulation hover:opacity-70"
              aria-label="Cart"
              onClick={() => {
                setShowCart(true);
                setShowUserMenu(false);
                setShowLangMenu(false);
                setShowSearch(false);
              }}>
              <ShoppingBag size={20} />
              {totalCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#004065] text-[10px] font-bold text-white">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(prev => !prev);
                  setShowLangMenu(false);
                  setShowSearch(false);
                  setShowCart(false);
                }}
                className="relative touch-manipulation hover:opacity-70"
                aria-label="Account">
                <User size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ec9cb2] text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {showUserMenu && (
                <>
                  {/* Backdrop for mobile */}
                  <div
                    className="fixed inset-0 z-40 bg-black/20 sm:hidden"
                    onClick={() => setShowUserMenu(false)}
                  />

                  {/* 
                    Mobile: fixed bottom sheet (full width, slides up)
                    Tablet+: absolute dropdown (original 620px panel)
                  */}
                  <div
                    className="
                    fixed bottom-0 left-0 right-0 z-[9999] rounded-t-2xl bg-white font-barlow
                    text-[#004065] shadow-2xl sm:absolute sm:bottom-auto sm:left-auto sm:right-0
                    sm:top-full sm:mt-2 nav-user-panel sm:rounded-md sm:shadow-lg sm:ring-1
                    sm:ring-black sm:ring-opacity-5
                  ">
                    {/* Mobile drag handle */}
                    <div className="flex justify-center pb-1 pt-3 sm:hidden">
                      <div className="h-1 w-10 rounded-full bg-gray-200" />
                    </div>

                    <div className="flex max-h-[85vh] flex-col overflow-y-auto sm:max-h-none sm:flex-row sm:overflow-visible">
                      {/* ── Wishlist Panel ── */}
                      <div className="w-full border-b border-gray-200 p-5 sm:w-1/2 sm:border-b-0 sm:border-r sm:p-6">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                          <Heart
                            size={14}
                            className="text-[#ec9cb2]"
                          />
                          Wishlist
                          <span className="text-xs font-normal text-gray-400">
                            {wishlistCount}
                          </span>
                        </h3>

                        {wishlistItems.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            {t.account.wishlistEmpty}
                          </p>
                        ) : (
                          <ul className="max-h-52 space-y-4 overflow-y-auto pr-1 sm:max-h-72">
                            {wishlistItems.map(item => (
                              <li
                                key={`${item.id}-${item.variationName}`}
                                className="flex items-center gap-3">
                                <div className="h-14 w-14 flex-shrink-0 overflow-hidden bg-gray-50">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-semibold uppercase tracking-wide text-[#004065]">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {item.variationName}
                                  </p>
                                  <p className="mt-0.5 text-xs text-[#004065]">
                                    € {item.price}
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    removeFromWishlist(
                                      item.id,
                                      item.variationName
                                    )
                                  }
                                  className="flex-shrink-0 touch-manipulation text-gray-300 transition-colors hover:text-[#ec9cb2]">
                                  <X size={14} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* ── Account Panel ── */}
                      <div className="w-full p-5 sm:w-1/2 sm:p-6">
                        {/* Language selector — only visible on mobile (hidden on sm+ where it's in the navbar) */}
                        <div className="mb-4 flex items-center gap-2 sm:hidden">
                          <span className="text-xs uppercase tracking-wide text-gray-400">
                            {t.nav.language}:
                          </span>
                          {["EN", "FR", "IT", "AR"].map(code => (
                            <button
                              key={code}
                              onClick={() => changeLang(code)}
                              className={`rounded border px-2 py-1 text-xs text-[#004065] transition-colors hover:border-[#ec9cb2] ${lang === code ? "border-[#ec9cb2] font-semibold" : "border-gray-200"}`}>
                              {code}
                            </button>
                          ))}
                        </div>

                        {isLoggedIn ? (
                          <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-3 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#ec9cb2] flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-white" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-sm font-medium text-[#004065] truncate">{userName}</p>
                                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <a
                                href="/profile"
                                onClick={() => setShowUserMenu(false)}
                                className="block py-1 text-sm transition-colors hover:text-[#ec9cb2]">
                                {t.account.myAccount}
                              </a>
                              <a
                                href="/profile"
                                onClick={() => setShowUserMenu(false)}
                                className="block py-1 text-sm transition-colors hover:text-[#ec9cb2]">
                                {t.account.orders}
                              </a>
                              <a
                                href="/profile"
                                onClick={() => setShowUserMenu(false)}
                                className="block py-1 text-sm transition-colors hover:text-[#ec9cb2]">
                                {t.account.settings}
                              </a>
                            </div>
                            <button
                              onClick={() => {
                                logoutUser();
                                setIsLoggedIn(false);
                                setUserName("");
                                setUserEmail("");
                                setShowUserMenu(false);
                              }}
                              className="mt-4 w-full rounded bg-[#ec9cb2] py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-[#f8e3e8] hover:text-[#004065]">
                              {t.account.logOut}
                            </button>
                          </div>
                        ) : (
                          <>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
                              {isSignUpMode
                                ? t.account.createAccount
                                : t.account.signIn}
                            </h3>
                            <div className="space-y-3">
                              {isSignUpMode && (
                                <div>
                                  <label className="mb-1 block text-xs text-gray-600">
                                    Full Name{" "}
                                    <span className="text-red-500">
                                      *
                                    </span>
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm transition focus:border-[#004065] focus:outline-none"
                                  />
                                </div>
                              )}
                              <div>
                                <label className="mb-1 block text-xs text-gray-600">
                                  {isSignUpMode
                                    ? "Email Address"
                                    : "Username or email address"}{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={loginEmail}
                                  onChange={e => setLoginEmail(e.target.value)}
                                  className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm transition focus:border-[#004065] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs text-gray-600">
                                  Password{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="password"
                                  value={loginPassword}
                                  onChange={e => setLoginPassword(e.target.value)}
                                  className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm transition focus:border-[#004065] focus:outline-none"
                                />
                              </div>
                              {loginError && (
                                <p className="text-xs text-red-500">{loginError}</p>
                              )}
                              {isSignUpMode && (
                                <div>
                                  <label className="mb-1 block text-xs text-gray-600">
                                    Confirm Password{" "}
                                    <span className="text-red-500">
                                      *
                                    </span>
                                  </label>
                                  <input
                                    type="password"
                                    className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm transition focus:border-[#004065] focus:outline-none"
                                  />
                                </div>
                              )}
                              {!isSignUpMode && (
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="remember-dropdown"
                                    className="h-4 w-4 rounded border-gray-300 text-[#004065] focus:ring-[#ec9cb2]"
                                  />
                                  <label
                                    htmlFor="remember-dropdown"
                                    className="ml-2 text-xs text-gray-600">
                                    Remember me
                                  </label>
                                </div>
                              )}
                              <button
                                disabled={loginLoading}
                                onClick={async () => {
                                  if (!loginEmail || !loginPassword) return;
                                  setLoginLoading(true);
                                  setLoginError("");
                                  try {
                                    const { user } = await loginUser(loginEmail, loginPassword);
                                    setIsLoggedIn(true);
                                    setUserName(user.name ?? user.nicename ?? "");
                                    setUserEmail(user.email ?? "");
                                    setLoginEmail("");
                                    setLoginPassword("");
                                    setShowUserMenu(false);
                                  } catch (err) {
                                    setLoginError(err.message || "Login failed.");
                                  } finally {
                                    setLoginLoading(false);
                                  }
                                }}
                                className="w-full rounded bg-[#ec9cb2] py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-[#f8e3e8] hover:text-[#004065] disabled:opacity-50">
                                {loginLoading ? t.account.pleaseWait : isSignUpMode ? t.account.createAccount : t.account.signIn}
                              </button>
                              <div className="mt-3 flex justify-between pb-2 text-xs">
                                <button
                                  onClick={() =>
                                    setIsSignUpMode(!isSignUpMode)
                                  }
                                  className="text-[#004065] underline transition-colors hover:text-[#ec9cb2]">
                                  {isSignUpMode
                                    ? t.account.alreadyHaveAccount
                                    : t.account.createAccount}
                                </button>
                                {!isSignUpMode && (
                                  <a
                                    href="/forgot-password"
                                    className="text-[#004065] underline transition-colors hover:text-[#ec9cb2]">
                                    {t.account.forgotPassword}
                                  </a>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Search Bar ─────────────────────────────────────────────── */}
      {showSearch && (
        <div className="fixed left-0 right-0 top-14 z-40 bg-white px-4 py-3 font-barlow text-[#004065] shadow-md transition-all sm:top-16 sm:px-6 sm:py-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t.nav.search}
              autoFocus
              className="w-full border border-gray-300 px-4 py-2.5 pr-10 text-sm text-[#004065] focus:border-[#004065] focus:outline-none sm:text-base"
            />
            <button
              onClick={() => setShowSearch(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ec9cb2]">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Cart Slide-In ───────────────────────────────────────────── */}
      {showCart && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setShowCart(false)}
          />
          {/* Full width on mobile, 384px on sm+ */}
          <div className="fixed right-0 top-0 z-[9999] flex h-full w-full flex-col bg-white shadow-xl sm:w-96 nav-cart-panel">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="font-barlow text-base font-semibold uppercase tracking-wider text-[#004065] sm:text-lg">
                {t.cart.title}
                {totalCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    ({totalCount})
                  </span>
                )}
              </h2>
              <button
                onClick={() => setShowCart(false)}
                className="touch-manipulation text-[#ec9cb2] transition-colors hover:text-[#f8e3e8]">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag size={48} className="text-gray-200" />
                  <p className="font-barlow text-sm uppercase tracking-wider text-gray-400">
                    {t.cart.empty}
                  </p>
                </div>
              ) : (
                <ul className="space-y-5 sm:space-y-6">
                  {cartItems.map(item => (
                    <li
                      key={`${item.id}-${item.variationName}`}
                      className="flex gap-3 sm:gap-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="font-barlow text-xs font-semibold uppercase tracking-wide text-[#004065]">
                            {item.name}
                          </p>
                          <p className="mt-0.5 font-barlow text-xs text-gray-400">
                            {item.variationName}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-gray-200 px-2 py-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.variationName,
                                  item.quantity - 1
                                )
                              }
                              className="touch-manipulation p-0.5 text-[#ec9cb2] transition-colors hover:text-[#f8e3e8]">
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center font-barlow text-xs text-[#004065]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.variationName,
                                  item.quantity + 1
                                )
                              }
                              className="touch-manipulation p-0.5 text-[#ec9cb2] transition-colors hover:text-[#f8e3e8]">
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="font-barlow text-xs text-[#004065]">
                            €{" "}
                            {(
                              parseFloat(
                                (item.price || "0").replace(",", "")
                              ) * item.quantity
                            ).toLocaleString("de-DE", {
                              minimumFractionDigits: 2
                            })}
                          </p>
                          <button
                            onClick={() =>
                              removeFromCart(
                                item.id,
                                item.variationName
                              )
                            }
                            className="touch-manipulation p-1 text-gray-300 transition-colors hover:text-[#ec9cb2]">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="space-y-3 border-t border-gray-100 px-4 py-4 sm:space-y-4 sm:px-6 sm:py-5">
                <div className="flex justify-between font-barlow text-sm text-[#004065]">
                  <span className="uppercase tracking-wider">
                    {t.cart.total}
                  </span>
                  <span className="font-semibold">
                    €{" "}
                    {(totalPrice || 0).toLocaleString("de-DE", {
                      minimumFractionDigits: 2
                    })}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setShowCart(false)}
                  className="block w-full bg-[#ec9cb2] py-3 text-center font-barlow text-sm uppercase tracking-widest text-white transition-colors hover:bg-[#f8e3e8] hover:text-[#004065] sm:py-3">
                  {t.cart.checkout}
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Menu Overlay ────────────────────────────────────────────── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#004065] bg-opacity-50" dir="ltr">
          {/* 
            Mobile:  full width always (no media panel)
            Tablet:  440px for main, expands for submenu
            Desktop: original 440px / 880px behaviour 
          */}
          <div
            className={`
            relative flex h-full w-full bg-white shadow-2xl transition-all duration-500
            ease-in-out nav-menu-panel
            ${menuLevel === "submenu" && !isMaisonMenu ? "nav-submenu-panel" : ""}
          `}>
            {/* ── Left / Main panel ── */}
            <div
              className={`${menuLevel === "submenu" && !isMaisonMenu ? "w-full nav-menu-panel" : "w-full"} flex flex-col`}>
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
                {menuLevel === "submenu" &&
                activeMenuItem !== null ? (
                  <button
                    onClick={handleBackClick}
                    className="flex touch-manipulation items-center font-barlow text-[#004065] transition-colors hover:opacity-70">
                    <ChevronLeft size={20} className="mr-1" />
                    <span className="text-sm font-light">
                      {menuItems[activeMenuItem].title}
                    </span>
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={handleCloseMenu}
                  className="ml-auto touch-manipulation font-barlow text-[#004065] transition-colors hover:opacity-70">
                  <X size={24} />
                </button>
              </div>

              <div className="h-[calc(100vh-73px)] overflow-y-auto">
                {menuLevel === "main" ? (
                  <ul className="py-2">
                    {menuItems.map((item, idx) => (
                      <li
                        key={idx}
                        className="border-b border-gray-100 last:border-b-0">
                        {item.items ? (
                          <button
                            onClick={() => handleMenuItemClick(idx)}
                            className="group flex w-full touch-manipulation items-center justify-between px-4 py-4 text-left font-barlow transition-colors hover:bg-gray-50 sm:px-6 sm:py-5">
                            <span className="text-base font-light text-[#004065]">
                              {item.title}
                            </span>
                            <ChevronRight
                              size={20}
                              className="text-[#004065] opacity-40 transition-opacity group-hover:opacity-70"
                            />
                          </button>
                        ) : (
                          <a
                            href={item.link}
                            className="block px-4 py-4 font-barlow text-base font-light text-[#004065] transition-colors hover:bg-gray-50 sm:px-6 sm:py-5">
                            {item.title}
                          </a>
                        )}
                      </li>
                    ))}

                    {/* Language selector inside menu on mobile */}
                    <li className="mt-2 border-t border-gray-100 sm:hidden">
                      <div className="px-4 py-4">
                        <p className="mb-3 text-xs uppercase tracking-wide text-gray-400">
                          {t.nav.language}
                        </p>
                        <div className="flex gap-2">
                          {[["EN","English"],["FR","Français"],["IT","Italiano"],["AR","العربية"]].map(([code, label]) => (
                            <button
                              key={code}
                              onClick={() => { changeLang(code); handleCloseMenu(); }}
                              className={`rounded border px-3 py-1.5 text-xs text-[#004065] transition-colors hover:border-[#ec9cb2] ${lang === code ? "border-[#ec9cb2] font-semibold" : "border-gray-200"}`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </li>
                  </ul>
                ) : (
                  <div
                    className={`px-4 py-6 sm:px-6 ${isMaisonMenu ? "" : "border-r border-gray-200"}`}>
                    {menuItems[activeMenuItem].items.map(
                      (subSection, idx) => (
                        <div key={idx} className="mb-8 last:mb-0">
                          <h4 className="mb-3 font-barlow text-sm font-medium text-[#004065]">
                            {subSection.title}
                          </h4>
                          <ul className="space-y-2">
                            {subSection.links.map((link, linkIdx) => (
                              <li key={linkIdx}>
                                <a
                                  href={link.link}
                                  className="block py-0.5 font-barlow text-sm font-light text-[#004065] opacity-70 transition-opacity hover:opacity-100">
                                  {link.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}

                    {/* Maison media — always shown */}
                    {isMaisonMenu &&
                      menuItems[activeMenuItem].media?.length > 0 && (
                        <div className="mt-8 border-t border-gray-200 pt-6">
                          <div className="grid grid-cols-1 gap-4">
                            {menuItems[activeMenuItem].media.map(
                              (media, idx) => (
                                <a
                                  key={idx}
                                  href={media.link}
                                  className="group relative block overflow-hidden bg-gray-100">
                                  <div className="aspect-[3/4]">
                                    <Image
                                      src={media.url}
                                      alt={media.title || ""}
                                      width={400}
                                      height={533}
                                      quality={90}
                                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                  </div>
                                  {media.title && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                      <span className="font-barlow text-sm font-light text-white">
                                        {media.title}
                                      </span>
                                    </div>
                                  )}
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Non-Maison: show media grid inline on mobile/tablet (no right panel) */}
                    {!isMaisonMenu &&
                      menuItems[activeMenuItem].media?.length > 0 && (
                        <div className="mt-8 border-t border-gray-200 pt-6 lg:hidden">
                          <div
                            className={`grid gap-4 ${menuItems[activeMenuItem].title === "Collections" ? "grid-cols-2" : "grid-cols-2"}`}>
                            {menuItems[activeMenuItem].media.map(
                              (media, idx) => (
                                <a
                                  key={idx}
                                  href={media.link}
                                  className="group relative block overflow-hidden bg-gray-100">
                                  <div className="aspect-[3/4]">
                                    <Image
                                      src={media.url}
                                      alt={media.title || ""}
                                      width={400}
                                      height={533}
                                      quality={90}
                                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                  </div>
                                  {media.title && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                      <span className="font-barlow text-xs font-light text-white">
                                        {media.title}
                                      </span>
                                    </div>
                                  )}
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right media panel — desktop only (lg+) ── */}
            {menuLevel === "submenu" &&
              !isMaisonMenu &&
              activeMenuItem !== null &&
              menuItems[activeMenuItem].media?.length > 0 && (
                <div className="hidden h-screen items-center justify-center overflow-y-auto bg-gray-50 p-8 lg:flex">
                  {menuItems[activeMenuItem].title ===
                  "Collections" ? (
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-2 gap-6">
                        {menuItems[activeMenuItem].media
                          .slice(0, 2)
                          .map((media, idx) => (
                            <a
                              key={idx}
                              href={media.link}
                              className="group relative block overflow-hidden bg-white shadow-sm">
                              <div className="aspect-[3/4]">
                                <Image
                                  src={media.url}
                                  alt={media.title}
                                  width={400}
                                  height={533}
                                  quality={90}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </div>
                              {media.title && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                  <span className="font-barlow text-sm font-light text-white">
                                    {media.title}
                                  </span>
                                </div>
                              )}
                            </a>
                          ))}
                      </div>
                      {menuItems[activeMenuItem].media[2] && (
                        <a
                          href={
                            menuItems[activeMenuItem].media[2].link
                          }
                          className="group relative block overflow-hidden bg-white shadow-sm">
                          <div className="aspect-[16/9]">
                            <Image
                              src={
                                menuItems[activeMenuItem].media[2].url
                              }
                              alt={
                                menuItems[activeMenuItem].media[2]
                                  .title
                              }
                              width={800}
                              height={450}
                              quality={90}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          {menuItems[activeMenuItem].media[2]
                            .title && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                              <span className="font-barlow text-sm font-light text-white">
                                {
                                  menuItems[activeMenuItem].media[2]
                                    .title
                                }
                              </span>
                            </div>
                          )}
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      {menuItems[activeMenuItem].media.map(
                        (media, idx) => (
                          <a
                            key={idx}
                            href={media.link}
                            className="group relative block overflow-hidden bg-white shadow-sm">
                            <div className="aspect-[3/4]">
                              <Image
                                src={media.url}
                                alt={media.title}
                                width={400}
                                height={533}
                                quality={90}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            {media.title && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                <span className="font-barlow text-sm font-light text-white">
                                  {media.title}
                                </span>
                              </div>
                            )}
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default LaprimaMenu;
