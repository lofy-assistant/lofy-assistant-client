"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDashboardNight } from "@/components/dashboard/shared/dashboard-night-provider";
import { dnc } from "@/lib/dashboard-night";

export function AboutSettings() {
  const { isNight: night } = useDashboardNight();

  return (
    <Card
      className={cn(
        "py-4 text-sm",
        night && "border-white/10 bg-white/5"
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn(
            "flex items-center gap-2 text-sm",
            night && "text-[#e8ddd4]"
          )}
        >
          <Info className="w-5 h-5" />
          About
        </CardTitle>
        <CardDescription
          className={cn("text-xs", night && "text-[#9a8f85]")}
        >
          Application information and resources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h3
            className={cn(
              "mb-1 text-sm font-medium",
              dnc.settingsSectionTitle(night)
            )}
          >
            Version
          </h3>
          <p
            className={cn(
              "text-sm",
              dnc.settingsHelp(night)
            )}
          >
            2.0.2
          </p>
        </div>

        <Separator
          className={night ? "bg-white/10" : undefined}
        />

        <div>
          <h3
            className={cn(
              "mb-2 text-sm font-medium",
              dnc.settingsSectionTitle(night)
            )}
          >
            Resources
          </h3>
          <div className="space-y-2">
            <a
              href="/about-us"
              className={cn(
                "block text-sm hover:underline",
                night
                  ? "text-sky-300 hover:text-sky-200"
                  : "text-primary"
              )}
            >
              About Us
            </a>
            <a
              href="/features"
              className={cn(
                "block text-sm hover:underline",
                night
                  ? "text-sky-300 hover:text-sky-200"
                  : "text-primary"
              )}
            >
              Features
            </a>
            <a
              href="/pricing"
              className={cn(
                "block text-sm hover:underline",
                night
                  ? "text-sky-300 hover:text-sky-200"
                  : "text-primary"
              )}
            >
              Pricing
            </a>
          </div>
        </div>

        <Separator
          className={night ? "bg-white/10" : undefined}
        />

        <div>
          <h3
            className={cn(
              "mb-2 text-sm font-medium",
              dnc.settingsSectionTitle(night)
            )}
          >
            Legal
          </h3>
          <div className="space-y-2">
            <a
              href="/terms"
              className={cn(
                "block text-sm transition-colors",
                night
                  ? "text-[#9a8f85] hover:text-[#d4ccc4]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Terms of Service
            </a>
            <a
              href="/privacy-policy"
              className={cn(
                "block text-sm transition-colors",
                night
                  ? "text-[#9a8f85] hover:text-[#d4ccc4]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
