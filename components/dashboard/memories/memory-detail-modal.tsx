"use client";

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
import { Loader2, Trash2, Calendar, Clock } from "lucide-react";

interface Memory {
  id: number;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [formData, setFormData] = useState({
    title: memory?.title || "",
    content: memory?.content || "",
  });

  // Update form data when memory changes
  useEffect(() => {
    if (memory) {
      setFormData({
        title: memory.title || "",
        content: memory.content || "",
      });
    }
  }, [memory]);

  const handleSave = async () => {
    if (!memory) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/memories/${memory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update memory");

      toast.success("Memory updated successfully");
      setIsEditing(false);
      onUpdate();
      onOpenChange(false);
    } catch (error) {
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
    } catch (error) {
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
      });
    }
    setIsEditing(false);
  };

  if (!memory) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">{isEditing ? "Edit Memory" : memory.title || "Untitled Memory"}</DialogTitle>
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
              </DialogDescription>
            )}
          </DialogHeader>

          <Separator className="my-4" />

          <div className="flex-1 overflow-y-auto space-y-4 px-1">
            {isEditing ? (
              <>
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter memory title" className="text-base" />
                </div>

                {/* Content Input */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium">
                    Content
                  </Label>
                  <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Enter memory content" rows={12} className="resize-none text-base" />
                </div>
              </>
            ) : (
              <>
                {/* Content Display */}
                <div className="prose prose-sm sm:prose max-w-none">
                  <p className="text-sm sm:text-base text-foreground whitespace-pre-wrap leading-relaxed">{memory.content}</p>
                </div>
              </>
            )}
          </div>

          <Separator className="my-4" />

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            {!isEditing && (
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)} className="w-full sm:w-auto sm:mr-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <div className="flex gap-2 w-full sm:w-auto">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving} className="flex-1 sm:flex-initial">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-initial">
                    {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-initial">
                    Close
                  </Button>
                  <Button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-initial">
                    Edit
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete your memory.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
