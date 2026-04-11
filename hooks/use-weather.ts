"use client";

import useSWR from "swr";

export interface WeatherData {
  temperature: number;
  description: string;
  isLoading: boolean;
  error: string | null;
}

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Weather request failed");
    return r.json() as Promise<{ temperature: number; description: string }>;
  });

export function useWeather(): WeatherData {
  const { data, error, isLoading } = useSWR("/api/weather", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  return {
    temperature: data?.temperature ?? 0,
    description: data?.description ?? "",
    isLoading,
    error: error ? "Failed to fetch weather" : null,
  };
}
