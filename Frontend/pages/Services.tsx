import React from "react";
import { motion } from "framer-motion";
import { useServices } from "../context/ServiceContext";
import ServiceCard from "../components/ServiceCard";
import { useLanguage } from "../context/LanguageContext";

const Services: React.FC = () => {
  const { t } = useLanguage();
  const { services } = useServices();

  const categoryKeys = ["CERTIFICATE", "ASSISTANCE", "ONLINE", "OTHER"];

  return (
    <div className="bg-slate-50 dark:bg-gradient-to-br dark:from-primary-900 dark:to-primary-800 min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
            {t("section.our_services")}
          </h1>
          <p className="text-slate-600 dark:text-primary-100 max-w-2xl mx-auto">
            Explore our wide range of government documentation services designed
            to make your life easier.
          </p>
        </div>

        <div className="space-y-16">
          {categoryKeys.map((categoryKey) => {
            const categoryServices = services.filter(
              (s) => s.category === categoryKey
            );
            if (categoryServices.length === 0) return null;

            const label =
              t("category." + categoryKey) + " " + t("nav.services");

            return (
              <div key={categoryKey}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">
                    {label}
                  </h2>
                  <div className="h-px bg-slate-200 dark:bg-white/20 flex-grow"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
