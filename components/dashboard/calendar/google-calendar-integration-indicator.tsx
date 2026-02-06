"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plug, Check, Loader2 } from "lucide-react";

export function GoogleCalendarIntegrationIndicator() {
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/integration/status", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const status = data.integrations?.["google-calendar"];
          setIsConnected(!!status?.isActive);
        } else {
          setIsConnected(false);
        }
      } catch {
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span className="hidden sm:inline">Checking...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <Badge variant="primary" className="gap-1 text-[10px] font-normal h-6">
        <Check className="w-3 h-3" />
        <span className="hidden sm:inline">Google Calendar</span>
      </Badge>
    );
  }

  return (
    <Button variant="outline" size="sm" asChild className="gap-1.5 h-7 text-xs">
      <Link href="/dashboard/integrations">
        <Plug className="w-3 h-3" />
        <span className="hidden sm:inline">Integrate Google</span>
        <span className="sm:hidden">Integrate</span>
      </Link>
    </Button>
  );
}
