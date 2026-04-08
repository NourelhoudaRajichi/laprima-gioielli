import Script from "next/script";
import './cookies.css'

export default function CookieLink() {
  return (
    <>
      {/* 1. Cookie Policy Link */}
      <div className="mt-4 mb-8">
        <a
          href="https://www.iubenda.com/privacy-policy/87043189/cookie-policy"
          className="iubenda-nostyle iubenda-noiframe iubenda-embed iubenda-noiframe iub-body-embed text-sm underline text-[#004065] hover:text-[#ec9cb2]"
          title="Cookie Policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cookie Policy
        </a>
      </div>

      {/* 2. Iubenda Configuration (must come before script) */}
      <Script id="iub-config" strategy="beforeInteractive">
        {`
          var _iub = _iub || [];
          _iub.csConfiguration = {
            siteId: 87043189,
            cookiePolicyId: 87043189,
            lang: "en"
          };
        `}
      </Script>

      {/* 3. Load Iubenda Script */}
      <Script
        src="https://cdn.iubenda.com/iubenda.js"
        strategy="afterInteractive"
      />
    </>
  );
}