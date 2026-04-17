"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookHeart, Calendar, Clock, Copy, Loader2, PencilLine, Send, Trash2, Users } from "lucide-react";

interface PersonSummary {
  id: string;
  name: string | null;
}

interface MemoryShareRecipient {
  id: string;
  name: string | null;
}

interface Friend {
  id: string;
  name: string | null;
  friendsSince: string;
}

interface FriendsResponse {
  friends: Friend[];
}

interface Memory {
  id: number;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  accessLevel: "owned" | "shared";
  shareId?: string;
  comment?: string | null;
  sharedAt?: string;
  sharedWith?: MemoryShareRecipient[];
  owner?: PersonSummary;
  sharedUser?: PersonSummary;
}

interface MemoryDetailModalProps {
  memory: Memory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

function getRecipientNames(recipients: MemoryShareRecipient[]) {
  const names = recipients.map((recipient) => recipient.name?.trim()).filter(Boolean) as string[];

  if (names.length === 0) {
    return "Shared with your circle";
  }

  if (names.length === 1) {
    return names[0];
  }

  if (names.length === 2) {
    return `${names[0]} and ${names[1]}`;
  }

  return `${names[0]}, ${names[1]}, and ${names.length - 2} more`;
}

export function MemoryDetailModal({ memory, open, onOpenChange, onUpdate }: MemoryDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sharePanelOpen, setSharePanelOpen] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sharingFriendId, setSharingFriendId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [formData, setFormData] = useState({
    title: memory?.title || "",
    content: memory?.content || "",
    comment: memory?.comment || "",
  });

  useEffect(() => {
    if (memory) {
      setFormData({
        title: memory.title || "",
        content: memory.content || "",
        comment: memory.comment || "",
      });
    }

    setIsEditing(false);
    setSharePanelOpen(false);
  }, [memory]);

