"use client";

import { useState, useEffect } from "react";

export interface WeatherData {
  temperature: number;
  description: string;
  isLoading: boolean;
  error: string | null;
}

// WMO weather interpretation codes
const weatherDescriptions: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Heavy freezing drizzle",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Moderate showers",
  82: "Heavy showers",
  85: "Light snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

export function useWeather(): WeatherData {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    description: "",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setWeather({ temperature: 0, description: "", isLoading: false, error: "Geolocation not supported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`
          );
          if (!res.ok) throw new Error("Weather fetch failed");
          const data = await res.json();
          const temp = Math.round(data.current.temperature_2m);
          const code = data.current.weather_code as number;
          const description = weatherDescriptions[code] ?? "Unknown weather";
          setWeather({ temperature: temp, description, isLoading: false, error: null });
        } catch {
          setWeather({ temperature: 0, description: "", isLoading: false, error: "Failed to fetch weather" });
        }
      },
      () => {
        setWeather({ temperature: 0, description: "", isLoading: false, error: "Location access denied" });
      },
      { timeout: 8000 }
    );
  }, []);

  return weather;
}
