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
import { BookHeart, Calendar, Copy, Loader2, PencilLine, Send, Trash2, Users } from "lucide-react";

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
        <DialogContent className={`flex h-[min(100dvh,52rem)] w-[min(100vw,26rem)] max-w-none flex-col overflow-hidden rounded-none border-0 p-0 shadow-none md:h-[90dvh] md:rounded-[2rem] md:border md:shadow-[0_28px_80px_rgba(74,55,37,0.18)] ${modalToneClasses}`}>
          <DialogHeader className="gap-4 border-b border-white/45 bg-white/35 px-4 pb-4 pt-5 text-left backdrop-blur-sm">
            <div className={`rounded-[1.6rem] border p-4 shadow-[0_14px_34px_rgba(76,57,39,0.08)] ${heroToneClasses}`}>
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
              </div>

              <div className="mt-3 space-y-2">
                <DialogTitle className="text-base font-semibold tracking-[-0.03em] text-[#3d2e22]">
                  {isEditing ? (isOwner ? "Edit Memory" : "Edit Shared Note") : memory.title || "Untitled Memory"}
                </DialogTitle>
                {isEditing ? (
                  <DialogDescription className="text-sm leading-relaxed text-[#8d7563]">
                    {isOwner ? "Update the title and memory text in one simple editor." : "Update your personal note for this shared memory."}
                  </DialogDescription>
                ) : null}
              </div>

              {isSharedByOwner ? (
                <div className="mt-3 rounded-[1.2rem] border border-[#d8ebe3] bg-[#f7fcfa] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b8d81]">Shared with</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#426a5b]">{getRecipientNames(sharedRecipients)}</p>
                </div>
              ) : null}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {isEditing ? (
              <div className="space-y-4">
                {isOwner ? (
                  <section className={`space-y-4 rounded-[1.6rem] border p-4 shadow-sm ${sectionToneClasses}`}>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#3d2e22]">Edit memory</p>
                      <p className="text-xs text-[#8d7563]">Keep the memory clear and easy to skim.</p>
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
                        rows={12}
                        className="min-h-[18rem] resize-none rounded-[1.4rem] border-[#eadfd3] bg-white/92 px-4 py-3 text-sm leading-relaxed shadow-sm placeholder:text-[#b49f90]"
                      />
                    </div>
                  </section>
                ) : (
                  <>
                    <section className="space-y-3 rounded-[1.6rem] border border-[#d8ebe3] bg-white/82 p-4 shadow-sm">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b8d81]">Original memory</p>
                        <p className="mt-1 text-sm font-medium text-[#214538]">From {ownerName}</p>
                      </div>
                      <div className="rounded-[1.3rem] border border-[#d9ebe3] bg-white/90 px-4 py-4">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#517465]">{memory.content}</p>
                      </div>
                    </section>

                    <section className={`space-y-4 rounded-[1.6rem] border p-4 shadow-sm ${sectionToneClasses}`}>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-[#214538]">Edit your note</p>
                        <p className="text-xs text-[#6c8b80]">Keep your context beside the shared memory.</p>
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
                          rows={10}
                          className="min-h-[16rem] resize-none rounded-[1.4rem] border-[#d4e8df] bg-white/92 px-4 py-3 text-sm leading-relaxed shadow-sm placeholder:text-[#8eb0a3]"
                        />
                      </div>
                    </section>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <section className={`space-y-4 rounded-[1.6rem] border p-4 shadow-sm ${sectionToneClasses}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f7866]">Memory content</p>
                      <p className="mt-1 text-sm font-medium text-[#3d2e22]">Full note</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCopy} className="h-9 rounded-xl border-[#dbcfc3] bg-white/90 px-3 text-[#5b483a] hover:bg-white">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="rounded-[1.35rem] border border-[#eee3d8] bg-white/90 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#5b483a]">{memory.content}</p>
                  </div>
                </section>

                {!isOwner ? (
                  <section className="space-y-3 rounded-[1.6rem] border border-[#d8ebe3] bg-[#f7fcfa] p-4 shadow-sm">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b8d81]">Your note</p>
                      <p className="mt-1 text-sm font-medium text-[#214538]">Why it matters</p>
                    </div>
                    <div className="rounded-[1.3rem] border border-[#d9ebe3] bg-white/86 px-4 py-4">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-[#517465]">
                        {memory.comment?.trim() ? memory.comment : "No note added yet. You can add one to remember why this shared memory matters."}
                      </p>
                    </div>
                  </section>
                ) : null}

                {isOwner && sharePanelOpen ? (
                  <section className="space-y-3 rounded-[1.6rem] border border-[#e4d7ca] bg-[#fcf7f2] p-4 shadow-sm">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f7866]">Share this memory</p>
                      <p className="mt-1 text-sm font-medium text-[#3d2e22]">Send it to a friend in your circle</p>
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
                      <div className="space-y-2">
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

          <div className="border-t border-[#eadfd3] bg-white/72 px-4 py-4 backdrop-blur-sm">
            <DialogFooter className="items-center gap-2">
              {!isEditing ? (
                <div className="flex w-full flex-col items-center gap-2">
                  <Button onClick={() => setIsEditing(true)} className="h-10 w-full rounded-xl px-4 text-sm">
                    <PencilLine className="mr-2 h-4 w-4" />
                    {isOwner ? "Edit memory" : "Edit note"}
                  </Button>
                  {isOwner ? (
                    <div className="grid w-full grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => setSharePanelOpen((value) => !value)} className="h-10 w-full rounded-xl border-[#dacbbb] bg-white/90 text-sm text-[#4a392c] hover:bg-white">
                        <Send className="mr-2 h-4 w-4" />
                        {sharePanelOpen ? "Hide share" : "Share memory"}
                      </Button>
                      <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="h-10 w-full rounded-xl text-sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <>
                  <Button onClick={handleSave} disabled={isSaving} className="h-10 w-3/4 rounded-xl px-4 text-sm">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isOwner ? "Save changes" : "Save note"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving} className="h-10 w-3/4 rounded-xl border-[#dacbbb] bg-white/90 text-sm text-[#4a392c] hover:bg-white">
                    Cancel
                  </Button>
                </>
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
