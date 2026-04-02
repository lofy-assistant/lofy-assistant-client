"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

export function LenisScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Dashboard pages use fixed-height internal scroll containers.
    // Lenis hijacks wheel events at window-level, which prevents those
    // nested containers from receiving wheel/trackpad scroll properly.
    if (pathname?.startsWith("/dashboard")) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
