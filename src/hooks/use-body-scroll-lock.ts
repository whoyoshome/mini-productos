import { useEffect } from "react";

export function useBodyScrollLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const { body, documentElement } = document;
    const y = window.scrollY;
    const scrollbarComp = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    if (scrollbarComp > 0) {
      body.style.paddingRight = `${scrollbarComp}px`;
    }

    return () => {
      const prevY = -parseInt(body.style.top || "0", 10) || 0;

      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.paddingRight = "";

      window.scrollTo(0, prevY);
    };
  }, [enabled]);
}
