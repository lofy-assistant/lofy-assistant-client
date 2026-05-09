"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, CheckCircle2, CircleDot, FileSpreadsheet, Loader2, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { dnc } from "@/lib/dashboard-night";
import { useDashboardNight } from "@/components/dashboard/shared/dashboard-night-provider";

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

const GOOGLE_SHEETS_FEATURE = "google_sheets" as const;

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
  const [sheetsModalOpen, setSheetsModalOpen] = useState(false);
  const [sheetsModalView, setSheetsModalView] = useState<"offer" | "pending">("offer");
  const [googleSheetsWaitlist, setGoogleSheetsWaitlist] = useState(false);
  const [joinWaitlistSubmitting, setJoinWaitlistSubmitting] = useState(false);
  const { isNight: night } = useDashboardNight();

  useEffect(() => {
    const run = async () => {
      try {
        const [statusRes, waitlistRes] = await Promise.all([
          fetch("/api/integration/status", { method: "GET", credentials: "include" }),
          fetch(`/api/waitlist?feature=${encodeURIComponent(GOOGLE_SHEETS_FEATURE)}`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (statusRes.ok) {
          const data = await statusRes.json();
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
              })),
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

        if (waitlistRes.ok) {
          const w = (await waitlistRes.json()) as { enrolled?: boolean };
          setGoogleSheetsWaitlist(Boolean(w.enrolled));
        }
      } catch (error) {
        console.error("Failed to fetch integration status:", error);
      } finally {
        setLoading(false);
      }
    };

    void run();
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
        })),
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
        })),
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

  const openSheetsModal = () => {
    setSheetsModalView(googleSheetsWaitlist ? "pending" : "offer");
    setSheetsModalOpen(true);
  };

  const joinSheetsBetaWaitlist = async () => {
    setJoinWaitlistSubmitting(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: GOOGLE_SHEETS_FEATURE }),
      });
      if (!response.ok) {
        const err = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error || "Could not join the waitlist");
      }
      setGoogleSheetsWaitlist(true);
      setSheetsModalView("pending");
      toast.success("You are on the list. We will notify you when you are approved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setJoinWaitlistSubmitting(false);
    }
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
      setIntegrations((prev) => prev.map((i) => (i.id === "google-calendar" ? { ...i, status: "error" as const } : i)));
      setOauthSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 py-10",
          night ? "text-[#a89e94]" : "text-[#7a6a5a]"
        )}
      >
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="text-sm">Loading integrations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Google suite — OAuth, multiple accounts */}
      <section className="space-y-3">
        <h2
          className={cn(
            "text-xs font-semibold uppercase tracking-widest",
            dnc.textMuted(night)
          )}
        >
          Google
        </h2>
        <Card
          className={cn(
            "overflow-hidden border bg-gradient-to-b shadow-sm",
            night
              ? "border-white/10 from-white/8 to-white/4"
              : "border-[#ede5da] from-white to-[#faf7f2]"
          )}
        >
          <CardHeader className="space-y-4 p-4">
            <div className="flex gap-3">
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm",
                  night
                    ? "border-white/10 bg-white/5"
                    : "border-[#ede5da] bg-white"
                )}
              >
                <Image src="/assets/icons/google-calendar-icon.svg" alt="" width={28} height={28} className="size-7 object-contain" />
              </div>
                <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle
                    className={cn("text-base font-semibold", dnc.textPrimary(night))}
                  >
                    Google suite
                  </CardTitle>
                  {googleIntegration && getStatusBadge(googleIntegration.status)}
                </div>
                <p
                  className={cn("text-xs leading-relaxed", dnc.textSoft(night))}
                >
                  Connect each Google identity once with OAuth. Lofy stores tokens per account so Calendar stays in sync today; Gmail, Drive, and other Google tools will reuse the same connection as they ship.
                </p>
              </div>
            </div>

            <div
              className={cn(
                "grid gap-2 rounded-xl border p-3",
                night ? "border-white/10 bg-white/5" : "border-[#ede5da] bg-white/90"
              )}
            >
              <div
                className={cn(
                  "flex items-start gap-2 text-xs",
                  dnc.textPrimary(night)
                )}
              >
                <Shield className="mt-0.5 size-3.5 shrink-0 text-[#c97a5c]" aria-hidden />
                <span>
                  <span className={cn("font-medium", dnc.textPrimary(night))}>
                    Standard OAuth 2.0.
                  </span>{" "}
                  You approve scopes on Google; we never see your password.
                </span>
              </div>
              <div
                className={cn(
                  "flex items-start gap-2 text-xs",
                  dnc.textPrimary(night)
                )}
              >
                <Calendar className="mt-0.5 size-3.5 shrink-0 text-[#c97a5c]" aria-hidden />
                <span>
                  <span className={cn("font-medium", dnc.textPrimary(night))}>
                    Calendar
                  </span>{" "}
                  is available now. Add separate connections for work, personal, or shared mailboxes. Choose which account is the default for new events and future Gmail.
                </span>
              </div>
              <div
                className={cn(
                  "flex items-start gap-2 text-xs",
                  dnc.textSoft(night)
                )}
              >
                <CircleDot className="mt-0.5 size-3.5 shrink-0 text-[#c4b5a8]" aria-hidden />
                <span>Gmail, Drive, and the rest of the suite will light up here without a second sign-in flow.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={openSheetsModal}
              className={cn(
                "w-full rounded-xl border p-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[#c97a5c] focus-visible:ring-offset-2",
                night
                  ? "border-white/10 bg-white/5 hover:border-white/20"
                  : "border-[#ede5da] bg-white/90 hover:border-[#e0d0c4]"
              )}
            >
              <div className="flex items-start gap-3">
                <FileSpreadsheet className="mt-0.5 size-5 shrink-0 text-[#0f9d58]" aria-hidden />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn("text-sm font-semibold", dnc.textPrimary(night))}
                    >
                      Google Sheets
                    </span>
                    <Badge variant="default" className="bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none tracking-wide text-amber-900 border-amber-200/80">
                      <Sparkles className="mr-0.5 inline size-2.5" aria-hidden />
                      Beta
                    </Badge>
                    {googleSheetsWaitlist ? (
                      <Badge variant="default" className="px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none tracking-wide">
                        On waitlist
                      </Badge>
                    ) : null}
                  </div>
                  <p
                    className={cn("text-xs leading-relaxed", dnc.textSoft(night))}
                  >
                    Coming soon — tap for early access and the beta waitlist.
                  </p>
                </div>
              </div>
            </button>

            <div className="space-y-2">
              <p
                className={cn(
                  "text-xs font-medium uppercase tracking-wide",
                  dnc.textMuted(night)
                )}
              >
                Connected accounts
              </p>
              {googleAccounts.length === 0 ? (
                <p
                  className={cn(
                    "rounded-lg border border-dashed px-3 py-3 text-center text-xs",
                    night
                      ? "border-white/15 bg-white/5 text-[#a89e94]"
                      : "border-[#e5d9ce] bg-[#faf7f2] text-[#7a6a5a]"
                  )}
                >
                  No Google accounts yet. Connect one to sync Calendar and use your Google identities with Lofy.
                </p>
              ) : (
                <ul className="space-y-2">
                  {googleAccounts.map((a) => (
                    <li
                      key={a.credentialId}
                      className={cn(
                        "flex flex-col gap-3 rounded-xl border px-3 py-3",
                        night
                          ? "border-white/10 bg-white/5"
                          : "border-[#ede5da] bg-white"
                      )}
                    >
                      <div className="flex min-w-0 items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "flex flex-wrap items-center gap-2 text-sm font-medium",
                              dnc.textPrimary(night)
                            )}
                          >
                            <span className="min-w-0 break-words">{a.displayName || "Google account"}</span>
                            {a.isDefault ? (
                              <Badge variant="primary" className="shrink-0 px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none tracking-wide">
                                Default
                              </Badge>
                            ) : null}
                          </p>
                          {a.googleEmail ? (
                            <p
                              className={cn(
                                "mt-0.5 break-all text-xs",
                                dnc.textSoft(night)
                              )}
                            >
                              {a.googleEmail}
                            </p>
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
                            }}>
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
                          }}>
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
          <h2
            className={cn(
              "text-xs font-semibold uppercase tracking-widest",
              dnc.textMuted(night)
            )}
          >
            Messaging
          </h2>
          <Card
            className={cn(
              "overflow-hidden border",
              night
                ? "border-white/10 bg-white/5"
                : "border-[#ede5da] bg-white/80"
            )}
          >
            <CardHeader className="p-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                    night ? "border-white/10 bg-white/5" : "border bg-white"
                  )}
                >
                  {whatsappIntegration.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle
                    className={cn(
                      "truncate text-sm font-semibold",
                      night && "text-[#e8ddd4]"
                    )}
                  >
                    {whatsappIntegration.name}
                  </CardTitle>
                  {whatsappIntegration.description && (
                    <p
                      className={cn(
                        "mt-0.5 line-clamp-2 text-xs",
                        night ? "text-[#9a8f85]" : "text-muted-foreground"
                      )}
                    >
                      {whatsappIntegration.description}
                    </p>
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
        }}>
        <DialogContent
          className={cn("sm:max-w-md", night ? "border-white/10 bg-[#161922]" : "border-[#ede5da]")}
          showCloseButton={!oauthSubmitting}
        >
          <DialogHeader>
            <DialogTitle
              className={night ? "text-[#e8ddd4]" : "text-[#3d2e22]"}
            >
              Connect a Google account
            </DialogTitle>
            <DialogDescription
              className={night ? "text-[#9a8f85]" : undefined}
            >
              Choose a label you will recognize in the dashboard. You will be sent to Google to sign in and approve access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label
              htmlFor="google-account-label"
              className={cn(
                "text-xs font-medium",
                dnc.textPrimary(night)
              )}
            >
              Account label
            </label>
            <Input
              id="google-account-label"
              placeholder="e.g. Work, Personal, Shared inbox"
              value={newAccountLabel}
              onChange={(e) => setNewAccountLabel(e.target.value)}
              disabled={oauthSubmitting}
              className={night ? "border-white/10 bg-white/5" : "border-[#ede5da]"}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submitGoogleOAuth();
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setGoogleDialogOpen(false)} disabled={oauthSubmitting}>
              Cancel
            </Button>
            <Button type="button" className="gap-2" onClick={() => void submitGoogleOAuth()} disabled={oauthSubmitting}>
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

      <Dialog
        open={sheetsModalOpen}
        onOpenChange={(open) => {
          setSheetsModalOpen(open);
          if (!open) setSheetsModalView(googleSheetsWaitlist ? "pending" : "offer");
        }}>
        <DialogContent
          className={cn("sm:max-w-md", night ? "border-white/10 bg-[#161922]" : "border-[#ede5da]")}
          showCloseButton={!joinWaitlistSubmitting}
        >
          {sheetsModalView === "offer" ? (
            <>
              <DialogHeader>
                <DialogTitle
                  className={night ? "text-[#e8ddd4]" : "text-[#3d2e22]"}
                >
                  Google Sheets is in beta
                </DialogTitle>
                <DialogDescription
                  className={cn(
                    "text-pretty",
                    dnc.textSoft(night)
                  )}
                >
                  This integration is only available to beta users for now. Would you like to join our beta program and get access when we turn it on for your account?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setSheetsModalOpen(false)} disabled={joinWaitlistSubmitting} className="w-full sm:w-auto">
                  Not now
                </Button>
                <Button type="button" className="w-full gap-2 sm:w-auto" onClick={() => void joinSheetsBetaWaitlist()} disabled={joinWaitlistSubmitting}>
                  {joinWaitlistSubmitting ? (
                    <>
                      <Loader2 className="size-4 shrink-0 animate-spin" />
                      Joining…
                    </>
                  ) : (
                    "Yes, join the beta"
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle
                  className={night ? "text-[#e8ddd4]" : "text-[#3d2e22]"}
                >
                  Thanks — you are on the list
                </DialogTitle>
                <DialogDescription
                  className={cn("text-pretty", dnc.textSoft(night))}
                >
                  Your request is in our queue. Please wait while we review and approve your access. We will reach out when Google Sheets is ready for your account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" onClick={() => setSheetsModalOpen(false)} className="w-full sm:w-auto">
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
