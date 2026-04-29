"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";

function FooterSection({ title, children }) {
  return (
    <div className="py-4 lg:py-0">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#004065]">{title}</p>
      <nav>{children}</nav>
    </div>
  );
}

const SocialIcons = () => (
  <div className="mt-5 flex space-x-5 text-[#004065]">
    <a className="hover:opacity-75 transition-opacity" href="https://www.facebook.com/laprimagioielli?locale=fr_FR" target="_blank" rel="noreferrer">
      <span className="sr-only">Facebook</span>
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.86h2.78l-.44 2.9h-2.34v7.03C18.34 21.2 22 17.07 22 12.07z" />
      </svg>
    </a>
    <a className="hover:opacity-75 transition-opacity" href="https://www.instagram.com/la_prima_gioielli/" target="_blank" rel="noreferrer">
      <span className="sr-only">Instagram</span>
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.505 4.505 0 0 0 12 7.5zm0 7.4A2.9 2.9 0 1 1 14.9 12 2.904 2.904 0 0 1 12 14.9zm4.75-8.9a1.05 1.05 0 1 1-1.05 1.05 1.05 1.05 0 0 1 1.05-1.05z" />
      </svg>
    </a>
    <a className="hover:opacity-75 transition-opacity" href="https://www.linkedin.com/company/la-prima-gioielli/posts/?feedView=all" target="_blank" rel="noreferrer">
      <span className="sr-only">LinkedIn</span>
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.562 2.841-1.562 3.036 0 3.597 2 3.597 4.597v5.598z" />
      </svg>
    </a>
  </div>
);

