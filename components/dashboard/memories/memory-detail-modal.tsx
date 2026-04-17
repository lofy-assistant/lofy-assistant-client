"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Copy, Loader2, Send, Trash2, Users } from "lucide-react";

interface PersonSummary {
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
  owner?: PersonSummary;
  sharedUser?: PersonSummary;
}

interface MemoryDetailModalProps {
  memory: Memory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
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
      const body = memory.accessLevel === "owned"
        ? { title: formData.title, content: formData.content }
        : { comment: formData.comment };

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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to share memory");
    } finally {
      setSharingFriendId(null);
    }
  };

  if (!memory) return null;

  const ownerName = memory.owner?.name?.trim() || "Someone in your circle";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-2xl max-h-[75vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${isOwner ? "bg-[#fff4ea] text-[#8a6544]" : "bg-[#edf8f3] text-[#2e715d]"}`}>
                {isOwner ? "Your memory" : "Shared with you"}
              </span>
              {!isOwner ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f7f6] px-2.5 py-1 text-[10px] font-medium text-[#56786b]">
                  <Users className="h-3 w-3" />
                  From {ownerName}
                </span>
              ) : null}
            </div>
            <DialogTitle className="text-xl sm:text-2xl">{isEditing ? (isOwner ? "Edit Memory" : "Edit Shared Note") : memory.title || "Untitled Memory"}</DialogTitle>
            {!isEditing && (
              <DialogDescription className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm pt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {format(new Date(memory.created_at), "MMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {format(new Date(memory.created_at), "h:mm a")}
                </span>
                {!isOwner && memory.sharedAt ? (
                  <span className="flex items-center gap-1.5">
                    <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    Shared {format(new Date(memory.sharedAt), "MMM d, yyyy")}
                  </span>
                ) : null}
              </DialogDescription>
            )}
          </DialogHeader>

          <Separator className="my-4" />

          <div className="flex-1 overflow-y-auto px-1">
            {isEditing ? (
              <div className="space-y-4">
                {isOwner ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Title
                      </Label>
                      <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Untitled Memory" className="text-base" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content" className="text-sm font-medium">
                        Content
                      </Label>
                      <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Enter your memory content here..." rows={5} className="resize-none text-sm sm:text-base leading-relaxed" />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="comment" className="text-sm font-medium">
                      Your note
                    </Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder="Add a note about why this shared memory matters to you..."
                      rows={4}
                      className="resize-none text-sm sm:text-base leading-relaxed"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Content</Label>
                    <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 gap-2">
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </Button>
                  </div>
                  <div className="prose prose-sm sm:prose max-w-none">
                    <p className="text-sm sm:text-base text-foreground whitespace-pre-wrap leading-relaxed">{memory.content}</p>
                  </div>
                </div>

                {!isOwner ? (
                  <div className="space-y-2 rounded-2xl border border-[#d8ebe3] bg-[#f7fcfa] p-4">
                    <Label className="text-sm font-medium">Your note</Label>
                    <p className="text-sm leading-relaxed text-[#517465] whitespace-pre-wrap">
                      {memory.comment?.trim() ? memory.comment : "No note added yet. You can add one to remember why this shared memory matters."}
                    </p>
                  </div>
                ) : null}

                {isOwner && sharePanelOpen ? (
                  <div className="space-y-3 rounded-2xl border border-[#e4d7ca] bg-[#fcf7f2] p-4">
                    <div>
                      <Label className="text-sm font-medium">Share with a friend</Label>
                      <p className="mt-1 text-xs leading-relaxed text-[#8d7563]">Only accepted friends can receive this memory.</p>
                    </div>

                    {friendsLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-[#9a8070]" />
                      </div>
                    ) : friends.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#dfd2c5] bg-white/70 px-4 py-4 text-sm text-[#7c6657]">
                        <p>You do not have any accepted friends yet.</p>
                        <Button asChild variant="outline" className="mt-3 h-9 rounded-xl border-[#dacbbb] bg-white/90 px-3 text-[#4a392c] hover:bg-white">
                          <Link href="/dashboard/friends">Open friends</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {friends.map((friend) => (
                          <div key={friend.id} className="flex items-center justify-between rounded-xl border border-[#eadfd3] bg-white/80 px-3 py-2.5">
                            <div>
                              <p className="text-sm font-medium text-[#3d2e22]">{friend.name?.trim() || "Unnamed friend"}</p>
                              <p className="text-xs text-[#8d7563]">Friend since {format(new Date(friend.friendsSince), "MMM d, yyyy")}</p>
                            </div>
                            <Button size="sm" onClick={() => handleShare(friend.id)} disabled={sharingFriendId === friend.id} className="rounded-xl">
                              {sharingFriendId === friend.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                              <span className="ml-2">Share</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            {!isEditing ? (
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                {isOwner ? (
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="flex-1 sm:flex-initial sm:mr-auto">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                ) : null}
                {isOwner ? (
                  <Button variant="outline" onClick={() => setSharePanelOpen((value) => !value)} className="flex-1 sm:flex-initial">
                    <Send className="h-4 w-4 mr-2" />
                    {sharePanelOpen ? "Hide Share" : "Share"}
                  </Button>
                ) : null}
                <Button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-initial">
                  {isOwner ? "Edit" : "Edit Note"}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                <Button variant="outline" onClick={handleCancel} disabled={isSaving} className="flex-1 sm:flex-initial">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-initial">
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isOwner ? "Save Changes" : "Save Note"}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete your memory.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel disabled={isDeleting} className="flex-1 sm:flex-initial mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="flex-1 sm:flex-initial bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
