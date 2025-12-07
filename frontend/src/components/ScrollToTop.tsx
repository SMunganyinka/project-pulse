import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instantly" scroll to the top of the page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]); // This effect runs whenever the URL path changes

  return null; // This component doesn't render anything, it just performs an action
};

export default ScrollToTop;