import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AutoLogout: React.FC = () => {
  const navigate = useNavigate();
  // 15 minutes in milliseconds
  const TAX_TIME = 60 * 60 * 1000;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performLogout = () => {
    localStorage.removeItem("pragalbh_admin_auth");
    localStorage.removeItem("pragalbh_admin_token");
    navigate("/admin/login");
    // Optional: Alert user they were logged out?
    // alert("Session expired due to inactivity.");
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(performLogout, TAX_TIME);
  };

  useEffect(() => {
    // Initial timer
    resetTimer();

    // Events to monitor
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const handleActivity = () => {
      resetTimer();
    };

    // Add listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return null; // This component handles logic only, renders nothing
};

export default AutoLogout;
