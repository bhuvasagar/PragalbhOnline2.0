import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Service, Language } from "../types";
import api from "../lib/client";

interface ServiceContextType {
  services: Service[];
  addService: (service: Omit<Service, "id">) => void;
  deleteService: (id: string) => void;
  fetchServices: () => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [services, setServices] = useState<Service[]>([]);

  // Load services from local storage or fallback to constants
  // Load services from API
  // Load services from API
  // Load services from API
  const fetchServices = async () => {
    try {
      const { data } = await api.get("/services");
      const mappedData = data.map((s: any) => ({ ...s, id: s._id || s.id }));
      setServices(mappedData);
      localStorage.setItem(
        "pragalbh_services_data",
        JSON.stringify(mappedData)
      );
    } catch (error) {
      console.error("Failed to fetch services from API", error);
      const savedServices = localStorage.getItem("pragalbh_services_data");
      if (savedServices) {
        const parsedServices = JSON.parse(savedServices);
        setServices(
          parsedServices.map((s: any) => ({ ...s, id: s._id || s.id }))
        );
      } else {
        setServices([]);
      }
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const addService = (serviceData: Omit<Service, "id">) => {
    const newService: Service = { ...serviceData, id: crypto.randomUUID() };
    setServices((prev) => [...prev, newService]);
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  return (
    <ServiceContext.Provider
      value={{ services, addService, deleteService, fetchServices }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
};
