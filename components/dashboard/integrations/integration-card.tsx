"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconClockHour4, IconArrowBigUp } from "@tabler/icons-react";

export interface Integration {
  id: string;
  name: string;
  description?: string;
  icon: React.ReactNode;
  enabled: boolean;
  status: "connected" | "disconnected" | "error";
  comingSoon?: boolean;
  votes?: number;
}

const COMING_SOON_INTEGRATIONS: Omit<Integration, "enabled" | "status">[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Sync emails and schedule from your inbox",
    icon: <Image src="/assets/bento-features/gmail-icon.svg" alt="Gmail" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Connect Outlook Calendar and Mail",
    icon: <Image src="/assets/bento-features/outlook-icon.svg" alt="Outlook" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get reminders and updates in your workspace",
    icon: <Image src="/assets/bento-features/slack-icon.svg" alt="Slack" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Get notifications in Telegram",
    icon: <Image src="/assets/bento-features/telegram-icon.svg" alt="Telegram" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync tasks and notes with Notion",
    icon: <IconClockHour4 className="size-8 text-muted-foreground" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "linear",
    name: "Linear",
    description: "Track issues and get reminder updates",
    icon: <IconClockHour4 className="size-8 text-muted-foreground" />,
    comingSoon: true,
    votes: 0,
  },
];

export function IntegrationCard() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Receive reminders via WhatsApp",
      icon: <Image src="/assets/bento-features/whatsapp-icon.svg" alt="WhatsApp" width={32} height={32} className="size-8 object-contain" />,
      enabled: true,
      status: "connected",
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sync events and availability with Google Calendar",
      icon: <Image src="/assets/bento-features/google-calendar-icon.svg" alt="Google Calendar" width={32} height={32} className="size-8 object-contain" />,
      enabled: false,
      status: "disconnected",
    },
    ...COMING_SOON_INTEGRATIONS.map((i) => ({
      ...i,
      enabled: false,
      status: "disconnected" as const,
    })),
  ]);

  // Fetch integration status on mount
  useEffect(() => {
    const fetchIntegrationStatus = async () => {
      try {
        const response = await fetch("/api/integration/status", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const statuses = data.integrations as Record<string, { isActive: boolean; status: "connected" | "disconnected" | "error" }>;

          setIntegrations((prev) =>
            prev.map((integration) => {
              const statusInfo = statuses[integration.id];
              if (statusInfo) {
                return {
                  ...integration,
                  enabled: statusInfo.isActive,
                  status: statusInfo.status,
                };
              }
              return integration;
            }),
          );
        }
      } catch (error) {
        console.error("Failed to fetch integration status:", error);
      }
    };

    fetchIntegrationStatus();
  }, []);

  const handleToggle = async (id: string, currentEnabled: boolean, comingSoon?: boolean) => {
    if (comingSoon) return;
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
              : integration,
          ),
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
          : integration,
      ),
    );
  };

  const handleVote = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id && integration.comingSoon
          ? {
              ...integration,
              votes: (integration.votes || 0) + 1,
            }
          : integration,
      ),
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

  const available = integrations.filter((i) => !i.comingSoon);
  const comingSoon = integrations.filter((i) => i.comingSoon);

  return (
    <div className="space-y-8">
      {available.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available</h2>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {available.map((integration) => (
              <Card key={integration.id} className="overflow-hidden py-4">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted/50">{integration.icon}</div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate">{integration.name}</CardTitle>
                        {integration.description && <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{integration.description}</p>}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {getStatusBadge(integration.status)}
                      <Switch checked={integration.enabled} onCheckedChange={() => handleToggle(integration.id, integration.enabled, integration.comingSoon)} />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {comingSoon.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Coming soon</h2>
            <p className="text-xs text-muted-foreground">Vote for integrations you want next</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {comingSoon
              .sort((a, b) => (b.votes || 0) - (a.votes || 0))
              .map((integration) => (
                <Card key={integration.id} className="overflow-hidden opacity-90 py-4">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted/50">{integration.icon}</div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-lg truncate">{integration.name}</CardTitle>
                          <Badge variant="default" className="shrink-0 font-normal bg-muted text-muted-foreground">
                            Coming soon
                          </Badge>
                        </div>
                        {integration.description && <p className="text-sm text-muted-foreground line-clamp-2">{integration.description}</p>}
                        <div className="pt-2">
                          <Button variant="outline" size="sm" onClick={() => handleVote(integration.id)} className="gap-2 h-8">
                            <IconArrowBigUp className="size-4" />
                            <span className="font-medium">{integration.votes || 0}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
