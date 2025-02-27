import { useState, useEffect } from "react";

const useDeviceType = () => {
  const getDeviceType = () => {
    return window.matchMedia("(max-width: 768px)").matches
      ? "mobile"
      : "desktop";
  };

  const [device, setDevice] = useState(getDeviceType());

  useEffect(() => {
    const handleResize = () => setDevice(getDeviceType());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return device;
};

export default useDeviceType;