  useEffect(() => {
    if (!open || !memory || memory.accessLevel !== "owned" || !sharePanelOpen || friends.length > 0) {
      return;
    }

    const fetchFriends = async () => {
      setFriendsLoading(true);

      try {
        const response = await fetch("/api/friends", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = (await response.json().catch(() => null)) as FriendsResponse | { error?: string } | null;

        if (!response.ok || !data || !("friends" in data)) {
          throw new Error(data && "error" in data && data.error ? data.error : `Failed to load friends (${response.status})`);
        }

        setFriends(data.friends);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load friends");
      } finally {
        setFriendsLoading(false);
      }
    };

    void fetchFriends();
  }, [friends.length, memory, open, sharePanelOpen]);

  const isOwner = memory?.accessLevel === "owned";

  const handleSave = async () => {
    if (!memory) return;

    setIsSaving(true);
    try {
      const body = memory.accessLevel === "owned" ? { title: formData.title, content: formData.content } : { comment: formData.comment };

      const response = await fetch(`/api/memories/${memory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to update memory");

      toast.success(memory.accessLevel === "owned" ? "Memory updated successfully" : "Note updated successfully");
      setIsEditing(false);
      onUpdate();
      onOpenChange(false);
    } catch {
      toast.error("Failed to update memory");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!memory) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/memories/${memory.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete memory");

      toast.success("Memory deleted successfully");
      setShowDeleteDialog(false);
      onUpdate();
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete memory");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (memory) {
      setFormData({
        title: memory.title || "",
        content: memory.content || "",
        comment: memory.comment || "",
      });
    }

    setIsEditing(false);
  };

  const handleCopy = async () => {
    if (!memory) return;

    try {
      await navigator.clipboard.writeText(memory.content);
      toast.success("Content copied to clipboard");
    } catch {
      toast.error("Failed to copy content");
    }
  };

  const handleShare = async (friendUserId: string) => {
    if (!memory || memory.accessLevel !== "owned") return;

    setSharingFriendId(friendUserId);

    try {
      const response = await fetch(`/api/memories/${memory.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ friend_user_id: friendUserId }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(data?.error || "Failed to share memory");
      }

      toast.success("Memory shared successfully");
      setSharePanelOpen(false);
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to share memory");
    } finally {
      setSharingFriendId(null);
    }
  };

  if (!memory) return null;

  const ownerName = memory.owner?.name?.trim() || "Someone in your circle";
  const sharedRecipients = memory.sharedWith ?? [];
  const isSharedByOwner = isOwner && sharedRecipients.length > 0;
  const modalToneClasses = isOwner
    ? "border-[#eadfd3] bg-[linear-gradient(180deg,rgba(255,252,248,0.99)_0%,rgba(250,244,238,0.98)_100%)]"
    : "border-[#d4e8df] bg-[linear-gradient(180deg,rgba(248,253,250,0.99)_0%,rgba(240,249,245,0.98)_100%)]";
  const heroToneClasses = isOwner
    ? "border-[#eadfd3] bg-[linear-gradient(145deg,rgba(255,255,255,0.96)_0%,rgba(252,244,236,0.96)_54%,rgba(247,237,226,0.92)_100%)]"
    : "border-[#d4e8df] bg-[linear-gradient(145deg,rgba(255,255,255,0.96)_0%,rgba(242,251,246,0.96)_54%,rgba(232,246,239,0.92)_100%)]";
  const badgeToneClasses = isOwner
    ? "border-[#e3d6c7] bg-[#fff8f1] text-[#8a6544]"
    : "border-[#bfded0] bg-[#edf8f3] text-[#2e715d]";
  const sectionToneClasses = isOwner
    ? "border-[#eadfd3] bg-white/78"
    : "border-[#d6ebe2] bg-white/82";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`grid h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-[2rem] border p-0 shadow-[0_28px_80px_rgba(74,55,37,0.18)] sm:h-[min(92dvh,960px)] sm:w-[min(96vw,1180px)] ${modalToneClasses}`}>
          <DialogHeader className="border-b border-white/45 bg-white/30 px-4 py-4 text-left backdrop-blur-sm sm:px-5 sm:py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${badgeToneClasses}`}>
                    {isOwner ? "Your memory" : "Shared with you"}
                  </span>
                  {!isOwner ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-[#56786b] shadow-sm">
                      <Users className="h-3 w-3" />
                      From {ownerName}
                    </span>
                  ) : null}
                  {isSharedByOwner ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f2fbf7] px-2.5 py-1 text-[10px] font-medium text-[#4d786a] shadow-sm">
                      <Send className="h-3 w-3" />
                      Shared to {sharedRecipients.length} {sharedRecipients.length === 1 ? "friend" : "friends"}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <DialogTitle className="max-w-4xl text-[1.6rem] font-semibold tracking-[-0.03em] text-[#3d2e22] sm:text-[2rem] lg:text-[2.3rem]">
                    {isEditing ? (isOwner ? "Edit Memory" : "Edit Shared Note") : memory.title || "Untitled Memory"}
                  </DialogTitle>
                  <DialogDescription className="max-w-3xl text-sm leading-relaxed text-[#8d7563] sm:text-[15px]">
                    {isEditing
                      ? isOwner
                        ? "Refine the details, keep the language clear, and save the version you want to revisit later."
                        : "Update your note so this shared memory stays useful when you come back to it later."
                      : isOwner
                        ? "A larger reading surface for reviewing, editing, and sharing without squeezing the memory into a small dialog."
                        : "A shared memory presented with enough room to read the original note and keep your own context beside it."}
                  </DialogDescription>
                </div>
              </div>

              <div className={`w-full max-w-[22rem] rounded-[1.5rem] border p-4 shadow-[0_14px_30px_rgba(76,57,39,0.08)] ${heroToneClasses}`}>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-[1.1rem] border border-white/70 bg-white/78 px-3.5 py-3 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f7866]">Created</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#4b392c]">
                      <Calendar className="h-3.5 w-3.5 text-[#aa7b53]" />
                      {format(new Date(memory.created_at), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/70 bg-white/78 px-3.5 py-3 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f7866]">Time</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#4b392c]">
                      <Clock className="h-3.5 w-3.5 text-[#aa7b53]" />
                      {format(new Date(memory.created_at), "h:mm a")}
                    </div>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/70 bg-white/78 px-3.5 py-3 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f7866]">Status</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#4b392c]">
                      {isOwner ? <BookHeart className="h-3.5 w-3.5 text-[#aa7b53]" /> : <Users className="h-3.5 w-3.5 text-[#3d8a73]" />}
                      {isOwner ? (isSharedByOwner ? `Shared with ${sharedRecipients.length}` : "Private memory") : memory.sharedAt ? `Shared ${format(new Date(memory.sharedAt), "MMM d")}` : "Shared memory"}
                    </div>
                  </div>
                </div>

