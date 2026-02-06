"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconClockHour4, IconArrowBigUp, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

export interface Integration {
  id: string;
  name: string;
  description?: string;
  icon: React.ReactNode;
  enabled: boolean;
  status: "connected" | "disconnected" | "error";
  comingSoon?: boolean;
  votes?: number;
  hasVoted?: boolean;
}

const COMING_SOON_INTEGRATIONS: Omit<Integration, "enabled" | "status">[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Get reminders and updates in your workspace",
    icon: <Image src="/assets/icons/slack-icon.svg" alt="Slack" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Collaborate and get notifications in Teams",
    icon: <Image src="/assets/icons/teams-icon.svg" alt="Microsoft Teams" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "discord",
    name: "Discord",
    description: "Receive updates and reminders in Discord",
    icon: <Image src="/assets/icons/discord-icon.svg" alt="Discord" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Get notifications in Telegram",
    icon: <Image src="/assets/icons/telegram-icon.svg" alt="Telegram" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Sync emails and schedule from your inbox",
    icon: <Image src="/assets/icons/gmail-icon.svg" alt="Gmail" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Connect Outlook Calendar and Mail",
    icon: <Image src="/assets/icons/outlook-icon.svg" alt="Outlook" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Access and manage your files from Drive",
    icon: <Image src="/assets/icons/drive-icon.svg" alt="Google Drive" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "onedrive",
    name: "OneDrive",
    description: "Sync files and documents from OneDrive",
    icon: <Image src="/assets/icons/onedrive-icon.svg" alt="OneDrive" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "trello",
    name: "Trello",
    description: "Manage boards and get task updates",
    icon: <Image src="/assets/icons/trello-icon.svg" alt="Trello" width={32} height={32} className="size-8 object-contain" />,
    comingSoon: true,
    votes: 0,
  },
  {
    id: "web-search",
    name: "Web Search API",
    description: "Search the web and get relevant results",
    icon: <Image src="/assets/icons/web-search-icon.svg" alt="Web Search API" width={32} height={32} className="size-8 object-contain" />,
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
      icon: <Image src="/assets/icons/whatsapp-icon.svg" alt="WhatsApp" width={32} height={32} className="size-8 object-contain" />,
      enabled: true,
      status: "connected",
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sync events and availability with Google Calendar",
      icon: <Image src="/assets/icons/google-calendar-icon.svg" alt="Google Calendar" width={32} height={32} className="size-8 object-contain" />,
      enabled: false,
      status: "disconnected",
    },
    ...COMING_SOON_INTEGRATIONS.map((i) => ({
      ...i,
      enabled: false,
      status: "disconnected" as const,
      hasVoted: false,
    })),
  ]);
  const [remainingVotes, setRemainingVotes] = useState(3);
  const [isVoting, setIsVoting] = useState<string | null>(null);

  // Fetch integration status and vote data on mount
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

    const fetchVoteData = async () => {
      try {
        const response = await fetch("/api/integration/vote", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const counts = data.counts as Record<string, number>;
          const userVotes = data.userVotes as string[];

          setRemainingVotes(data.remainingVotes);

          setIntegrations((prev) =>
            prev.map((integration) => ({
              ...integration,
              votes: counts[integration.id] || 0,
              hasVoted: userVotes.includes(integration.id),
            })),
          );
        }
      } catch (error) {
        console.error("Failed to fetch vote data:", error);
      }
    };

    fetchIntegrationStatus();
    fetchVoteData();
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

  const handleVote = async (id: string) => {
    if (isVoting) return;

    const integration = integrations.find((i) => i.id === id);
    if (!integration?.comingSoon) return;

    // Check if user can vote (hasn't reached limit and hasn't voted for this)
    if (!integration.hasVoted && remainingVotes <= 0) {
      toast.error("You've used all 3 votes. Unvote an integration to vote for another.");
      return;
    }

    setIsVoting(id);

    try {
      const response = await fetch("/api/integration/vote", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationId: id }),
      });

      if (response.ok) {
        const data = await response.json();

        setRemainingVotes(data.remainingVotes);
        setIntegrations((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  votes: data.count,
                  hasVoted: data.voted,
                }
              : i,
          ),
        );

        if (data.voted) {
          toast.success(`Voted for ${integration.name}!`);
        } else {
          toast.info(`Removed vote from ${integration.name}`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || "Failed to vote");
      }
    } catch (error) {
      console.error("Vote error:", error);
      toast.error("Failed to vote. Please try again.");
    } finally {
      setIsVoting(null);
    }
  };

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <Badge variant="primary">Connected</Badge>;
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
              <Card key={integration.id} className="overflow-hidden">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-lg border bg-muted/50">{integration.icon}</div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg truncate">{integration.name}</CardTitle>
                        {integration.description && <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground line-clamp-2">{integration.description}</p>}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3 justify-end sm:justify-start">
                      {getStatusBadge(integration.status)}
                      {integration.id !== "whatsapp" && <Switch checked={integration.enabled} onCheckedChange={(checked) => handleToggle(integration.id, integration.enabled, integration.comingSoon)} />}
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
            <p className="text-xs text-muted-foreground">
              {remainingVotes} vote{remainingVotes !== 1 ? "s" : ""} remaining
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {comingSoon
              .sort((a, b) => (b.votes || 0) - (a.votes || 0))
              .map((integration) => (
                <Card key={integration.id} className="overflow-hidden opacity-90 py-4 flex flex-col">
                  <CardHeader className="flex-1">
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
                      </div>
                    </div>
                  </CardHeader>
                  <div className="px-6 pb-4 flex justify-end">
                    <Button variant={integration.hasVoted ? "default" : "outline"} size="sm" onClick={() => handleVote(integration.id)} disabled={isVoting === integration.id} className="gap-2 h-9 min-w-[120px]">
                      {integration.hasVoted ? <IconCheck className="size-4" /> : <IconArrowBigUp className="size-4" />}
                      <span className="font-medium">
                        {integration.votes || 0} vote{(integration.votes || 0) !== 1 ? "s" : ""}
                      </span>
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
