"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2, Send, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Sample rows so the screen reads as a finished layout; swap for real data later. */
const DEMO_FRIENDS = [
  { id: "demo-1", name: "Aisha Rahman", friendsSince: "2025-11-18T10:00:00.000Z" },
  { id: "demo-2", name: "Marcus Lee", friendsSince: "2026-01-04T14:30:00.000Z" },
  { id: "demo-3", name: "Priya N.", friendsSince: "2026-03-22T09:15:00.000Z" },
] as const;

interface PendingInvite {
  id: string;
  digitsKey: string;
  last4: string;
  createdAt: string;
}

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

export function FriendsPanel() {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = phone.trim();
    const digits = digitsOnly(trimmed);
    if (digits.length < 8) {
      toast.error("Enter a full phone number");
      return;
    }

    const dup = pendingInvites.some((p) => p.digitsKey === digits);
    if (dup) {
      toast.message("Already invited", { description: "That number is already on your pending list." });
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      const last4 = digits.slice(-4);
      const createdAt = new Date().toISOString();
      setPendingInvites((prev) => [
        {
          id: `inv-${createdAt}`,
          digitsKey: digits,
          last4,
          createdAt,
        },
        ...prev,
      ]);
      setPhone("");
      setSubmitting(false);
      toast.success("Invite queued", {
        description: `We’ll text •••• ${last4} when SMS is connected.`,
      });
    }, 550);
  };

  return (
    <div className="flex flex-col gap-6 pb-4">
      <section className="rounded-2xl border border-[#ede5da] bg-white/80 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-[#3d2e22]">Invite someone</h2>
            <p className="mt-1 text-xs leading-relaxed text-[#9a8070]">
              Add a mobile number and we’ll send them an invite to join you on Lofy. (UI preview — no
              messages are sent yet.)
            </p>
            <form onSubmit={handleInvite} className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="friend-phone" className="text-xs text-[#7a6a5a]">
                  Phone number
                </Label>
                <Input
                  id="friend-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+60 12 345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl border-[#ede5da] bg-white text-[#3d2e22] placeholder:text-[#b5a89a]"
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full rounded-xl">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send invite
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2 px-0.5">
          <Users className="h-4 w-4 text-[#7a6a5a]" />
          <h2 className="text-sm font-semibold text-[#3d2e22]">Your friends</h2>
        </div>

        {DEMO_FRIENDS.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#ede5da] bg-white/50 px-4 py-10 text-center">
            <p className="text-sm text-[#7a6a5a]">No friends yet</p>
            <p className="mt-1 text-xs text-[#9a8070]">Invite someone above to grow your circle.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {DEMO_FRIENDS.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-2xl border border-[#ede5da] bg-white/80 px-3 py-3 shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-50 to-emerald-200/90 text-sm font-semibold text-emerald-950">
                  {getInitials(f.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[#3d2e22]">{f.name?.trim() || "Lofy user"}</p>
                  <p className="text-xs text-[#9a8070]">
                    Friends since {format(new Date(f.friendsSince), "MMM d, yyyy")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {pendingInvites.length > 0 && (
        <section>
          <h2 className="mb-3 px-0.5 text-sm font-semibold text-[#3d2e22]">Pending invites</h2>
          <p className="mb-2 text-xs text-[#9a8070]">
            Numbers you added from this device. They’ll move to friends when the person joins.
          </p>
          <ul className="flex flex-col gap-2">
            {pendingInvites.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between rounded-2xl border border-[#ede5da] bg-white/60 px-3 py-2.5 text-sm"
              >
                <span className="text-[#5c4a42]">•••• {inv.last4}</span>
                <span className="text-xs text-[#9a8070]">{format(new Date(inv.createdAt), "MMM d")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
