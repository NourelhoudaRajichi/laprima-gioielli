"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question:
        "Are all La Prima jewelry pieces available for purchase online?",
      answer:
        "Our website shows a selection of La Prima collections. Some models, colors or sizes may not be available online.If you are looking for a specific piece, please contact us on our email adress contact@laprimagioielli.it or call us at +39 0444 1791049"
    },
    {
      question: "How can I track my La Prima order?",
     answer: (
        <>
          <p className="mb-4">If you want to know the order status and where it is located, you need to log in to your account and click on &quot;Orders&quot;.</p>
          <p className="mb-2">Orders can have different statuses:</p>
          <ul className="list-none space-y-2 ml-0">
            <li>• <strong>On hold:</strong> We have just received your order and are waiting to receive your payment.</li>
            <li>• <strong>Processing:</strong> We have received your payment and are preparing your order.</li>
            <li>• <strong>Completed:</strong> The order has been confirmed and is ready to be shipped, and you should have received an email with the tracking number to follow your order.</li>
          </ul>
        </>
      )

    },
    {
      question: "How do I place an order on the La Prima website?",
      answer:
        "Select the jewelry you want and add it to your cart. click on “add to cart button ” Then proceed to checkout and confirm your details and payment. After completing the order, you can log in to your account and click on the user icon in the menu on the right side go to “Orders” to see your oder details."
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "Credit Card: you can pay safely with the American Express, Visa, Mastercard and Stripe thanks to the Verified by Visa and Mastercard SecureCode standards."
    },
    {
      question: "How does shipping work?",
      answer:
        "We ship with trusted couriers. Delivery times and options are shown at checkout. Once the order is shipped, the tracking number will appear in your account in the “order” section ."
    },
    {
      question: "How much does shipping cost?",
      answer:
        "For our valued clients, shipping is offered by us."
    },
    {
      question: "How can I return or exchange a La Prima product?",
      answer:
        "You may request a return or exchange within 14 days from the delivery date. The jewelry must be in perfect condition, without signs of wear. Just contact us on our email adress contact@laprimagioielli.it or call us at +39 0444 1791049, and we will provide the instructions."
    },
    {
      question: "Why should I create a La Prima account?",
      answer:
        "Creating an account is mandatory because it allows us to have your shipping address saved in our system to be able to send the purchased products. It also gives you access to your orders, tracking, and personal details. and  makes future purchases faster and easier."
    },
     {
      question: "How can I contact La Prima customer service?",
      answer:
        "You can contact us on our email adress contact@laprimagioielli.it or call us at +39 0444 1791049 at any time for assistance with your order or any question. Our team will reply and guide you with the information you need."
    },{
      question: "Is La Prima 18K white gold nickel-free?",
      answer:
        " Our 18K white gold contains a small amount of nickel, as required for strength and color. However, all our alloys fully respect European regulations on nickel release."
    },{
      question: "Is La Prima 18K white gold rhodium plated?",
      answer:
        "Yes, our 18K white gold is rhodium plated to ensure a bright and long-lasting white finish. "
      },
        {
      question: "Are La Prima diamonds natural or lab-grown?",
      answer:
        "All La Prima diamonds are natural. We do not use synthetic diamonds or lab-grown diamonds in any of our jewelry. "
      }, {
      question: "Is La Prima 18K yellow or rose gold plated?",
      answer:
        " No. Our 18K yellow and 18K rose gold have a natural color and are not plated. We do not apply any galvanic coating on these alloys. "
      },{
      question: "Can La Prima prices change?",
      answer:
        "Yes, our prices may be updated over time based on materials and production costs. "
      },{
      question: "Do La Prima jewelry pieces come with a warranty or a certificate of authenticity?",
      answer:
        "Yes. Every La Prima piece is delivered with its Certificate of Authenticity, which also includes the warranty for that specific piece. "
      },
  ];

  const toggleFAQ = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
     
        <div className="relative h-[450px] w-full overflow-hidden md:h-[600px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://laprimagioielli.com/wp-content/uploads/2025/12/LaPrimaGioielli_SS26_0613_VERONA-e1764666859172.jpg')"
            }}></div>
        </div>
      

      {/* FAQ Content */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-4 text-center text-4xl font-barlow font-light text-[#ec9cb2] md:text-5xl">
          DO YOU HAVE ANY QUESTIONS?
        </h1>

        <p className="mb-2 text-center text-[#004065]">
          You can find the most frequently asked questions in the
          sections below.
        </p>
        <p className="mb-8 text-center text-[#004065]">
          There could be the information or the answers you are
          looking for.
        </p>

        <div className="mb-12 text-center text-[#004065]">
          <p>
            If you can&apos;t find the answer in those pages or have
            further questions
          </p>
          <p>
            you can write to our email address{" "}
            <a
              href="mailto:contact@laprimagioielli.it"
              className="text-[#004065] hover:underline">
              contact@laprimagioielli.it
            </a>{" "}
            or call us at +39 0444 1791049
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between py-6 text-left transition-colors hover:bg-gray-50">
                <span className="pr-4 text-lg font-barlow font-medium text-[#004065]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-[#004065] transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 transform" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                }`}>
                <div className="pl-0 leading-relaxed text-[#004065]">
  {faq.answer}
</div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
