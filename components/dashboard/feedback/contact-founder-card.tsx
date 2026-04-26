"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDashboardNight } from "@/components/dashboard/shared/dashboard-night-provider";

export function ContactFounderCard() {
  const { isNight: night } = useDashboardNight();

  return (
    <Card
      className={cn(
        "rounded-2xl border py-6 shadow-sm",
        night
          ? "border-white/10 bg-white/5"
          : "border-[#ede5da] bg-white/80"
      )}
    >
      <CardHeader>
        <CardTitle
          className={night ? "text-[#e8ddd4]" : undefined}
        >
          Contact Our Founder
        </CardTitle>
        <CardDescription
          className={night ? "text-[#9a8f85]" : undefined}
        >
          Need direct assistance? Reach out to our founder on WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() =>
            window.open(
              "https://wa.me/60179764242?text=Hi%2C%20I%20have%20inquiry%20about%20Lofy.",
              "_blank"
            )
          }
          className="w-full"
          variant="default"
        >
          Contact via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}
