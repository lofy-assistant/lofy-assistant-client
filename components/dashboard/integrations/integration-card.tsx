"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconArrowBigUp, IconCheck } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
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

type GoogleAccountRow = {
  credentialId: number;
  displayName: string | null;
  googleEmail: string | null;
  isActive: boolean;
};

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
  const [loading, setLoading] = useState(true);
  const [googleAccounts, setGoogleAccounts] = useState<GoogleAccountRow[]>([]);

  useEffect(() => {
    const fetchIntegrationStatus = async () => {
      try {
        const response = await fetch("/api/integration/status", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const statuses = data.integrations as Record<
            string,
            {
              isActive: boolean;
              status: "connected" | "disconnected" | "error";
              accounts?: GoogleAccountRow[];
            }
          >;

          const g = statuses["google-calendar"];
          if (g?.accounts) {
            setGoogleAccounts(g.accounts);
          } else {
            setGoogleAccounts([]);
          }

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

    Promise.all([fetchIntegrationStatus(), fetchVoteData()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const startGoogleOAuth = async (integrationLabel: string) => {
    const response = await fetch("/api/integration", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ integrationLabel }),
    });
    if (response.ok) {
      const data = (await response.json()) as { redirectUrl?: string };
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
    }
    const errorData = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(errorData.error || "Failed to initiate authorization");
  };

  const disconnectGoogleAccount = async (credentialId: number) => {
    const response = await fetch("/api/integration/google/disconnect", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credentialId }),
    });
    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error || "Disconnect failed");
    }
    toast.success("Google account disconnected");
    const statusRes = await fetch("/api/integration/status", { method: "GET", credentials: "include" });
    if (statusRes.ok) {
      const data = (await statusRes.json()) as {
        integrations: Record<string, { isActive: boolean; status: "connected" | "disconnected" | "error"; accounts?: GoogleAccountRow[] }>;
      };
      const g = data.integrations["google-calendar"];
      setGoogleAccounts(g?.accounts ?? []);
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === "google-calendar"
            ? {
                ...integration,
                enabled: g?.isActive ?? false,
                status: g?.isActive ? "connected" : "disconnected",
              }
            : integration,
        ),
      );
    }
  };

  const handleToggle = async (id: string, currentEnabled: boolean, comingSoon?: boolean) => {
    if (comingSoon) return;
    if (id === "google-calendar") {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-[#7a6a5a]">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="text-sm">Loading integrations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Available ── */}
      {available.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-[#9a8070] uppercase tracking-widest">Available</h2>
          <div className="flex flex-col gap-2">
            {available.map((integration) => (
              <Card key={integration.id} className="overflow-hidden bg-white/80 border-[#ede5da]">
                <CardHeader className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-white">{integration.icon}</div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm font-semibold truncate">{integration.name}</CardTitle>
                      {integration.description && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{integration.description}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {getStatusBadge(integration.status)}
                      {integration.id === "whatsapp" && (
                        <Switch checked={integration.enabled} onCheckedChange={() => handleToggle(integration.id, integration.enabled, integration.comingSoon)} />
                      )}
                    </div>
                  </div>
                  {integration.id === "google-calendar" && (
                    <div className="mt-3 space-y-2 border-t border-[#ede5da] pt-3">
                      {googleAccounts.length > 0 && (
                        <ul className="space-y-2">
                          {googleAccounts.map((a) => (
                            <li key={a.credentialId} className="flex items-center justify-between gap-2 rounded-lg bg-[#faf7f2] px-2 py-1.5 text-xs">
                              <div className="min-w-0">
                                <p className="font-medium truncate">{a.displayName || "Google account"}</p>
                                {a.googleEmail && <p className="text-muted-foreground truncate">{a.googleEmail}</p>}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 shrink-0 text-xs"
                                onClick={async () => {
                                  try {
                                    await disconnectGoogleAccount(a.credentialId);
                                  } catch (e) {
                                    toast.error(e instanceof Error ? e.message : "Disconnect failed");
                                  }
                                }}
                              >
                                Disconnect
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full h-8 text-xs"
                        onClick={async () => {
                          const name = window.prompt("Name this Google connection (e.g. Work, Personal):");
                          if (!name?.trim()) {
                            toast.error("A name is required to add a Google account.");
                            return;
                          }
                          try {
                            await startGoogleOAuth(name.trim());
                          } catch (e) {
                            console.error(e);
                            toast.error(e instanceof Error ? e.message : "Could not start Google sign-in");
                            setIntegrations((prev) =>
                              prev.map((i) => (i.id === "google-calendar" ? { ...i, status: "error" as const } : i)),
                            );
                          }
                        }}
                      >
                        Add Google account
                      </Button>
                    </div>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── Coming soon ── */}
      {comingSoon.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[#9a8070] uppercase tracking-widest">Coming soon</h2>
            <p className="text-xs text-muted-foreground">
              {remainingVotes} vote{remainingVotes !== 1 ? "s" : ""} remaining
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {comingSoon
              .sort((a, b) => (b.votes || 0) - (a.votes || 0))
              .map((integration) => (
                <Card key={integration.id} className="overflow-hidden bg-white/80 border-[#ede5da] flex flex-col gap-0">
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 px-3 pt-6 pb-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white">{integration.icon}</div>
                    <p className="text-xs font-semibold leading-tight line-clamp-1 w-full text-center">{integration.name}</p>
                  </div>
                  <div className="px-3 pb-3 mt-auto">
                    <Button variant={integration.hasVoted ? "default" : "outline"} size="sm" onClick={() => handleVote(integration.id)} disabled={isVoting === integration.id} className="w-full h-7 text-xs gap-1">
                      {integration.hasVoted ? <IconCheck className="size-3" /> : <IconArrowBigUp className="size-3" />}
                      {integration.votes || 0} vote{(integration.votes || 0) !== 1 ? "s" : ""}
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
