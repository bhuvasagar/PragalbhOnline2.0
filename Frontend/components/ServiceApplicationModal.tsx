import React, { useState } from "react";
import ReactDOM from "react-dom";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Service } from "../types";
import { useLanguage } from "../context/LanguageContext";
import api from "../lib/client";
// import { WHATSAPP_NUMBER } from "../constants";

interface ServiceApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
}

const ServiceApplicationModal: React.FC<ServiceApplicationModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const { t, language } = useLanguage();
  const WHATSAPP_NUMBER = import.meta.env.VITE_W_NUMBER;
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Application for Service:", service);
    setStatus("loading");
    setErrorMessage("");

    try {
      const formDataToSend = {
        customerName: formData.customerName,
        phone: formData.phone,
        message: formData.message,
        serviceId: service.id || (service as any)._id,
        serviceName: service.title.EN,
      };

      const response = await api.post("/applications", formDataToSend);
      setStatus("success");
      // Reset form after success
      setTimeout(() => {
        setStatus("idle");
        setFormData({ customerName: "", phone: "", message: "" });
        onClose();

        // Redirect to WhatsApp with Document List and file links
        const serviceTitleFormatted =
          service.title[language] || service.title.EN;
        const documentsList =
          service.documents?.[language] || service.documents?.["EN"];

        let whatsappMessage = `Hello ${formData.customerName},\n\nHere is your *${serviceTitleFormatted}* Document list.`;

        if (documentsList && documentsList.length > 0) {
          whatsappMessage += `\n\n*Required Documents:*\n`;
          documentsList.forEach((doc: string, index: number) => {
            whatsappMessage += `${index + 1}. ${doc}\n`;
          });
        }

        whatsappMessage += `\n\nRegards,\nPragalbh Services`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(
          "+",
          ""
        )}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");
      }, 2000);
    } catch (error: any) {
      console.error("Application submission error:", error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const serviceTitle = service.title[language] || service.title["EN"];

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 relative z-[10000]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white truncate pr-4">
            {t("nav.apply")}:{" "}
            <span className="text-primary-600 dark:text-primary-400">
              {serviceTitle}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle
                  className="text-green-600 dark:text-green-400"
                  size={32}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Application Received!
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We have received your request for{" "}
                <strong>{serviceTitle}</strong>. We will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t("form.name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t("form.phone")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  t("form.submit")
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ServiceApplicationModal;
