"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";

function AgentConditionsOfSale() {
  const { t } = useLanguage();
  return (
    <div className="mt-24 min-h-screen bg-white px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex justify-center">
          <h1 className="relative pb-3 text-center font-barlow text-2xl font-light tracking-widest text-[#004065] md:text-3xl">
            {t.conditionOfSale.title}
            <span className="absolute bottom-0 left-1/2 w-1/2 -translate-x-1/2 transform border-b-2 border-[#004065]"></span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* LEFT */}
          <div className="space-y-8 text-sm leading-relaxed text-[#004065] md:text-base">

            <div style={{ breakInside: "avoid", marginBottom: "1.5rem" }}>
              <h3 className="mb-3 font-semibold">1. General Information</h3>
              <p className="mb-3">
                These Conditions of Sale govern the sale of products (the "Products") through
                the website dedicated to customers located in the United States (the "Site").
              </p>
              <p className="mb-3">The Products are sold by:</p>
              <p className="mb-1"><strong>United Group International Srl</strong></p>
              <p className="mb-1">Via della Robbia Luca 42</p>
              <p className="mb-1">36100 Vicenza – Italy</p>
              <p className="mb-1">VAT No. IT03727500245</p>
              <p className="mb-3">
                Email:{" "}
                <a href="mailto:customercare@laprimagioielli.com" className="underline font-semibold">
                  customercare@laprimagioielli.com
                </a>
              </p>
              <p className="mb-3">
                La Prima Gioielli is a brand owned by United Group International Srl.
              </p>
              <p>
                By placing an order, the customer ("Customer") fully accepts these Conditions of Sale.
              </p>
            </div>

            <div style={{ breakInside: "avoid", marginBottom: "1.5rem" }}>
              <h3 className="mb-3 font-semibold">2. Contract Formation</h3>
              <p className="mb-3">
                The purchase contract is concluded when the Company sends the order confirmation email.
              </p>
              <p>
                Once the order has been confirmed and payment has been successfully processed,
                the order is final and binding.
              </p>
            </div>

            <div style={{ breakInside: "avoid", marginBottom: "1.5rem" }}>
              <h3 className="mb-3 font-semibold">Order Cancellation</h3>
              <p className="mb-3">
                Orders cannot be modified or cancelled once they have been confirmed and paid,
                even if the Product has not yet been shipped.
              </p>
              <p className="mb-3">
                By completing the purchase, the Customer expressly acknowledges and accepts
                that no cancellation right applies prior to shipment.
              </p>
              <p>
                The Company reserves the right to refuse or cancel any order in cases of
                suspected fraud, payment authorization failure, or product unavailability.
              </p>
            </div>

            <div style={{ breakInside: "avoid", marginBottom: "1.5rem" }}>
              <h3 className="mb-3 font-semibold">3. Prices and Taxes</h3>
              <p className="mb-3">All prices are displayed in Euro (EUR).</p>
              <p className="mb-3">
                Customers may select the USD currency option. Once the USD option is selected,
                all prices will be displayed in United States Dollars (USD) for convenience.
                Currency conversion is automatically calculated at the applicable exchange rate
                at the time of display.
              </p>
              <p className="mb-3">For deliveries to the United States:</p>
              <ul className="mb-3 list-disc pl-5 space-y-1">
                <li>Shipping costs are included.</li>
                <li>Import duties, customs clearance fees, and applicable local taxes are included.</li>
                <li>
                  The Company offers a <strong>door-to-door service</strong>, meaning the Customer will not
                  be required to pay additional charges upon delivery.
                </li>
              </ul>
              <p className="mb-3">
                The price applicable to the purchase is the one displayed at checkout at the time
                the order is confirmed.
              </p>
              <p>
                The Company reserves the right to modify prices at any time prior to order confirmation.
              </p>
            </div>

            <div style={{ breakInside: "avoid", marginBottom: "1.5rem" }}>
              <h3 className="mb-3 font-semibold">4. Payment</h3>
              <p className="mb-3">
                Accepted payment methods include major credit cards and other payment
                providers indicated at checkout.
              </p>
              <p className="mb-3">
                The Company reserves the right to verify payment before processing and
                shipping the Products.
              </p>
              <p>
                Failure of payment authorization will result in automatic cancellation of the order.
              </p>
            </div>

            <div style={{ breakInside: "avoid", marginBottom: "1.5rem" }}>
              <h3 className="mb-3 font-semibold">5. Delivery</h3>
              <p className="mb-3">Products are shipped from Italy to the United States via insured courier.</p>
              <p className="mb-3">Delivery times are indicative and not guaranteed.</p>
              <p className="mb-3">
                Risk of loss transfers to the Customer upon delivery to the address provided at checkout.
              </p>
              <p>
                The Customer must inspect the package at delivery and immediately report any visible damage.
              </p>
            </div>

            <div style={{ breakInside: "avoid", marginBottom: "1.5rem" }}>
              <h3 className="mb-3 font-semibold">6. Return &amp; Warranty Policy – US Market</h3>

              <h4 className="mb-2 font-semibold">6.1 Right of Return</h4>
              <p className="mb-3">
                The Customer has <strong>14 days from the date of delivery</strong> (the date the Product is
                received) to request a return.
              </p>
              <p className="mb-3">Return requests must be submitted in writing to:</p>
              <p className="mb-3">
                <a href="mailto:customercare@laprimagioielli.com" className="underline font-semibold">
                  customercare@laprimagioielli.com
                </a>
              </p>
              <p className="mb-5">Returns requested after 14 days from delivery will not be accepted.</p>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-8 text-sm leading-relaxed text-[#004065] md:text-base">

            <div style={{ breakInside: "avoid", marginBottom: "1.5rem" }}>
              <h4 className="mb-2 font-semibold">6.2 Return Shipment</h4>
              <p className="mb-3">
                After the return request has been acknowledged, the Customer has{" "}
                <strong>14 days to ship the Product back</strong>.
              </p>
              <p className="mb-3">
                All return shipping costs, insurance, customs duties, taxes, and any related
                expenses are entirely the responsibility of the Customer.
              </p>
              <p className="mb-3">
                The Customer remains fully responsible for the Product until it is safely received
                by the Company.
              </p>
              <p className="mb-2">Products must be returned:</p>
              <ul className="mb-5 list-disc pl-5 space-y-1">
                <li>unused</li>
                <li>unworn</li>
                <li>undamaged</li>
                <li>in original packaging</li>
                <li>complete with certificates and documentation</li>
              </ul>
              <p className="mb-5">
                The Company reserves the right to refuse returns that do not meet these conditions.
              </p>

              <h4 className="mb-2 font-semibold">6.3 Refund</h4>
              <p className="mb-3">
                Once the returned Product is received and inspected, the Company will issue the
                refund within <strong>14 days</strong>.
              </p>
              <p className="mb-3">Refunds will be processed using the original payment method.</p>
              <p className="mb-5">
                Shipping costs, duties, taxes, insurance, and currency exchange differences are non-refundable.
              </p>

              <h4 className="mb-2 font-semibold">6.4 Warranty for Defects</h4>
              <p className="mb-3">
                Products are covered by a <strong>1-year limited warranty</strong> from the date of delivery
                against manufacturing defects.
              </p>
              <p className="mb-2">This warranty does not cover:</p>
              <ul className="mb-5 list-disc pl-5 space-y-1">
                <li>normal wear and tear</li>
                <li>accidental damage</li>
                <li>improper use</li>
                <li>misuse or negligence</li>
                <li>unauthorized repairs or alterations</li>
              </ul>

              <h4 className="mb-2 font-semibold">6.5 Reporting Defects</h4>
              <p className="mb-3">
                Any defect must be reported within{" "}
                <strong>14 days from the moment the defect is discovered</strong>.
              </p>
              <p className="mb-3">
                The Company may request photographic evidence before authorizing a return.
              </p>
              <p className="mb-2">
                If a manufacturing defect is confirmed, the Company may, at its sole discretion:
              </p>
              <ul className="mb-5 list-disc pl-5 space-y-1">
                <li>repair the Product, or</li>
                <li>replace the Product, or</li>
                <li>issue a refund</li>
              </ul>
              <p className="mb-5">
                This warranty constitutes the sole and exclusive remedy available to the Customer.
              </p>

              <h4 className="mb-2 font-semibold">6.6 Size Exchange</h4>
              <p className="mb-3">
                Size exchange is <strong>not available</strong>.
              </p>
              <p className="mb-5">
                Customers are solely responsible for selecting the correct size before placing an order.
              </p>
            </div>

            <div style={{ breakInside: "avoid", marginBottom: "1.5rem" }}>
              <h3 className="mb-3 font-semibold">7. Intellectual Property</h3>
              <p className="mb-3">
                All trademarks, designs, images, and content on the Site are the exclusive
                property of United Group International Srl.
              </p>
              <p>Unauthorized reproduction, distribution, or use is strictly prohibited.</p>
            </div>

            <div style={{ breakInside: "avoid", marginBottom: "1.5rem" }}>
              <h3 className="mb-3 font-semibold">8. Limitation of Liability</h3>
              <p className="mb-3">
                To the maximum extent permitted by applicable law, the Company shall not be liable for:
              </p>
              <ul className="mb-3 list-disc pl-5 space-y-1">
                <li>indirect or consequential damages</li>
                <li>loss of profits</li>
                <li>delays caused by force majeure events</li>
              </ul>
              <p>
                Product images are illustrative and may vary slightly due to screen display differences.
              </p>
            </div>

            <div style={{ breakInside: "avoid", marginBottom: "1.5rem" }}>
              <h3 className="mb-3 font-semibold">9. Governing Law and Jurisdiction</h3>
              <p className="mb-3">
                These Conditions of Sale are governed by the laws of Italy.
              </p>
              <p>
                Any dispute arising out of or relating to these Conditions shall be submitted to the
                exclusive jurisdiction of the Court of Vicenza (Italy), unless mandatory U.S.
                consumer protection laws require otherwise.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function RegularConditionsOfSale() {
  const { t } = useLanguage();
  return (
    <div className="mt-24 min-h-screen bg-white px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex justify-center">
          <h1 className="relative pb-3 text-center font-barlow text-2xl font-light tracking-widest text-[#004065] md:text-3xl">
            {t.conditionOfSale.title}
            <span className="absolute bottom-0 left-1/2 w-1/2 -translate-x-1/2 transform border-b-2 border-[#004065]"></span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">

          {/* LEFT: sections 1–6.2 (first part) */}
          <div className="space-y-6 text-sm leading-relaxed text-[#004065] md:text-base">
            <div>
              <h3 className="mb-3 font-semibold">1. General Information</h3>
              <p className="mb-3">1.1 In accordance with Article 7 of Legislative Decree no. 70 dated 9 April 2003, the customer (hereinafter referred to as the "Customer") is informed that the goods for sale (hereinafter referred to as the "Products") and the services offered on the website "www.laprimagioielli.com" (hereinafter referred to as the "Site") are marketed and provided by United Group International Srl (hereinafter referred to as "United Group International Srl", also the "Company"), La Prima Gioielli is a brand name of this company, with registered office in Vicenza, Via della Robbia Luca 42, registered with the Vicenza Companies Register, registration number VI-348961 with fully paid-up share capital of Euro 10,000.00 (ten thousand), a single-member company, PEC (certified email address): UNITEDGROUP@PEC.IT. Any communication or request for information in this regard may be provided or made by contacting Customer Service or sent in writing to: United Group International Srl, Via della Robbia Luca 42, 36100 Vicenza – Italy, or by email to the above certified email address PEC or to PRIVACY@LAPRIMAGIOIELLI.IT.</p>
              <p className="mb-3">1.2 These general terms of sale ("General Terms") are governed by the "Consumer Code" (Legislative Decree no. 206/2005 and subsequent amendments and integrations) and the regulations on electronic commerce (Legislative Decree no. 70/2003 and subsequent amendments and integrations), the Civil Code, and Italian Law, and apply exclusively to distance sales via the web of the Products shown on the Site where the "Add to Cart" button is present.</p>
              <p className="mb-3">1.3 In the event of changes to the General Terms, the order (hereinafter "Purchase Order") will be subject to the General Terms published on the Site at the time the Customer sends the order, as specified in Article 13 of these General Terms.</p>
              <p className="mb-3">1.4 The General Terms can be consulted at any time, printed, or stored on a PC.</p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">2. Conclusion of the Contract</h3>
              <p className="mb-3">2.1 The Products and their respective Prices on the Site constitute a public offer in accordance with the methods and terms specified in these General Terms and on the Site itself. These General Terms apply exclusively to purchases of Products made on the Site. The purchase contracts concluded on the Site concerning the Products (hereinafter "Purchase Contracts" or simply "Contracts") are concluded with United Group International Srl, La Prima Gioielli is a brand name of this company.</p>
              <p className="mb-3">2.2 To purchase the Products, you must register on the Site. Registered Customers can place Purchase Orders from the pages of the Site. Each registered Customer guarantees, under their exclusive responsibility, that they are fully authorized to use the credit cards and that such cards have sufficient funds to cover all costs related to purchases of Products made through the Website.</p>
              <p className="mb-3">2.3 Once the Products are viewed, it will be possible to select the item(s) of interest by clicking the "Add to Cart" button. After selecting the Products, a summary page will appear showing the price of the selected Products (including any taxes and shipping and packaging costs), delivery methods, payment methods, and complaint handling procedures by United Group International Srl, La Prima Gioielli is a brand name of this company. You will also be asked to carefully read the General Terms of Sale and print a copy using the print command and save or reproduce a copy for your personal use.</p>
              <p className="mb-3">2.4 By clicking the "CONFIRM ORDER" button, you will be able to purchase the selected Product(s).</p>
              <p className="mb-3">2.5 The Customer completes the Purchase Order correctly if the Site does not show any error messages (the system cannot detect errors related to the data provided by the Customer in the shipping address field).</p>
              <p className="mb-3">2.6 The purchase contract will be considered concluded between United Group International Srl, La Prima Gioielli is a brand name of this company, and the Customer when United Group International Srl receives the Purchase Order.</p>
              <p className="mb-3">2.7 If a Purchase Order is correctly submitted, United Group International Srl, La Prima Gioielli is a brand name of this company, will acknowledge receipt by sending an order confirmation email (hereinafter "Order Confirmation") to the email address provided by the Customer. This Order Confirmation, as specified in Article 13 of Legislative Decree no. 70/2003, will contain a summary of the selected Products, their prices (including shipping costs), payment methods, delivery address, Purchase Order number, the General Terms of Sale, and any specific terms applicable to the individual Purchase Order based on specific requests from the Customer. United Group International Srl reminds the Customer to verify the accuracy of the data in the Order Confirmation with the utmost attention and care and to notify United Group International Srl within 24 (twenty-four) hours of receiving the Order Confirmation of any corrections. The Purchase Order number generated by the system and communicated to the Customer with the Order Confirmation must be used by the Customer in any subsequent communication with United Group International Srl.</p>
              <p className="mb-3">2.8 Occasional unavailability of the Products offered on the Site may occur. If such unavailability becomes definitive, the contract will be terminated, and United Group International Srl, La Prima Gioielli is a brand name of this company, will proceed to refund the paid price without any further or different liability and/or claim arising against it.</p>
              <p className="mb-3">2.9 United Group International Srl, La Prima Gioielli is a brand name of this company, reserves the right to reject Purchase Orders that do not provide sufficient solvency guarantees, are incomplete or incorrect, or come from a Customer with whom a legal dispute is pending regarding a previous Purchase Order, as well as for any other legitimate reason. In all these cases, United Group International Srl will send an email to the Customer specifying the reasons why the Contract was not concluded.</p>
              <p className="mb-3">2.10 In all cases of non-conclusion of the Contract (due to unavailability of the Products or for any other reason), United Group International Srl will refund, without undue delay, the price already paid by the Customer.</p>
              <p className="mb-3">2.11 By transmitting the Purchase Order electronically, the Customer confirms to know and unconditionally accept these General Terms of Sale and the additional information contained on the Site, including the General Terms of Use, the Privacy Policy, and the Legal Notices.</p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">3. Prices and Charges</h3>
              <p className="mb-3">3.1 The prices of the Products offered for sale on the Site, any taxes, and charges, as well as any additional costs for shipping and packaging, are all indicated precisely at the time of the completion of the Purchase Order, before its confirmation and submission.</p>
              <p className="mb-3">3.2 The prices indicated on the Site include VAT.</p>
              <p className="mb-3">3.3 If the Products are to be delivered to a non-EU country, the final price, net of VAT where not due, may be increased by any customs and sales charges quantified, on a case-by-case basis, by the Carrier.</p>
              <p className="mb-3">3.4 United Group International Srl, La Prima Gioielli is a brand name of this company, reserves the right to modify the prices of the Products at any time, but the Products are invoiced based on the prices indicated on the Site at the time each Purchase Order is submitted.</p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">4. Payment of the Price</h3>
              <p className="mb-3">4.1 The accepted payment methods for Products by United Group International Srl, La Prima Gioielli is a brand name of this company, are credit card, Stripe, and Klarna. Accepted credit cards are: Visa, MasterCard, Maestro, American Express. In case of payment by credit card, the transmission of financial information (e.g., credit card number or expiration date) to the banks providing the respective remote electronic payment services takes place using the highest security standards.</p>
              <p className="mb-3">4.2 The Customer's credit card data will be totally unreadable to third parties and will be used by United Group International Srl, La Prima Gioielli is a brand name of this company, only to complete the purchase procedures and to issue any refunds in case of returning the Products following the exercise of the right of withdrawal.</p>
              <p className="mb-3">4.3 In the case of payments made by credit card, the cardholders or account holders with cooperative banks or building societies may be subject to authentication and authorization requests. If the issuing institution of the credit card or the service provider refuses or for any reason does not authorize or validate the payment, United Group International Srl, La Prima Gioielli is a brand name of this company, cannot be held responsible for the delay or non-delivery of the ordered Products.</p>
              <p className="mb-3">4.4 In the case of payments made through Klarna, verify the terms of use and customer service at the following address: https://www.klarna.com/it/servizio-clienti/.</p>
              <p className="mb-3">4.5 In any case, before proceeding with the delivery of the purchased goods, United Group International Srl, La Prima Gioielli is a brand name of this company, reserves the right to verify the actual payment of the price.</p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">5. Delivery of Goods</h3>
              <p className="mb-3">5.1 The Products for which the Purchase Order has been accepted by United Group International Srl, La Prima Gioielli is a brand name of this company, will be delivered to the address indicated by the Customer in the Purchase Order. The delivery of the Products will not be carried out by United Group International Srl before full payment of the price of the Products.</p>
              <p className="mb-3">5.2 It may happen that the purchased item is no longer available in the time necessary to verify the actual crediting of the amount due to United Group International Srl as consideration, as it may have been sold offline in the meantime: in this case, the provisions of Article 2.8 of these Terms and Conditions apply.</p>
              <p className="mb-3">5.3 Orders placed on Saturdays, Sundays, and public holidays will be processed starting from the first working day following. Products will be shipped from Tuesday to Friday during the hours of 10:00–13:00. Separately submitted Purchase Orders will be processed separately. All Products will be shipped via secured value carrier or express courier. Delivery times are indicative and not in any way binding for United Group International Srl. Terms may vary based on the order placed (e.g., depending on the availability of the Product) or for other reasons dependent on the shipping company. In any case, Products will be delivered to the Customer no later than thirty days from the day following the day on which the Customer placed the Purchase Order.</p>
              <p className="mb-3">5.4 Shipping costs are borne by United Group International Srl. The Customer can verify the status of their Purchase Order by contacting United Group International Srl at +39 0444 1791049 from Monday to Friday from 10:00 to 17:00, or by sending an email to CUSTOMERCARE@LAPRIMAGIOIELLI.COM, indicating their name, surname, and the Purchase Order number provided in the Order Confirmation email. Each delivery will be considered complete when the courier makes the Products available to the Customer.</p>
              <p className="mb-3">5.5 United Group International Srl wishes to inform new Customers that it reserves the right, before proceeding with the shipment of Products, to obtain information about the solvency of each new Customer. This verification may cause a delay in processing the first Purchase Order. If, during these checks, the product is sold offline, the provisions of the previous point 5.2 apply.</p>
              <p className="mb-3">5.6 At the time of delivery of the Products, Customers are required to carefully inspect the package before signing the delivery receipt. Since the Products are carefully packed in sealed envelopes, if the package appears to have been tampered with, Customers are required to sign the receipt with a reservation of verification or refuse the delivery. In case the delivery was accepted with an unauthorized signature or if the package shows signs of tampering, Customers are required to immediately report the incident to United Group International Srl by phone at +39 0444 1791049 or by email to CUSTOMERCARE@LAPRIMAGIOIELLI.IT.</p>
              <p className="mb-3">5.7 If for any reason the ordered Products are not successfully delivered to the address provided by the Customer, the courier will contact the Customer the following day to arrange a new delivery date. The Products subject to shipment are insured by United Group International Srl against theft and accidental damage until their delivery to the Customer.</p>
              <p className="mb-3">5.8 In case of questions or need for assistance, please call +39 0444 1791049 from Monday to Friday from 10:00 to 17:00, or send an email to CUSTOMERCARE@LAPRIMAGIOIELLI.IT. United Group International Srl disclaims any liability in case the customer provides incorrect email and residence addresses.</p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">6. Right of Withdrawal</h3>
              <p className="mb-3">6.1 The Customer, as a consumer (i.e., a natural person who purchases Products for purposes unrelated to any entrepreneurial or professional activity carried out according to Article 3 of Legislative Decree 22 July 2005, no. 206, also called "Consumer Code"), has the right to withdraw from the Purchase Contract, for any reason, without the need to specify the reason and without incurring any penalty. The right of withdrawal may be exercised concerning all or only part of the purchased Products and may be exercised no later than fourteen days from the receipt of the Products by the Consumer Customer (see Articles 52 et seq. of the Consumer Code).</p>
            </div>
          </div>

          {/* RIGHT: 6.1 continued, 6.2, 6.3, 6.4, then 7–13 */}
          <div className="space-y-6 text-sm leading-relaxed text-[#004065] md:text-base">
            <div>
              <p className="mb-3">The right of withdrawal must be exercised by the Consumer Customer within the aforementioned period by sending a withdrawal notice to United Group International Srl at the address indicated in Article 1 of these General Terms by registered mail with acknowledgment of receipt. This notice may also be sent within the same period by telegram or email to the addresses and numbers indicated in the aforementioned Article 1. The withdrawal notice must specify the Customer's intention to withdraw from the purchase, as well as the Purchase Order number and the Products for which the Consumer Customer intends to exercise the right of withdrawal. United Group International Srl provides its Consumer Customers with a specific form to be used for the withdrawal notice. Click HERE to download the withdrawal notice form.</p>
              <p className="mb-3">6.2 The Consumer Customer who has exercised the right of withdrawal is required to return the Products to United Group International Srl within no more than fourteen days from the date on which they communicated to United Group International Srl their decision to withdraw from the contract. The only expenses due by the Consumer Customer following the exercise of the right of withdrawal are the return shipping costs of the Products to United Group International Srl.</p>
              <p className="mb-3">United Group International Srl will refund the Consumer Customer the price paid within fourteen days from the date of receipt of the withdrawal notice from the latter, subject to verification of the proper exercise of the right of withdrawal and acceptance of the returned Products in accordance with the provisions in the following paragraph 4.</p>
              <p className="mb-3">6.3 The possibility of withdrawing from the contract is also recognized for products for which collection has been agreed upon at one of the United Group International Srl mono-brand boutiques, according to Article 5. In this case, the period for exercising the aforementioned right of withdrawal begins from the moment the goods are delivered to the Consumer.</p>
              <p className="mb-3">6.4 The Products subject to withdrawal must be returned by the Consumer Customer to United Group International Srl in their original state, with the original packaging and the documentation provided. United Group International Srl will not accept Products without the original packaging or the documentation contained therein or in a state different from the original (e.g., used, worn, damaged, or soiled Products). It is the responsibility of United Group International Srl to verify the conformity of the returned Products to the above requirements as soon as they are returned. The Products must be shipped by the Consumer Customer to the following address: United Group International Srl, 36100 Vicenza, Viale Trieste n.13. The return shipping costs of the Products are borne by the Consumer Customer. Non-accepted Products will be sent back to the sender by United Group International Srl with an additional shipping charge. The refund to the Consumer Customer of the paid price will be made after the actual inspection by United Group International Srl of the condition of the returned Products.</p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">7. Legal Warranty of Conformity and Size Exchange Returns</h3>
              <h4 className="mb-2 font-semibold">7.1 Legal Warranty of Conformity</h4>
              <p className="mb-3"><strong>a) Legal warranty for the "Consumer Customer"</strong> — United Group International Srl will be liable to Consumer Customers for any lack of conformity of the Product purchased, provided that the defect exists at the time of delivery and appears within two years of delivery and that the Consumer Customer was not aware of such defect at the time of concluding the Purchase Contract (see Articles 128 et seq. of Legislative Decree 22 July 2005, no. 206, also called Consumer Code). Consumer Customers are required to report the defect to United Group International Srl within two (2) months of discovering it, by sending the Defect of Conformity Communication form by registered mail with acknowledgment of receipt to the address indicated in Article 1 of these General Terms or by email to CUSTOMERCARE@LAPRIMAGIOIELLI.IT. United Group International Srl reserves the right to request photographic evidence before authorizing any return due to a defect in the Product. The return shipping costs of defective Products will be borne by United Group International Srl, provided that such Products are returned via the same courier used for the original delivery. After reporting the defect of conformity, the Consumer Customer will have the right to request the repair or replacement of the defective Product, free of charge in both cases, unless the requested repair or replacement is objectively impossible or excessively burdensome. If the Consumer Customer chooses to replace the Product, they may choose the same Product or a different Product with a price equal to or higher than that of the defective Product. If the Consumer Customer chooses a Product with a higher price, they must pay the difference. Repairs or replacements will be made within a reasonable period from the presentation of the same request. Returned Products must not show any signs of use and must be placed, intact and complete with everything included in the original packaging, in the appropriate envelope that the courier will provide at the time of package pickup, attaching the correctly completed Defect of Conformity Report Form along with the purchase document. United Group International Srl will not accept returned Products that do not comply with the terms provided here. The delivery costs of the repaired or replaced Products to the Customer will be exclusively borne by United Group International Srl.</p>
              <p className="mb-3"><strong>b) Legal warranty for the "Professional Customer"</strong> — The Professional Customer (i.e., one who acts for professional purposes) has the right to take advantage of the legal warranty provided by Articles 1490 et seq. of the Civil Code. This warranty includes, among other things, that the Professional Customer reports any lack of conformity found in the purchased Product to United Group International Srl within 8 (eight) days of its discovery, under penalty of forfeiture. The warranty in favor of the Professional Customer is valid for a maximum period of 24 (twenty-four) months from the delivery of the Product. Beyond this period, United Group International Srl will not be held liable for any lack of conformity found by the Professional Customer. Defective Products must be returned intact and complete with all the material and documentation originally provided via the courier used for the original delivery, under penalty of shipping costs charged to the Professional Customer.</p>
              <h4 className="mb-2 font-semibold">7.2 Returns for Size Exchange</h4>
              <p className="mb-3">A Product can be exchanged for the same Product in a different size, upon the Customer's request within fifteen (15) days of its receipt, by sending the Size Exchange Request Form by registered mail with acknowledgment of receipt to the address indicated in Article 1 of these General Terms of Sale or by email to CUSTOMERCARE@LAPRIMAGIOIELLI.IT. The Product must be returned to United Group International Srl via the same courier used for the original delivery. Moreover, the Product must be placed, intact and complete with all elements contained in the original packaging, in the appropriate envelope provided by the courier at the time of package pickup, with the correctly completed Size Exchange Request Form attached along with the purchase document. United Group International Srl will not accept returns that do not comply with the terms provided here. In case of unavailability of the requested Product size in stock, the Customer will receive a purchase voucher equal to the price of the returned Product.</p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">8. Personal Data Protection</h3>
              <p className="mb-3">Pursuant to Article 13 of Legislative Decree 30 June 2003, no. 196 (also called the Privacy Code), United Group International Srl informs the Customer that the personal data provided by the Customer for online purchase of Products will be processed in compliance with the aforementioned regulations and mainly using electronic means. The processing will include any operation or set of operations (such as, by way of example and not limited to, collection, registration, organization, storage, adaptation, dissemination, modification, retrieval, selection, use, deletion, or destruction), related to the personal data provided by the Customer when completing and submitting the online Purchase Order of Products. In particular, the aforementioned processing is carried out: 1) to comply with legal obligations (such as accounting and tax obligations); 2) to manage and execute the Purchase Contract; 3) to fulfill the obligations arising from the Purchase Contract, such as, by way of example, the provision of transport and after-sales services.</p>
              <p className="mb-3">The communication of personal data is optional but necessary for the provision of Products. Failure to provide personal data will prevent the execution and fulfillment of the Purchase Contract. To ensure the proper performance of the activities mentioned above, the Customer's personal data will be primarily accessible to the employees of the IT and administrative departments of United Group International Srl, as well as to the staff responsible for after-sales services. Additionally, the data may be made available to suppliers of United Group International Srl who provide services related to the purposes mentioned above, such as companies providing IT services, including hosting services, or companies providing commercial services (such as data entry, transport, and delivery). The Data Controller is: United Group International Srl., Via della Robbia Luca 42, 36100 Vicenza – Italy, registered with the Vicenza Companies Register, REA number VI-348961.</p>
              <p className="mb-3">Pursuant to Article 7 of Legislative Decree no. 196 of 2003, the Customer has the right to be informed of the origin of personal data, the purposes and methods of processing, the identifying details of the Data Controller, data processors, and the subjects or categories of subjects to whom personal data may be communicated. The Customer also has the right to obtain the updating, rectification, or integration of data; the deletion, transformation into anonymous form, or blocking of data processed in violation of the law. Finally, the Customer has the right to object, in whole or in part, for legitimate reasons, to the processing of personal data concerning them, even if pertinent to the purpose of collection.</p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">9. Intellectual Property</h3>
              <p className="mb-3">9.1 All contents on the Site (catalogs, images, and texts) are reserved and the exclusive property of United Group International Srl. The reproduction and dissemination, even partially, in any form, of the photographs, images, and texts are prohibited. Links will only be allowed with the written authorization of the company.</p>
              <p className="mb-3">9.2 All products illustrated on the Site and in the catalogs are works of ingenuity owned by United Group International Srl. All rights to exploit the models are reserved. The trademarks and distinctive signs of United Group International Srl are the exclusive property of the same and are registered in Italy and abroad.</p>
            </div>
            <div>
              <p className="mb-3"><strong>10. Limitation of Liability</strong>The images, photographs, and all representations on the Site have a purely illustrative function. United Group International Srl constantly adopts measures to ensure that the photographs shown on the Site are faithful reproductions of the original Products, also adopting all possible technological solutions to minimize inaccuracies. However, some variations in the visualization of images are always possible due to various causes, including technical, and sometimes due to the technological characteristics of the color resolution of the computer used by each Customer. Consequently, United Group International Srl cannot be held responsible for the possible inadequacy of the graphic representations of the Products shown on the Site due to the aforementioned technical reasons. United Group International Srl cannot also be held responsible for non-fulfillment of the contract in case of a) unavailability of the ordered Product, b) a force majeure event that prevents the delivery of the Product, such as, for example, a weather event, a strike, a fire, a war, etc. Reference is made here to the full version of the "TERMS AND CONDITIONS OF USE OF THE WEBSITE" (which can be found HERE).</p>
            </div>
            <div>
              <p className="mb-3"><strong>11. Applicable Law and Dispute Resolution</strong>These General Terms of Sale, Purchase Orders, and Purchase Contracts are governed by Italian law and, where applicable, by Legislative Decree no. 206 of 6 September 2005 (Consumer Code). For any dispute that may arise concerning a Purchase Order or a Purchase Contract and, in general, for all disputes relating to the interpretation and/or execution of this contract, the exclusive jurisdiction will be that of the place of residence or domicile of the Consumer Customer if located in the territory of the State. Conversely, for any dispute that may arise with Business Customers, the parties agree to recognize the exclusive territorial jurisdiction of the Court of Vicenza. Consumer Customers also have the possibility to promote the extrajudicial resolution of disputes related to an Order or Purchase Contract by resorting to the procedures provided for in part V, title II-bis of the Consumer Code (see Article 66, paragraph 5 of Legislative Decree 206/2005)</p>
            </div>
            <div>
              <p className="mb-3"><strong>12. Access to the Contract and these General Terms</strong>A copy of these General Terms, pursuant to Article 12.3 of Legislative Decree 9 April 2003, no. 70, can be downloaded and saved on the Purchaser's computer here: DOWNLOAD THE GENERAL TERMS. A copy of the orders submitted by the Purchaser and governed by these general terms of the contract is stored in electronic format in the database of the servers managed by United Group International Srl – Online Boutique, based in Bologna, Italy. Upon the Purchaser's request, the documents can be provided in electronic format by sending them to the email address indicated by the Purchaser without additional costs, or in paper form upon payment of the reproduction and shipping costs. From the acceptance of the order, the IT system generates an order confirmation and the general terms of the contract, which is sent to the email address indicated by the Purchaser.</p>
            </div>
            <div>
              <p className="mb-3"><strong>13. Amendments to these General Terms</strong>United Group International Srl reserves the right to modify these General Terms without notice to comply with new laws and regulations or for other reasons. The new General Terms will be effective from their publication on the Site and will apply to Purchase Orders placed after that date..</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ConditionsOfSale() {
  const [isAgent, setIsAgent] = useState(false);

  useEffect(() => {
    setIsAgent(!!sessionStorage.getItem("lpg_agent_ref"));
  }, []);

  return isAgent ? <AgentConditionsOfSale /> : <RegularConditionsOfSale />;
}
