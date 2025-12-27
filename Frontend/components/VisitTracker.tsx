import { useEffect } from "react";
import api from "../lib/client";

const VisitTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // We use a session storage flag to avoid double counting on refreshes in the same session
        // if that's desired. But usually, "visit" can be every hit.
        // Let's stick to once per session to be a bit more accurate for "Happy Clients".
        const hasVisited = sessionStorage.getItem("hasVisited");
        if (!hasVisited) {
          await api.post("/stats/visit");
          sessionStorage.setItem("hasVisited", "true");
        }
      } catch (error) {
        console.error("Failed to track visit:", error);
      }
    };

    trackVisit();
  }, []);

  return null;
};

export default VisitTracker;
