"use client";

import { useState, useEffect } from "react";

export interface WeatherData {
  temperature: number;
  description: string;
  isLoading: boolean;
  error: string | null;
}

export function useWeather(): WeatherData {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    description: "",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) {
          throw new Error("Weather request failed");
        }
        const data = (await res.json()) as {
          temperature: number;
          description: string;
        };
        if (cancelled) return;
        setWeather({
          temperature: data.temperature,
          description: data.description,
          isLoading: false,
          error: null,
        });
      } catch {
        if (!cancelled) {
          setWeather({
            temperature: 0,
            description: "",
            isLoading: false,
            error: "Failed to fetch weather",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return weather;
}
