import Script from "next/script";
import './privacyPolicy.css';

export default function PrivacyLink() {
  return (
    <>
      {/* 1. Privacy Policy Link */}
      <div className="mt-20 mb-8">
        <a
          href="https://www.iubenda.com/privacy-policy/87043189"
          className="iubenda-nostyle iubenda-noiframe iubenda-embed iubenda-noiframe iub-body-embed text-sm underline"
          title="Privacy Policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
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

      {/* 3. Iubenda Script */}
      <Script
        src="https://cdn.iubenda.com/iubenda.js"
        strategy="afterInteractive"
      />
    </>
  );
}