import React, { useState } from "react";
import { X, Globe, FileText, CheckCircle2 } from "lucide-react";

interface ServicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
}

type LanguageKey = "EN" | "GU";

const LANGUAGES: { key: LanguageKey; label: string }[] = [
  { key: "EN", label: "English" },
  { key: "GU", label: "Gujarati" },
];

const ServicePreviewModal: React.FC<ServicePreviewModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const [activeTab, setActiveTab] = useState<LanguageKey>("EN");
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Globe className="text-primary-500" />
              Service Preview
              {service.category && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {service.category}
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review how the service details appear in different languages
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.key}
                onClick={() => setActiveTab(lang.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === lang.key
                    ? "bg-white dark:bg-slate-600 text-primary-600 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-300">
            <div className="space-y-6">
              {/* Title Section */}
              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Service Title
                </h4>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {service.title?.[activeTab] || (
                    <span className="text-slate-400 italic">
                      Title not available in {activeTab}
                    </span>
                  )}
                </p>
              </div>

              {/* Description Section */}
              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Description
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {service.description?.[activeTab] || (
                    <span className="text-slate-400 italic">
                      Description not available in {activeTab}
                    </span>
                  )}
                </p>
              </div>

              {/* Documents Section */}
              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                  <FileText size={14} />
                  Required Documents
                </h4>
                {service.documents?.[activeTab]?.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.documents[activeTab].map(
                      (doc: string, i: number) =>
                        doc ? (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"
                          >
                            <CheckCircle2
                              size={16}
                              className="text-primary-500 flex-shrink-0"
                            />
                            <span>{doc}</span>
                          </li>
                        ) : null
                    )}
                  </ul>
                ) : (
                  <span className="text-slate-400 italic text-sm">
                    No documents listed for this language
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 rounded-lg dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicePreviewModal;
