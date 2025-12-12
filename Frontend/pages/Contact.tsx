import React from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
// import { WHATSAPP_NUMBER } from "../constants";

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const WHATSAPP_NUMBER = import.meta.env.VITE_W_NUMBER;

  const handleWhatsapp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:+${WHATSAPP_NUMBER}`;
  };

  return (
    <div className="bg-slate-50 dark:bg-gradient-to-br dark:from-primary-900 dark:to-primary-800 min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
            {t("section.contact")}
          </h1>
          <p className="text-slate-600 dark:text-primary-100 max-w-2xl mx-auto">
            Have questions? We are here to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-md p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Office Address
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                      OFFICE NO.6, OPP. TALUKA SEVA SADAN, KHETI BANK STREET,
                      JUNAGADH ROAD, <br />
                      JETPUR - 360370
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Phone
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                      +91 98983 29056
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Email
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                      pragalbhxerox@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Working Hours
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                      Mon - Sat: 08:30 AM - 7:00 PM
                    </p>
                    <p className="text-slate-600 text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCall}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={18} /> Call Now
              </button>
              <button
                onClick={handleWhatsapp}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                aria-label="Open WhatsApp chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M380.9 97.1C339 55.1 283.7 32 224.1 32 100 32 0 132 0 256c0 45 12.3 88.8 35.7 127.6L0 480l99.1-33.1C140.4 461.8 181.5 480 224.1 480c124.1 0 224.1-100 224.1-224 0-59.6-23.1-114-67.3-154.9zM324.8 312.2c-4.2-2.1-24.8-12.2-28.7-13.6-4-1.4-6.9-2.1-9.8 2.1-2.9 4.2-11 13.6-13.5 16.4-2.5 2.9-5 3.3-9.2 1.1-23.5-11.8-38.9-20.9-54.5-47.9-4.1-7.2 4.1-6.7 11.9-22.3 1.3-2.9.6-5.4-.3-7.3-1-2.1-9.8-23.6-13.4-32.2-3.5-8.5-7.1-7.3-9.8-7.4-2.5-.1-5.4-.1-8.4-.1-3 0-7.8 1.1-11.9 5.4-4.1 4.2-15.6 15.2-15.6 37.2s16 43.2 18.2 46.2c2.1 3 31.4 48 76.3 67.2 53.4 21 53.4 14 63 13.2 3-.2 24.4-9.9 27.9-19.5 3.5-9.6 3.5-17.9 2.5-19.8-.9-1.9-3.8-3.1-8-5.2z" />
                </svg>
                WhatsApp
              </button>
            </div>
          </div>

          <div className="h-full min-h-[400px] bg-slate-200 rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
            <iframe
              src="https://maps.google.com/maps?q=Pragalbh+Services,+Opp.+Taluka+Seva+Sadan,+Kheti+Bank+Street,+Jetpur,+Gujarat+360370&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Pragalbh Services Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