                {isSharedByOwner ? (
                  <div className="mt-3 rounded-[1.2rem] border border-[#d8ebe3] bg-[#f7fcfa] px-4 py-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b8d81]">Currently shared with</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#426a5b]">{getRecipientNames(sharedRecipients)}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </DialogHeader>

          <div className="min-h-0 overflow-hidden px-4 py-4 sm:px-5 sm:py-5">
            <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="hidden min-h-0 overflow-y-auto rounded-[1.75rem] border border-[#e8ddd1] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(252,246,241,0.94)_100%)] p-4 shadow-[0_14px_28px_rgba(76,57,39,0.06)] lg:block">
                <div className="space-y-4">
                  <div className="rounded-[1.35rem] border border-[#eadfd3] bg-white/78 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f7866]">Overview</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#5c493b]">
                      {isOwner
                        ? "Use the main panel to read or edit the full memory without compressing the text into a narrow card."
                        : "Keep the original memory visible at full width while maintaining your personal note beside it."}
                    </p>
                  </div>

                  {!isOwner ? (
                    <div className="rounded-[1.35rem] border border-[#d8ebe3] bg-[#f7fcfa] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b8d81]">Shared by</p>
                      <p className="mt-2 text-base font-medium text-[#214538]">{ownerName}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#5f7c72]">
                        Review the memory in full, then add context in your note when you need to remember why it matters.
                      </p>
                    </div>
                  ) : null}

                  {isOwner ? (
                    <div className="rounded-[1.35rem] border border-[#eadfd3] bg-white/78 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f7866]">Sharing</p>
                      <p className="mt-2 text-sm leading-relaxed text-[#5c493b]">
                        {isSharedByOwner
                          ? `This memory is already shared with ${getRecipientNames(sharedRecipients)}.`
                          : "This memory is private right now. Open sharing from the footer when you want to send it to a friend."}
                      </p>
                    </div>
                  ) : null}
                </div>
              </aside>

              <div className="min-h-0 overflow-y-auto pr-1">
                {isEditing ? (
                  <div className="space-y-4">
                    {isOwner ? (
                      <div className={`space-y-4 rounded-[1.75rem] border p-5 shadow-sm ${sectionToneClasses}`}>
                        <div className="flex items-center gap-2">
                          <PencilLine className="h-4 w-4 text-[#aa7b53]" />
                          <div>
                            <p className="text-sm font-semibold text-[#3d2e22]">Edit memory</p>
                            <p className="text-xs text-[#8d7563]">Large fields, better spacing, and enough room to work through longer notes.</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-sm font-medium text-[#5b483a]">
                            Title
                          </Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Untitled Memory"
                            className="h-12 rounded-2xl border-[#eadfd3] bg-white/90 text-base shadow-sm placeholder:text-[#b49f90]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="content" className="text-sm font-medium text-[#5b483a]">
                            Content
                          </Label>
                          <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Enter your memory content here..."
                            rows={14}
                            className="min-h-[46dvh] resize-none rounded-[1.5rem] border-[#eadfd3] bg-white/92 px-5 py-4 text-sm leading-relaxed shadow-sm placeholder:text-[#b49f90] sm:text-base"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                        <section className="space-y-3 rounded-[1.75rem] border border-[#d6ebe2] bg-white/82 p-5 shadow-sm">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b8d81]">Original memory</p>
                            <p className="mt-1 text-sm font-medium text-[#214538]">Full note from {ownerName}</p>
                          </div>
                          <div className="rounded-[1.35rem] border border-[#d9ebe3] bg-white/90 px-4 py-4">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#517465] sm:text-[15px]">{memory.content}</p>
                          </div>
                        </section>

                        <div className={`space-y-4 rounded-[1.75rem] border p-5 shadow-sm ${sectionToneClasses}`}>
                          <div className="flex items-center gap-2">
                            <PencilLine className="h-4 w-4 text-[#3d8a73]" />
                            <div>
                              <p className="text-sm font-semibold text-[#214538]">Edit your note</p>
                              <p className="text-xs text-[#6c8b80]">Capture why this shared memory matters to you.</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="comment" className="text-sm font-medium text-[#4a6d61]">
                              Your note
                            </Label>
                            <Textarea
                              id="comment"
                              value={formData.comment}
                              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                              placeholder="Add a note about why this shared memory matters to you..."
                              rows={12}
                              className="min-h-[38dvh] resize-none rounded-[1.5rem] border-[#d4e8df] bg-white/92 px-5 py-4 text-sm leading-relaxed shadow-sm placeholder:text-[#8eb0a3] sm:text-base"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <section className={`space-y-4 rounded-[1.75rem] border p-5 shadow-sm ${sectionToneClasses}`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f7866]">Memory content</p>
                          <p className="mt-1 text-base font-medium text-[#3d2e22]">Full note</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleCopy} className="h-10 rounded-xl border-[#dbcfc3] bg-white/90 px-3 text-[#5b483a] hover:bg-white">
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </Button>
                      </div>
                      <div className="rounded-[1.5rem] border border-[#eee3d8] bg-white/90 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                        <p className="whitespace-pre-wrap text-sm leading-7 text-[#5b483a] sm:text-[15px]">{memory.content}</p>
                      </div>
                    </section>

                    {!isOwner ? (
                      <section className="space-y-3 rounded-[1.75rem] border border-[#d8ebe3] bg-[#f7fcfa] p-5 shadow-sm">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b8d81]">Your note</p>
                          <p className="mt-1 text-base font-medium text-[#214538]">Why it matters</p>
                        </div>
                        <div className="rounded-[1.4rem] border border-[#d9ebe3] bg-white/86 px-5 py-5">
                          <p className="whitespace-pre-wrap text-sm leading-7 text-[#517465] sm:text-[15px]">
                            {memory.comment?.trim() ? memory.comment : "No note added yet. You can add one to remember why this shared memory matters."}
                          </p>
                        </div>
                      </section>
                    ) : null}

                    {isOwner && sharePanelOpen ? (
                      <section className="space-y-3 rounded-[1.75rem] border border-[#e4d7ca] bg-[#fcf7f2] p-5 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f7866]">Share this memory</p>
                            <p className="mt-1 text-base font-medium text-[#3d2e22]">Send it to a friend in your circle</p>
                            <p className="mt-1 text-sm leading-relaxed text-[#8d7563]">Only accepted friends can receive this memory.</p>
                          </div>
                          <div className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium text-[#8a6544] shadow-sm">
                            {friends.length} available
                          </div>
                        </div>

                        {friendsLoading ? (
                          <div className="flex items-center justify-center rounded-[1.3rem] border border-dashed border-[#dfd2c5] bg-white/70 py-10">
                            <Loader2 className="h-5 w-5 animate-spin text-[#9a8070]" />
                          </div>
                        ) : friends.length === 0 ? (
                          <div className="rounded-[1.3rem] border border-dashed border-[#dfd2c5] bg-white/75 px-4 py-5 text-sm text-[#7c6657]">
                            <p>You do not have any accepted friends yet.</p>
                            <Button asChild variant="outline" className="mt-3 h-9 rounded-xl border-[#dacbbb] bg-white/90 px-3 text-[#4a392c] hover:bg-white">
                              <Link href="/dashboard/friends">Open friends</Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="grid gap-2 xl:grid-cols-2">
                            {friends.map((friend) => {
                              const alreadyShared = sharedRecipients.some((recipient) => recipient.id === friend.id);

                              return (
                                <div key={friend.id} className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-[#eadfd3] bg-white/88 px-3.5 py-3 shadow-sm">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-[#3d2e22]">{friend.name?.trim() || "Unnamed friend"}</p>
                                    <p className="mt-1 text-xs text-[#8d7563]">Friend since {format(new Date(friend.friendsSince), "MMM d, yyyy")}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {alreadyShared ? (
                                      <span className="rounded-full bg-[#edf8f3] px-2.5 py-1 text-[10px] font-medium text-[#2e715d]">Shared</span>
                                    ) : null}
                                    <Button size="sm" onClick={() => handleShare(friend.id)} disabled={sharingFriendId === friend.id} className="h-9 rounded-xl px-3">
                                      {sharingFriendId === friend.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                                      <span className="ml-2">{alreadyShared ? "Share again" : "Share"}</span>
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-[#eadfd3] bg-white/72 px-4 py-4 backdrop-blur-sm sm:px-5">
            <DialogFooter className="gap-2 sm:items-center sm:justify-between">
              {!isEditing ? (
                <>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    {isOwner ? (
                      <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="h-10 rounded-xl sm:mr-auto">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    ) : null}
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    {isOwner ? (
                      <Button variant="outline" onClick={() => setSharePanelOpen((value) => !value)} className="h-10 rounded-xl border-[#dacbbb] bg-white/90 text-[#4a392c] hover:bg-white">
                        <Send className="mr-2 h-4 w-4" />
                        {sharePanelOpen ? "Hide share" : "Share memory"}
                      </Button>
                    ) : null}
                    <Button onClick={() => setIsEditing(true)} className="h-10 rounded-xl px-4">
                      <PencilLine className="mr-2 h-4 w-4" />
                      {isOwner ? "Edit memory" : "Edit note"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row">
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving} className="h-10 rounded-xl border-[#dacbbb] bg-white/90 text-[#4a392c] hover:bg-white">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="h-10 rounded-xl px-4">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isOwner ? "Save changes" : "Save note"}
                  </Button>
                </div>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md rounded-[1.5rem] border border-[#eadfd3] bg-[linear-gradient(180deg,rgba(255,252,248,0.99)_0%,rgba(250,244,238,0.98)_100%)] shadow-[0_22px_70px_rgba(74,55,37,0.18)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#3d2e22]">Delete this memory?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8d7563]">This action cannot be undone. The memory will be removed from your library permanently.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 flex-row gap-2 border-t border-[#eadfd3] bg-[#fffaf5]/70">
            <AlertDialogCancel disabled={isDeleting} className="mt-0 flex-1 rounded-xl border-[#dacbbb] bg-white/90 text-[#4a392c] hover:bg-white sm:flex-initial">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:flex-initial">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
