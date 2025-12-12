import React, { createContext, useContext, useState, ReactNode } from "react";
import { Language, LanguageContextType } from "../types";
import { DICTIONARY } from "../data/translations";

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("GU");

  const t = (key: string): string => {
    const entry = DICTIONARY[key];
    if (!entry) return key;
    // @ts-ignore - Temporary ignore if strict type checking fails due to partial DICTIONARY updates
    return entry[language] || entry["GU"];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
