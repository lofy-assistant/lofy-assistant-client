"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ContactFounderCard() {
  return (
    <Card className="rounded-2xl border border-[#ede5da] bg-white/80 py-6 shadow-sm">
      <CardHeader>
        <CardTitle>Contact Our Founder</CardTitle>
        <CardDescription>
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
