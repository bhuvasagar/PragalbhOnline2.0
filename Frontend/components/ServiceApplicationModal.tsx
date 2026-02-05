import React, { useState } from "react";
import ReactDOM from "react-dom";
import { X, Loader2, CheckCircle, AlertCircle, Upload, File, Image as ImageIcon, Trash2 } from "lucide-react";
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ name: string; type: string }[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 10MB
  // const MAX_FILES = 5;

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file count
    if (uploadedFiles.length + files.length > MAX_FILES) {
      setErrorMessage(`You can upload a maximum of ${MAX_FILES} files`);
      return;
    }

    let hasError = false;
    const validFiles: File[] = [];
    const previews: { name: string; type: string }[] = [];

    files.forEach((file: File) => {
      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setErrorMessage(`File "${file.name}" is not supported. Please upload PDF or Image files only.`);
        hasError = true;
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(`File "${file.name}" is too large. Maximum size is 10MB.`);
        hasError = true;
        return;
      }

      validFiles.push(file);
      previews.push({
        name: file.name,
        type: file.type,
      });
    });

    if (!hasError) {
      setUploadedFiles([...uploadedFiles, ...validFiles]);
      setFilePreviews([...filePreviews, ...previews]);
      setErrorMessage("");
    }

    // Reset input
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    setFilePreviews(filePreviews.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") {
      return <File size={16} className="text-red-600" />;
    }
    return <ImageIcon size={16} className="text-blue-600" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Application for Service:", service);
    setStatus("loading");
    setErrorMessage("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("customerName", formData.customerName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("serviceId", service.id || (service as any)._id);
      formDataToSend.append("serviceName", service.title.EN);

      // Append uploaded files
      uploadedFiles.forEach((file) => {
        formDataToSend.append("documents", file);
      });

      const response = await api.post("/applications", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus("success");
      // Reset form after success
      setTimeout(() => {
        setStatus("idle");
        setFormData({ customerName: "", phone: "", message: "" });
        setUploadedFiles([]);
        setFilePreviews([]);
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

  const handleSendDocsWhatsApp = () => {
    // Send the required document list to the user's WhatsApp using their phone input
    const phoneInput = formData.phone?.toString().trim();
    if (!phoneInput) {
      setErrorMessage("Please enter your phone number to receive documents on WhatsApp.");
      return;
    }

    // Normalize phone number: remove spaces, dashes and plus signs
    const cleaned = phoneInput.replace(/[^0-9]/g, "");
    if (cleaned.length < 6) {
      setErrorMessage("Please enter a valid phone number including country code.");
      return;
    }

    const serviceTitleFormatted = service.title[language] || service.title.EN;
    const documentsList = service.documents?.[language] || service.documents?.["EN"];

    let whatsappMessage = `Hello ${formData.customerName || ""},\n\nHere is the *${serviceTitleFormatted}* required document list.`;

    if (documentsList && documentsList.length > 0) {
      whatsappMessage += `\n\n*Required Documents:*\n`;
      documentsList.forEach((doc: string, index: number) => {
        whatsappMessage += `${index + 1}. ${doc}\n`;
      });
    }

    whatsappMessage += `\n\nRegards,\nPragalbh Services`;

    const whatsappUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
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

              {/* Document Upload Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Upload Documents
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-slate-50 dark:bg-slate-900/50">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={uploadedFiles.length >= MAX_FILES}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload size={24} className="text-slate-400" />
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                        Click to upload
                      </span>
                      {" or drag and drop"}
                    </div>
                    <div className="text-xs text-slate-500">
                      PDF, JPG, PNG up to 10MB each ({uploadedFiles.length}/{MAX_FILES})
                    </div>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {filePreviews.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {filePreviews.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {getFileIcon(file.type)}
                          <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Send required documents to user's WhatsApp */}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleSendDocsWhatsApp}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Send required documents to WhatsApp
                  </button>
                </div>
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
