"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, Send, UserPlus, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PhoneNumberInput } from "@/components/phone-number-input";
import { Form } from "@/components/ui/form";

interface Friend {
  id: string;
  name: string | null;
  friendsSince: string;
}

interface PendingInvite {
  id: string;
  last4: string;
  createdAt: string;
  expiresAt: string;
  inviteeUserId: string | null;
}

interface FriendsResponse {
  friends: Friend[];
  pendingInvites: PendingInvite[];
}

interface FriendInviteFormValues {
  dialCode: string;
  phoneNumber: string;
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
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FriendInviteFormValues>({
    defaultValues: {
      dialCode: "60",
      phoneNumber: "",
    },
  });
  const phoneNumber = form.watch("phoneNumber");

  const fetchFriends = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/friends", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = (await response.json().catch(() => null)) as FriendsResponse | { error?: string } | null;

      if (!response.ok || !data || !("friends" in data) || !("pendingInvites" in data)) {
        const message = data && "error" in data && data.error ? data.error : `Failed to load friends (${response.status})`;
        throw new Error(message);
      }

      setFriends(data.friends);
      setPendingInvites(data.pendingInvites);
    } catch (fetchError) {
      console.error("Error fetching friends:", fetchError);
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchFriends();
  }, []);

  const handleInvite = async (values: FriendInviteFormValues) => {
    const digits = digitsOnly(values.phoneNumber);

    if (digits.length < 8) {
      toast.error("Enter a full phone number");
      return;
    }

    const trimmed = `+${values.dialCode}${digits}`;

    setSubmitting(true);

    try {
      const response = await fetch("/api/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ phone_number: trimmed }),
      });

      const data = (await response.json().catch(() => null)) as
        | { already_exists?: boolean; message_sent?: boolean; warning?: string }
        | { error?: string }
        | null;

      if (!response.ok) {
        const message = data && "error" in data && data.error ? data.error : "Failed to send invite";
        throw new Error(message);
      }

      form.reset({
        dialCode: values.dialCode,
        phoneNumber: "",
      });

      await fetchFriends();

      const alreadyExists = Boolean(data && "already_exists" in data && data.already_exists);
      const messageSent = Boolean(data && "message_sent" in data && data.message_sent);
      const warning = data && "warning" in data ? data.warning : undefined;

      toast.success(alreadyExists ? "Invite already pending" : "Friend request sent", {
        description: alreadyExists
          ? "That phone number already has an active invite."
          : warning
            ? `${warning} The pending invite is still saved.`
            : messageSent
              ? "The invite was sent on WhatsApp."
              : `The invite was created for •••• ${digits.slice(-4)}.`,
      });
    } catch (submitError) {
      console.error("Error sending friend invite:", submitError);
      toast.error(submitError instanceof Error ? submitError.message : "Failed to send invite");
    } finally {
      setSubmitting(false);
    }
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
              Add a mobile number and we’ll send them an invite to join you on Lofy.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleInvite)} className="mt-4 space-y-3">
                <PhoneNumberInput
                  control={form.control}
                  dialCodeName="dialCode"
                  phoneNumberName="phoneNumber"
                  label="Phone number"
                  phonePlaceholder="123456789"
                  disabled={submitting}
                />
                <Button type="submit" disabled={submitting || !phoneNumber?.trim()} className="w-full rounded-xl">
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
            </Form>
          </div>
        </div>
      </section>

      {error && (
        <section className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700">
          {error}
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center gap-2 px-0.5">
          <Users className="h-4 w-4 text-[#7a6a5a]" />
          <h2 className="text-sm font-semibold text-[#3d2e22]">Your friends</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-[#ede5da] bg-white/60 px-4 py-10">
            <Loader2 className="h-5 w-5 animate-spin text-[#9a8070]" />
          </div>
        ) : friends.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#ede5da] bg-white/50 px-4 py-10 text-center">
            <p className="text-sm text-[#7a6a5a]">No friends yet</p>
            <p className="mt-1 text-xs text-[#9a8070]">Invite someone above to grow your circle.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {friends.map((friend) => (
              <li
                key={friend.id}
                className="flex items-center gap-3 rounded-2xl border border-[#ede5da] bg-white/80 px-3 py-3 shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-50 to-emerald-200/90 text-sm font-semibold text-emerald-950">
                  {getInitials(friend.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[#3d2e22]">{friend.name?.trim() || "Lofy user"}</p>
                  <p className="text-xs text-[#9a8070]">
                    Friends since {format(new Date(friend.friendsSince), "MMM d, yyyy")}
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
            Active invites you have already sent. They move to friends after the person accepts.
          </p>
          <ul className="flex flex-col gap-2">
            {pendingInvites.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between rounded-2xl border border-[#ede5da] bg-white/60 px-3 py-2.5 text-sm"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5c4a42]">•••• {inv.last4 || "----"}</span>
                  <span className="text-[11px] text-[#9a8070]">
                    Sent {format(new Date(inv.createdAt), "MMM d")} • Expires {format(new Date(inv.expiresAt), "MMM d")}
                  </span>
                </div>
                <span className="text-xs text-[#9a8070]">Pending</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
