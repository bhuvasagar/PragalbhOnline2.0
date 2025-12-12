import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, FileText, User } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
// import { WHATSAPP_NUMBER } from "../constants";
import api from "../lib/client";
import { useServices } from "../context/ServiceContext";
import { useToast } from "../context/ToastContext";

const Apply: React.FC = () => {
  const { language, t } = useLanguage();
  const { services } = useServices();
  const { showToast } = useToast();
  const WHATSAPP_NUMBER = import.meta.env.VITE_W_NUMBER;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceId: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedService = services.find((s) => s.id === formData.serviceId);
    // Find title by checking available languages or falling back to first available
    const serviceName = selectedService
      ? selectedService.title["EN"] || Object.values(selectedService.title)[0]
      : "General Inquiry";

    try {
      // 1. Save to Backend
      await api.post("/applications", {
        customerName: formData.name,
        phone: formData.phone,
        serviceId: formData.serviceId || "general",
        serviceName: serviceName,
        message: formData.message,
        status: "pending",
      });

      // 2. Redirect to WhatsApp
      const whatsappMessage = `*New Application Request*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Service:* ${serviceName}\n*Message:* ${formData.message}\n\nSent from website application form.`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      // Reset form
      setFormData({ name: "", phone: "", serviceId: "", message: "" });

      window.open(url, "_blank");
      showToast(
        "Application submitted successfully! Redirecting to WhatsApp...",
        "success"
      );
    } catch (error) {
      console.error("Application submission failed", error);
      showToast(
        "Failed to save application to database. Proceeding to WhatsApp...",
        "error"
      );

      // Fallback: Still redirect to WhatsApp even if DB save fails
      const whatsappMessage = `*New Application Request (Offline)*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Service:* ${serviceName}\n*Message:* ${formData.message}\n\nSent from website application form.`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        whatsappMessage
      )}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-gradient-to-br dark:from-primary-900 dark:to-primary-800 min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
              {t("apply.title")}
            </h1>
            <p className="text-slate-600 dark:text-primary-100">
              {t("apply.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white dark:bg-slate-800/50 dark:backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-transparent dark:border-slate-700">
            {/* Left Side - Info */}
            <div className="lg:col-span-2 bg-primary-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-600 rounded-full translate-y-1/2 -translate-x-1/2 opacity-30"></div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6">Simple Steps</h3>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Fill the Form</h4>
                      <p className="text-primary-200 text-sm">
                        Provide your basic details and select service.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">WhatsApp Redirect</h4>
                      <p className="text-primary-200 text-sm">
                        You'll be taken to WhatsApp to chat with us.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Send Documents</h4>
                      <p className="text-primary-200 text-sm">
                        Send photos of required docs and relax!
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="relative z-10 mt-12">
                <p className="text-sm text-primary-300">Need immediate help?</p>
                <p className="font-bold text-lg">+91 9898329056</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 block"
                  >
                    {t("form.name")}
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 block"
                  >
                    {t("form.phone")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="serviceId"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 block"
                  >
                    {t("form.service")}
                  </label>
                  <div className="relative">
                    <FileText
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <select
                      id="serviceId"
                      name="serviceId"
                      required
                      value={formData.serviceId}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white"
                    >
                      <option value="" disabled>
                        Select a service
                      </option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.title[language] || service.title["EN"]}
                        </option>
                      ))}
                      <option value="other">Other / Not Listed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 block"
                  >
                    {t("form.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400"
                    placeholder="Tell us more about what you need..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-green-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  {t("form.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apply;
