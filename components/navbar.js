"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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

const LaprimaMenu = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [menuLevel, setMenuLevel] = useState("main");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Nourelhouda");

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
      title: "Jewels",
      items: [
        {
          title: "Jewels By Type",
          links: [
            { name: "Bangles", link: "/typesPage" },
            { name: "Bracelets", link: "#" },
            { name: "Necklaces", link: "#" },
            { name: "Earrings", link: "#" },
            { name: "Explore all", link: "" }
          ]
        },
        {
          title: "Jewels By Stone",
          links: [
            { name: "Diamond", link: "stonePage" },
            { name: "Mother of Pearl", link: "#" },
            { name: "Lapis", link: "#" }
          ]
        },
        {
          title: "Jewels By Color",
          links: [
            { name: "White", link: "#" },
            { name: "Yellow", link: "#" },
            { name: "Rose", link: "#" }
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
    { title: "High Jewels", link: "/prestige" },
    {
      title: "Collections",
      items: [
        {
          title: "Collections",
          links: [
            { name: "Bloomy", link: "/bloomy" },
            { name: "Velluto", link: "/velluto" },
            { name: "Verona", link: "/verona" }
          ]
        }
      ],
      media: [
        {
          type: "image",
          url: "/img/menu/LaPrimaGioielli_SS26_0706_VERONA.png",
          title: "Verona",
          link: "/verona"
        },
        {
          type: "image",
          url: "/img/menu/LaPrimaGioielli_SS26_0246_VELLUTO.png",
          title: "Velluto",
          link: "/velluto"
        },
        {
          type: "image",
          url: "/img/menu/LaPrimaGioielli_SS26_1543_VERONA.png",
          title: "Bloomy",
          link: "/bloomy"
        }
      ]
    },
    {
      title: "Maison",
      items: [
        {
          title: "Maison",
          links: [
            { name: "The Brand", link: "/theBrand" },
            { name: "Key Value", link: "/keyVisual" },
            { name: "Women and Pink", link: "/womenAndPink" },
            { name: "Stories", link: "/news" }
          ]
        }
      ],
      media: [
        {
          type: "image",
          url: "/img/menu/LaPrimaGioielli_SS26_1543_VERONA.png",
          link: "#"
        }
      ]
    },
    { title: "Boutique", link: "/boutique" },
    { title: "Contact", link: "/contact" }
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
    menuItems[activeMenuItem].title === "Maison";

  return (
    <>
      {/* ── Navigation Bar ─────────────────────────────────────────── */}
      {/* On mobile always show white bg so pink icons are visible; on larger screens keep the transparent-until-scroll behaviour */}
      <nav
        className={`fixed left-0 right-0 top-0 z-[9999] bg-white shadow-sm transition-all duration-300 sm:shadow-none ${isScrolled ? "sm:bg-white sm:shadow-md" : "sm:bg-transparent"}`}>
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
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
                className="h-5 cursor-pointer sm:h-8"
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
                EN <ChevronDown size={14} />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 z-[9999] mt-2 w-24 rounded-md bg-white font-barlow text-[#004065] shadow-lg">
                  <button className="block w-full px-3 py-2 text-left hover:bg-gray-100">
                    English
                  </button>
                  <button className="block w-full px-3 py-2 text-left hover:bg-gray-100">
                    Français
                  </button>
                  <button className="block w-full px-3 py-2 text-left hover:bg-gray-100">
                    Italiano
                  </button>
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
                    sm:top-full sm:mt-2 sm:w-[620px] sm:rounded-md sm:shadow-lg sm:ring-1
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
                            Your Wishlist is currently empty.
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
                            Language:
                          </span>
                          {["EN", "FR", "IT"].map(lang => (
                            <button
                              key={lang}
                              className="rounded border border-gray-200 px-2 py-1 text-xs text-[#004065] transition-colors hover:border-[#ec9cb2]">
                              {lang}
                            </button>
                          ))}
                        </div>

                        {isLoggedIn ? (
                          <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-3">
                              <p className="text-sm font-medium text-[#004065]">
                                Hello!
                              </p>
                              <p className="mt-1 text-xs text-gray-600">
                                {userName}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <a
                                href="/profile"
                                className="block py-1 text-sm transition-colors hover:text-[#ec9cb2]">
                                My Account
                              </a>
                              <a
                                href="/profile"
                                className="block py-1 text-sm transition-colors hover:text-[#ec9cb2]">
                                Orders
                              </a>
                              <a
                                href="/profile"
                                className="block py-1 text-sm transition-colors hover:text-[#ec9cb2]">
                                Settings
                              </a>
                            </div>
                            <button
                              onClick={() => {
                                setIsLoggedIn(false);
                                setShowUserMenu(false);
                              }}
                              className="mt-4 w-full rounded bg-[#ec9cb2] py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-[#f8e3e8] hover:text-[#004065]">
                              Logout
                            </button>
                          </div>
                        ) : (
                          <>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
                              {isSignUpMode
                                ? "Create Account"
                                : "Accedi"}
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
                                  <span className="text-red-500">
                                    *
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm transition focus:border-[#004065] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs text-gray-600">
                                  Password{" "}
                                  <span className="text-red-500">
                                    *
                                  </span>
                                </label>
                                <input
                                  type="password"
                                  className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm transition focus:border-[#004065] focus:outline-none"
                                />
                              </div>
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
                                onClick={() => setIsLoggedIn(true)}
                                className="w-full rounded bg-[#ec9cb2] py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-[#f8e3e8] hover:text-[#004065]">
                                {isSignUpMode ? "Sign Up" : "Sign In"}
                              </button>
                              <div className="mt-3 flex justify-between pb-2 text-xs">
                                <button
                                  onClick={() =>
                                    setIsSignUpMode(!isSignUpMode)
                                  }
                                  className="text-[#004065] underline transition-colors hover:text-[#ec9cb2]">
                                  {isSignUpMode
                                    ? "Already have an account?"
                                    : "Create Account"}
                                </button>
                                {!isSignUpMode && (
                                  <a
                                    href="/forgot-password"
                                    className="text-[#004065] underline transition-colors hover:text-[#ec9cb2]">
                                    Forgot Password
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
              placeholder="Search products..."
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
          <div className="fixed right-0 top-0 z-[9999] flex h-full w-full flex-col bg-white shadow-xl sm:w-96">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="font-barlow text-base font-semibold uppercase tracking-wider text-[#004065] sm:text-lg">
                Your Cart
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
                    Your cart is empty
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
                    Total
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
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Menu Overlay ────────────────────────────────────────────── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#004065] bg-opacity-50">
          {/* 
            Mobile:  full width always (no media panel)
            Tablet:  440px for main, expands for submenu
            Desktop: original 440px / 880px behaviour 
          */}
          <div
            className={`
            relative flex h-full w-full bg-white shadow-2xl transition-all duration-500
            ease-in-out
            sm:w-[440px]
            ${menuLevel === "submenu" && !isMaisonMenu ? "lg:w-[880px]" : ""}
            ${menuLevel === "submenu" && !isMaisonMenu ? "sm:w-[440px] md:w-[440px]" : ""}
          `}>
            {/* ── Left / Main panel ── */}
            <div
              className={`${menuLevel === "submenu" && !isMaisonMenu ? "w-full sm:w-[440px]" : "w-full"} flex flex-col`}>
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
                          Language
                        </p>
                        <div className="flex gap-2">
                          {["English", "Français", "Italiano"].map(
                            lang => (
                              <button
                                key={lang}
                                className="rounded border border-gray-200 px-3 py-1.5 text-xs text-[#004065] transition-colors hover:border-[#ec9cb2]">
                                {lang}
                              </button>
                            )
                          )}
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
