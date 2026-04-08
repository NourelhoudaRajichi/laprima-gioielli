"use client";

import Container from "@/components/container";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useWeb3Forms from "@web3forms/react";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";

export default function Contact({ settings }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting }
  } = useForm({ mode: "onTouched" });

  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState(false);

  const apiKey = settings?.w3ckey || "YOUR_ACCESS_KEY_HERE";

  const { submit: onSubmit } = useWeb3Forms({
    access_key: apiKey,
    settings: {
      from_name: "Stablo Template",
      subject: "New Contact Message"
    },
    onSuccess: (msg) => {
      setIsSuccess(true);
      setMessage(msg);
      reset();
    },
    onError: (msg) => {
      setIsSuccess(false);
      setMessage(msg);
    }
  });

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
        <div className="space-y-6">
          <input
            type="checkbox"
            className="hidden"
            {...register("botcheck")}
          />

          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-md border-2 border-gray-300 px-4 py-3 outline-none focus:border-gray-600"
            {...register("name", { required: true })}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-md border-2 border-gray-300 px-4 py-3 outline-none focus:border-gray-600"
            {...register("email", { required: true })}
          />

          <textarea
            placeholder="Your Message"
            className="h-36 w-full rounded-md border-2 border-gray-300 px-4 py-3 outline-none focus:border-gray-600"
            {...register("message", { required: true })}
          />

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="w-full rounded-md bg-[#004065] py-4 font-semibold text-white hover:text-[#004065] hover:bg-[#f8e3e8]"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {isSubmitSuccessful && (
            <p
              className={`text-center text-sm ${
                isSuccess ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
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