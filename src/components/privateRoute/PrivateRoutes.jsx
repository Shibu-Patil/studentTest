import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const PrivateRoutes = ({ children }) => {
  const { token } = useSelector((state) => state.student);

  useEffect(() => {
    // Tab switch / minimize
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error("🚨 Do not switch tabs or minimize!");
      }
    };

    // Window lost focus
    const handleBlur = () => {
      toast.error("🚨 Window lost focus! Stay on this page.");
    };

    // Window resize / maximize
    const handleResize = () => {
      toast.error("🚨 Do not resize or maximize/minimize window!");
    };

    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.error("🚨 Right-click disabled!");
    };

    // Disable copy, paste, cut, select all
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && ["c", "v", "x", "a", "s", "p", "u"].includes(e.key.toLowerCase())) ||
        e.metaKey // For Mac Cmd key
      ) {
        e.preventDefault();
        toast.error("🚨 Keyboard shortcuts disabled!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("resize", handleResize);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Toaster position="top-center" />
      {children || <Outlet />}
    </>
  );
};

export default PrivateRoutes;
