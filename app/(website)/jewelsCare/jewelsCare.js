import React from 'react';

export default function JewelryCare() {
  return (
    <div className="min-h-screen ">
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-96 bg-cover bg-center flex items-center mt-20"
        style={{
          backgroundImage: 'url(https://laprimagioielli.com/wp-content/uploads/2025/09/verona-web3.jpg)',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0  bg-opacity-30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <h1 className="text-6xl md:text-7xl font-serif text-white mb-2">Jewelry</h1>
          <h2 className="text-6xl md:text-7xl font-serif text-white">care</h2>
        </div>
      </div>

      {/* Introduction Section with Image */}
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center px-12 py-20 bg-white">
            <div className="w-full">
              <p className="text-[#004065] text-base leading-relaxed mb-6">
                La Prima Gioielli&apos;s jewelry is entirely handmade by Italian goldsmith masters using 18 karat gold and gemstones chosen for their beauty and rarity. In order to maintain their beauty, La Prima GIoielli recommends following some general conditions of use and care.
              </p>
              <p className="text-[#004065] text-base leading-relaxed mb-6">
                It is preferable not to wear the La Prima Gioielli jewelry during the following activities: washing your hands (the soap residues could blacken them), when doing the housework (detergents, corrosive products, and impacts can damage the gems and the jewelry itself), while playing sports (salted water or chlorine water, sweat and impacts can damage the gems and the jewelry itself).
              </p>
              <p className="text-[#004065] text-base leading-relaxed">
                We recommend avoiding the exposure to intense heat and sudden temperature variations which could permanently damage the gemstones. Avoid wearing the La Prima GIoielli jewelry when applying perfume, lacquers and make up as the chemical composition of these elements could damage the gemstones.
              </p>
            </div>
          </div>
          <div className="h-full">
            <img 
              src="https://laprimagioielli.com/wp-content/uploads/2024/09/jewel_care2.jpg" 
              alt="Rose gold jewelry"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Preservation Section */}
      <div className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-4xl font-serif text-[#004065] mb-8 text-center">Preservation</h3>
          <p className="text-[#004065] text-base leading-relaxed text-center">
            When you are not wearing your jewellery, it is a good idea to store it in special cloths to prevent oxidation. Preserve La Prima Gioielli jewelry by placing them individually in the original casing or in a suitable protected container (otherwise they could get scratched when in contact with another piece) and protected from humidity and sources of heat. We always advise that you close the clasp mechanism of the bracelets and necklaces in order to avoid knots.
          </p>
        </div>
      </div>

      {/* Cleaning Section with Image */}
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="h-full">
            <img 
              src="https://laprimagioielli.com/wp-content/uploads/2024/05/La-prima_gioielli-ambientati_sito-1.jpg" 
              alt="Gold jewelry"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center px-12 py-20 bg-white">
            <div className="w-full">
              <h3 className="text-4xl font-serif text-[#004065] mb-8">Cleaning</h3>
              <p className="text-[#004065] text-base leading-relaxed mb-6">
                We recommend cleaning the jewels periodically in a professional way. We suggest entrusting the La Prima Gioielli jewels to your trusted jeweller.
              </p>
              <p className="text-[#004065] text-base leading-relaxed">
                If you wish to wash your jewellery yourself, we suggest rinsing it in lukewarm water, using a neutral soap and a soft brush before applying a final rinse. Afterwards, dry using a soft undamaged cloth, by simply dabbing and not rubbing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assistance Section */}
      <div className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-4xl font-serif text-[#004065] mb-8 text-center">Assistance</h3>
          <p className="text-[#004065] text-base leading-relaxed text-center">
            In the event of any doubts or problems, we recommend not wearing the jewelry and having it checked at the store where the purchase was made. Our support services are guaranteed at our flagship boutiques and at every authorised La Prima Gioielli dealer worldwide. Our Customer Service department is also available for any further queries at:{' '}
            <span className="font-semibold">customercare@laprimagioielli.it</span>
          </p>
        </div>
      </div>
    </div>
  );
}