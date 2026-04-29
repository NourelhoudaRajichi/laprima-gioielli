"use client";

import Container from "@/components/container";
import { useState } from "react";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";

export default function Contact() {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // null | "success" | "error"

  const handleChange = (e) => setFields(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) { setStatus("success"); setFields({ name: "", email: "", message: "" }); }
      else setStatus("error");
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <Container>
      {/* Page title */}
      <h1 className="mt-16 mb-10 text-center font-barlow text-3xl font-semibold text-[#004065] lg:text-4xl">
        Contact Us
      </h1>
     
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-32">
        {/* LEFT COLUMN */}
        <div className="max-w-xl">
          <h2 className="text-4xl font-semibold font-barlow text-[#004065]">
            Get in touch
          </h2>

          <p className="mt-6 font-semibold text-[#004065]">
            Can We Help?
          </p>

          <p className="mt-6 text-[0.8rem] leading-relaxed text-[#004065]">
            Our team was handpicked for their understanding of materials,
            process and passion for jewels. Whether you are browsing our
            site or visiting our store, we are always willing to share our
            deep knowledge and understanding of our makers and their craft.
            <br /><br />
            The most commonly asked questions are covered in{" "}
            <a
              href="/faqs"
              className="font-semibold underline text-[#004065] hover:text-[#001e30]"
            >
              Our FAQs
            </a>
            . If you have any specific questions please do not hesitate to
            contact us by completing this form or calling{" "}
            <a
              href="tel:+3904441791049"
              className="font-semibold text-[#004065] hover:underline"
            >
              +39 0444 1791049
            </a>
            .
          </p>

          {/* Divider */}
          <div className="my-10 h-px w-24 bg-[#004065]/20" />
        </div>

        {/* RIGHT COLUMN – FORM */}
        <form onSubmit={onSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={fields.name}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 px-4 py-3 outline-none focus:border-gray-600"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={fields.email}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 px-4 py-3 outline-none focus:border-gray-600"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            required
            value={fields.message}
            onChange={handleChange}
            className="h-36 w-full rounded-md border-2 border-gray-300 px-4 py-3 outline-none focus:border-gray-600"
          />

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-md bg-[#004065] py-4 font-semibold text-white hover:text-[#004065] hover:bg-[#f8e3e8] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? "Sending…" : "Send Message"}
          </button>

          {status === "success" && (
            <p className="text-center text-sm text-green-600">
              Message sent! We'll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-center text-sm text-red-500">
              Something went wrong. Please try again or email us directly.
            </p>
          )}
        </form>
      </div>
      
      {/* CONTACT INFO CARDS - Bottom Section */}
      <div className="grid gap-6 sm:grid-cols-3 mt-16 mb-16 max-w-5xl mx-auto">
        {/* Address */}
        <div className="rounded-2xl bg-gray-50 p-6">
          <div className="flex items-start gap-3">
            <MapPinIcon className="w-5 h-5 mt-0.5 text-[#004065] flex-shrink-0" />
            <div className="space-y-1.5 text-[0.85rem] text-[#004065]">
              <p className="uppercase tracking-wide font-semibold text-[#004065] text-[0.7rem]">
                Address
              </p>
              <p>La Prima Gioielli</p>
              <p>Via della Robbia Luca, 42</p>
              <p>36100 Vicenza – ITALY</p>
            </div>
          </div>
        </div>

        {/* Customer Service */}
        <div className="rounded-2xl bg-gray-50 p-6">
          <div className="flex items-start gap-3">
            <PhoneIcon className="w-5 h-5 mt-0.5 text-[#004065] flex-shrink-0" />
            <div className="space-y-1.5 text-[0.85rem] text-[#004065]">
              <p className="uppercase tracking-wide font-semibold text-[#004065] text-[0.7rem]">
                Customer Service
              </p>
              <p>Mon–Fri 9am – 5.30pm (Italy)</p>
              <p>
                <a
                  href="tel:+3904441791049"
                  className="font-medium text-[#004065] hover:underline"
                >
                  +39 0444 1791049
                </a>
              </p>
              <p>
                <a
                  href="mailto:contact@laprimagioielli.it"
                  className="font-medium text-[#004065] hover:underline"
                >
                  contact@laprimagioielli.it
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Press */}
        <div className="rounded-2xl bg-gray-50 p-6">
          <div className="flex items-start gap-3">
            <EnvelopeIcon className="w-5 h-5 mt-0.5 text-[#004065] flex-shrink-0" />
            <div className="space-y-1.5 text-[0.85rem] text-[#004065]">
              <p className="uppercase tracking-wide font-semibold text-[#004065] text-[0.7rem]">
                Press & Marketing
              </p>
              <p>
                <a
                  href="mailto:marketing@laprimagioielli.it"
                  className="font-medium text-[#004065] hover:underline"
                >
                  marketing@laprimagioielli.it
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}