function AgentFooter({ t }) {
  return (
    <footer className="font-barlow">
      <div className="bg-[#f8e3e8]">
        <div className="rc-container px-6 py-14 lg:px-8 lg:py-20">

          {/* Logo centered */}
          <div className="flex justify-center mb-10">
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/img/La-Prima-Logo.png"
                alt="La Prima Gioielli"
                width={200}
                height={60}
                priority
                className="h-auto w-36 sm:w-44"
              />
            </Link>
          </div>

          {/* Divider */}
          <div className="mx-auto mb-10 h-px w-24 bg-[#ec9cb2]" />

          {/* 3-column grid */}
          <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:text-left">

            {/* Col 1 — Contact */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#004065]">
                {t.footer.contactUs}
              </p>
              <div className="space-y-2 text-sm text-[#004065] leading-relaxed">
                <p>Via della Robbia Luca, 42</p>
                <p>36100 Vicenza VI – Italy</p>
                <p className="mt-3">
                  <a href="tel:+390444179100" className="hover:opacity-70 transition-opacity">
                    +39 0444 1791049
                  </a>
                </p>
                <p>
                  <a href="mailto:contact@laprimagioielli.it" className="font-semibold hover:opacity-70 transition-opacity">
                    contact@laprimagioielli.it
                  </a>
                </p>
              </div>
            </div>

            {/* Col 2 — Social */}
            <div className="flex flex-col items-center sm:items-start">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#004065]">
                {t.footer.followUs}
              </p>
              <SocialIcons />
            </div>

            {/* Col 3 — Legal */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#004065]">
                {t.footer.help}
              </p>
              <nav className="flex flex-col space-y-2 text-sm text-[#004065]">
                <a className="hover:opacity-70 transition-opacity" href="/privacyPolicy">{t.footer.privacyPolicy}</a>
                <a className="hover:opacity-70 transition-opacity" href="/cookies">{t.footer.cookiePolicy}</a>
                <a className="hover:opacity-70 transition-opacity" href="/conditionOfSale">{t.footer.conditionsOfSale}</a>
                <a className="hover:opacity-70 transition-opacity" href="/terms">{t.footer.terms}</a>
              </nav>
            </div>

          </div>

          {/* Divider */}
          <div className="mx-auto mt-12 h-px bg-[#ec9cb2]/30" />

          {/* Bottom row */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-[#004065]">
              © <strong>La Prima Gioielli</strong> {new Date().getFullYear()} {t.footer.allRightsReserved}
            </p>
            <div className="flex items-center gap-3">
              <Link href="#"><Image src="/img/icon/visa-pay-logo-1.svg"         alt="Visa"             width={36} height={22} className="h-4 w-auto" /></Link>
              <Link href="#"><Image src="/img/icon/master-card-logo-1.svg"      alt="Mastercard"       width={36} height={22} className="h-4 w-auto" /></Link>
              <Link href="#"><Image src="/img/icon/american-express-logo-1.svg" alt="American Express" width={36} height={22} className="h-4 w-auto" /></Link>
              <Link href="#"><Image src="/img/icon/stripe-logo-1.svg"           alt="Stripe"           width={36} height={22} className="h-4 w-auto" /></Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

function RegularFooter({ t }) {
  return (
    <footer>
      <div className="bg-[#f8e3e8]">
        <div className="rc-container px-4 py-10 font-barlow sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <Link href="/">
                <Image src="/img/La-Prima-Logo.png" alt="La Prima Gioielli" width={180} height={54} priority className="h-auto w-36 sm:w-44 lg:w-48" />
              </Link>
              <p className="mt-4 max-w-xs text-sm text-[#004065] leading-relaxed">
                Via della Robbia Luca, 42 <br />
                36100 Vicenza VI – ITALY <br /><br />
                <a href="mailto:contact@laprimagioielli.it" className="hover:opacity-75"><b>contact@laprimagioielli.it</b></a>
                <br />+39 0444 1791049
              </p>
              <SocialIcons />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4 lg:gap-8">
              <FooterSection title={t.footer.explore}>
                <div className="flex flex-col space-y-2 text-sm text-[#004065]">
                  <a className="hover:opacity-75 transition-opacity" href="/">{t.footer.home}</a>
                  <a className="hover:opacity-75 transition-opacity" href="/jewels">{t.footer.jewels}</a>
                  <a className="hover:opacity-75 transition-opacity" href="/collections">{t.footer.collections}</a>
                  <a className="hover:opacity-75 transition-opacity" href="/theBrand">{t.footer.maison}</a>
                  <a className="hover:opacity-75 transition-opacity" href="#">{t.footer.boutique}</a>
                </div>
              </FooterSection>
              <FooterSection title={t.footer.customerCare}>
                <div className="flex flex-col space-y-2 text-sm text-[#004065]">
                  <a className="hover:opacity-75 transition-opacity" href="/contact">{t.footer.contactUs}</a>
                  <a className="hover:opacity-75 transition-opacity" href="/jewelsCare">{t.footer.jewelCare}</a>
                </div>
              </FooterSection>
              <FooterSection title={t.footer.marketing}>
                <div className="flex flex-col space-y-2 text-sm text-[#004065]">
                  <a className="hover:opacity-75 transition-opacity" href="/privateAreaLogin">{t.footer.privateAreaLogin}</a>
                </div>
              </FooterSection>
              <FooterSection title={t.footer.help}>
                <div className="flex flex-col space-y-2 text-sm text-[#004065]">
                  <a className="hover:opacity-75 transition-opacity" href="/privacyPolicy">{t.footer.privacyPolicy}</a>
                  <a className="hover:opacity-75 transition-opacity" href="/cookies">{t.footer.cookiePolicy}</a>
                  <a className="hover:opacity-75 transition-opacity" href="/conditionOfSale">{t.footer.conditionsOfSale}</a>
                  <a className="hover:opacity-75 transition-opacity" href="/terms">{t.footer.terms}</a>
                  <a className="hover:opacity-75 transition-opacity" href="/faqs">{t.footer.faqs}</a>
                </div>
              </FooterSection>
            </div>
          </div>

          <p className="mt-8 sm:mt-10 lg:mt-12 text-center text-xs text-[#004065]">
            © <b>La Prima Gioielli</b> {new Date().getFullYear()} {t.footer.allRightsReserved}
          </p>
        </div>
      </div>

      <div className="border-t border-[#d1d1d1] bg-[#f8e3e8] font-barlow">
        <div className="rc-container flex flex-col items-center justify-center gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 sm:space-x-3">
            <Link href="#"><Image src="/img/icon/visa-pay-logo-1.svg"          alt="Visa"             width={36} height={22} className="h-5 w-auto sm:h-[18px]" /></Link>
            <Link href="#"><Image src="/img/icon/master-card-logo-1.svg"       alt="Mastercard"       width={36} height={22} className="h-5 w-auto sm:h-[18px]" /></Link>
            <Link href="#"><Image src="/img/icon/american-express-logo-1.svg"  alt="American Express" width={36} height={22} className="h-5 w-auto sm:h-[18px]" /></Link>
            <Link href="#"><Image src="/img/icon/stripe-logo-1.svg"            alt="Stripe"           width={36} height={22} className="h-5 w-auto sm:h-[18px]" /></Link>
          </div>
          <p className="text-center text-xs text-[#004065] sm:text-right">
            {t.footer.securePayments}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const { t }    = useLanguage();
  const [isAgent, setIsAgent] = useState(false);

  useEffect(() => {
    const ref = sessionStorage.getItem("lpg_agent_ref");
    setIsAgent(!!ref);
  }, [pathname]);

  return isAgent ? <AgentFooter t={t} /> : <RegularFooter t={t} />;
}
