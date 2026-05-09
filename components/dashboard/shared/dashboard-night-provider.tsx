"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isNightTime } from "@/lib/dashboard-night";

type DashboardNightContextValue = {
  /** null until client mount — same semantics as the dashboard hero clock. */
  now: Date | null;
  isNight: boolean;
};

const DashboardNightContext = createContext<DashboardNightContextValue>({
  now: null,
  isNight: false,
});

export function DashboardNightProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const isNight = useMemo(() => isNightTime(now), [now]);

  return (
    <DashboardNightContext.Provider value={{ now, isNight }}>
      {children}
    </DashboardNightContext.Provider>
  );
}

export function useDashboardNight() {
  return useContext(DashboardNightContext);
}
