"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, CheckCircle2, CircleDot, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

export interface Integration {
  id: string;
  name: string;
  description?: string;
  icon: React.ReactNode;
  enabled: boolean;
  status: "connected" | "disconnected" | "error";
}

type GoogleAccountRow = {
  credentialId: number;
  displayName: string | null;
  googleEmail: string | null;
  isActive: boolean;
  isDefault?: boolean;
};

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
      name: "Google",
      description: "Calendar, mail, and Drive through one OAuth connection per account",
      icon: <Image src="/assets/icons/google-calendar-icon.svg" alt="Google" width={32} height={32} className="size-8 object-contain" />,
      enabled: false,
      status: "disconnected",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [googleAccounts, setGoogleAccounts] = useState<GoogleAccountRow[]>([]);
  const [googleDialogOpen, setGoogleDialogOpen] = useState(false);
  const [newAccountLabel, setNewAccountLabel] = useState("");
  const [oauthSubmitting, setOauthSubmitting] = useState(false);

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
            setGoogleAccounts(
              g.accounts.map((a) => ({
                ...a,
                isDefault: Boolean(a.isDefault),
              }))
            );
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

    fetchIntegrationStatus().finally(() => {
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

  const setDefaultGoogleAccount = async (credentialId: number) => {
    const response = await fetch("/api/integration/google/default", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credentialId }),
    });
    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error || "Could not update default account");
    }
    toast.success("Default Google account updated");
    const statusRes = await fetch("/api/integration/status", { method: "GET", credentials: "include" });
    if (statusRes.ok) {
      const data = (await statusRes.json()) as {
        integrations: Record<string, { accounts?: GoogleAccountRow[] }>;
      };
      const g = data.integrations["google-calendar"];
      setGoogleAccounts(
        (g?.accounts ?? []).map((a) => ({
          ...a,
          isDefault: Boolean(a.isDefault),
        }))
      );
    }
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
        integrations: Record<
          string,
          {
            isActive: boolean;
            status: "connected" | "disconnected" | "error";
            accounts?: GoogleAccountRow[];
          }
        >;
      };
      const g = data.integrations["google-calendar"];
      setGoogleAccounts(
        (g?.accounts ?? []).map((a) => ({
          ...a,
          isDefault: Boolean(a.isDefault),
        }))
      );
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

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <Badge variant="primary">Connected</Badge>;
      case "disconnected":
        return <Badge variant="default">Not connected</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  const googleIntegration = integrations.find((i) => i.id === "google-calendar");
  const whatsappIntegration = integrations.find((i) => i.id === "whatsapp");

  const openGoogleDialog = () => {
    setNewAccountLabel("");
    setGoogleDialogOpen(true);
  };

  const submitGoogleOAuth = async () => {
    const label = newAccountLabel.trim();
    if (!label) {
      toast.error("Add a short name so you can tell accounts apart (for example Work or Personal).");
      return;
    }
    setOauthSubmitting(true);
    try {
      await startGoogleOAuth(label);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Could not start Google sign-in");
      setIntegrations((prev) =>
        prev.map((i) => (i.id === "google-calendar" ? { ...i, status: "error" as const } : i)),
      );
      setOauthSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-[#7a6a5a]">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="text-sm">Loading integrations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Google suite — OAuth, multiple accounts */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#9a8070]">Google</h2>
        <Card className="overflow-hidden border-[#ede5da] bg-gradient-to-b from-white to-[#faf7f2] shadow-sm">
          <CardHeader className="space-y-4 p-4">
            <div className="flex gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#ede5da] bg-white shadow-sm">
                <Image src="/assets/icons/google-calendar-icon.svg" alt="" width={28} height={28} className="size-7 object-contain" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base font-semibold text-[#3d2e22]">Google suite</CardTitle>
                  {googleIntegration && getStatusBadge(googleIntegration.status)}
                </div>
                <p className="text-xs leading-relaxed text-[#7a6a5a]">
                  Connect each Google identity once with OAuth. Lofy stores tokens per account so Calendar stays in sync today; Gmail, Drive, and other Google tools will reuse the same connection as they ship.
                </p>
              </div>
            </div>

            <div className="grid gap-2 rounded-xl border border-[#ede5da] bg-white/90 p-3">
              <div className="flex items-start gap-2 text-xs text-[#3d2e22]">
                <Shield className="mt-0.5 size-3.5 shrink-0 text-[#c97a5c]" aria-hidden />
                <span>
                  <span className="font-medium text-[#3d2e22]">Standard OAuth 2.0.</span> You approve scopes on Google; we never see your password.
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-[#3d2e22]">
                <Calendar className="mt-0.5 size-3.5 shrink-0 text-[#c97a5c]" aria-hidden />
                <span>
                  <span className="font-medium text-[#3d2e22]">Calendar</span> is available now. Add separate connections for work, personal, or shared mailboxes. Choose which account is the default for new events and future Gmail.
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-[#7a6a5a]">
                <CircleDot className="mt-0.5 size-3.5 shrink-0 text-[#c4b5a8]" aria-hidden />
                <span>Gmail, Drive, and the rest of the suite will light up here without a second sign-in flow.</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-[#9a8070]">Connected accounts</p>
              {googleAccounts.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[#e5d9ce] bg-[#faf7f2] px-3 py-3 text-center text-xs text-[#7a6a5a]">
                  No Google accounts yet. Connect one to sync Calendar and use your Google identities with Lofy.
                </p>
              ) : (
                <ul className="space-y-2">
                  {googleAccounts.map((a) => (
                    <li
                      key={a.credentialId}
                      className="flex flex-col gap-3 rounded-xl border border-[#ede5da] bg-white px-3 py-3"
                    >
                      <div className="flex min-w-0 items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#3d2e22]">
                            <span className="min-w-0 break-words">{a.displayName || "Google account"}</span>
                            {a.isDefault ? (
                              <Badge
                                variant="primary"
                                className="shrink-0 px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none tracking-wide"
                              >
                                Default
                              </Badge>
                            ) : null}
                          </p>
                          {a.googleEmail ? (
                            <p className="mt-0.5 break-all text-xs text-[#7a6a5a]">{a.googleEmail}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex w-full min-w-0 flex-row gap-2">
                        {!a.isDefault && a.isActive ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-9 min-w-0 flex-1 cursor-pointer text-xs"
                            onClick={async () => {
                              try {
                                await setDefaultGoogleAccount(a.credentialId);
                              } catch (e) {
                                toast.error(e instanceof Error ? e.message : "Update failed");
                              }
                            }}
                          >
                            Set as default
                          </Button>
                        ) : null}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 min-w-0 flex-1 text-xs"
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
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Button className="h-10 w-full text-sm font-medium" onClick={openGoogleDialog}>
              Connect Google account
            </Button>
          </CardHeader>
        </Card>
      </section>

      {/* WhatsApp */}
      {whatsappIntegration && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#9a8070]">Messaging</h2>
          <Card className="overflow-hidden border-[#ede5da] bg-white/80">
            <CardHeader className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-white">{whatsappIntegration.icon}</div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="truncate text-sm font-semibold">{whatsappIntegration.name}</CardTitle>
                  {whatsappIntegration.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{whatsappIntegration.description}</p>
                  )}
                </div>
                <div className="shrink-0">{getStatusBadge(whatsappIntegration.status)}</div>
              </div>
            </CardHeader>
          </Card>
        </section>
      )}

      <Dialog
        open={googleDialogOpen}
        onOpenChange={(open) => {
          setGoogleDialogOpen(open);
          if (!open) setNewAccountLabel("");
        }}
      >
        <DialogContent className="border-[#ede5da] sm:max-w-md" showCloseButton={!oauthSubmitting}>
          <DialogHeader>
            <DialogTitle className="text-[#3d2e22]">Connect a Google account</DialogTitle>
            <DialogDescription>
              Choose a label you will recognize in the dashboard. You will be sent to Google to sign in and approve access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor="google-account-label" className="text-xs font-medium text-[#3d2e22]">
              Account label
            </label>
            <Input
              id="google-account-label"
              placeholder="e.g. Work, Personal, Shared inbox"
              value={newAccountLabel}
              onChange={(e) => setNewAccountLabel(e.target.value)}
              disabled={oauthSubmitting}
              className="border-[#ede5da]"
              onKeyDown={(e) => {
                if (e.key === "Enter") void submitGoogleOAuth();
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setGoogleDialogOpen(false)} disabled={oauthSubmitting}>
              Cancel
            </Button>
            <Button
              type="button"
              className="gap-2"
              onClick={() => void submitGoogleOAuth()}
              disabled={oauthSubmitting}
            >
              {oauthSubmitting ? (
                <>
                  <Loader2 className="size-4 shrink-0 animate-spin" />
                  Opening Google…
                </>
              ) : (
                "Continue with Google"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
