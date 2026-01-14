"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  status: "connected" | "disconnected" | "error";
}

export function IntegrationCard() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google-calendar",
      name: "Google Calendar",
      icon: <Image src="/google-calendar.png" alt="Google Calendar" width={40} height={40} className="w-5 h-5" />,
      enabled: false,
      status: "disconnected",
    },
  ]);

  const handleToggle = async (id: string, currentEnabled: boolean) => {
    // If turning on, redirect to Google authorization
    if (!currentEnabled && id === "google-calendar") {
      try {
        const response = await fetch("/api/integration", {
          method: "GET",
          credentials: "include",
          redirect: "manual", // Don't automatically follow redirects
        });

        // Handle successful response - API returns JSON with redirectUrl
        if (response.ok) {
          const data = await response.json();
          if (data?.redirectUrl) {
            // Navigate to the Google OAuth URL
            window.location.href = data.redirectUrl;
            return;
          }
        }

        // Handle errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to initiate authorization");
        }
      } catch (error) {
        console.error("Failed to initiate Google authorization:", error);
        setIntegrations((prev) =>
          prev.map((integration) =>
            integration.id === id
              ? {
                  ...integration,
                  status: "error",
                }
              : integration
          )
        );
      }
      return;
    }

    // If turning off, just update local state
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              enabled: !integration.enabled,
              status: !integration.enabled ? "connected" : "disconnected",
            }
          : integration
      )
    );
  };

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <Badge variant="emerald">Connected</Badge>;
      case "disconnected":
        return <Badge variant="default">Disconnected</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {integrations.map((integration) => (
        <Card key={integration.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-1">{integration.icon}</div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(integration.status)}
                <Switch checked={integration.enabled} onCheckedChange={() => handleToggle(integration.id, integration.enabled)} />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
