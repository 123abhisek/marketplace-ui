// src/components/ScrollToTop.jsx
import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  // Prevent browser from auto-restoring previous scroll position across route navigations
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    // If navigating to an in-page anchor hash (e.g. #contact), let browser scroll to it
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      const root = document.getElementById("root");
      if (root) root.scrollTop = 0;
      const mainEl = document.querySelector("main");
      if (mainEl) mainEl.scrollTop = 0;
    };

    // 1. Immediately in layout effect before paint
    resetScroll();

    // 2. Next animation frame
    const rafId = requestAnimationFrame(() => {
      resetScroll();
    });

    // 3. Timers to counter any layout shifts from async components/skeletons/images
    const t1 = setTimeout(resetScroll, 40);
    const t2 = setTimeout(resetScroll, 120);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, search, hash]);

  return null;
}
