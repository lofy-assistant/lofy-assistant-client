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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";

interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  recurrence?: string | null;
}

/** Extract FREQ= value from RRULE string (e.g. "FREQ=WEEKLY;BYDAY=FR" -> "WEEKLY"). */
function parseRecurrenceFreq(r: string | null | undefined): string | null {
  if (!r) return null;
  const s = r.replace(/^RRULE:/i, "");
  const match = s.match(/FREQ=([A-Za-z]+)/);
  return match ? match[1].toUpperCase() : null;
}

function recurrenceForSelect(r: string | null | undefined): string {
  const freq = parseRecurrenceFreq(r);
  if (!freq) return "none";
  return `RRULE:FREQ=${freq}`;
}

function recurrenceLabel(r: string | null | undefined): string {
  const freq = parseRecurrenceFreq(r);
  if (!freq) return "No recurrence";
  const labels: Record<string, string> = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
  };
  return labels[freq] ?? r;
}

interface CalendarEventDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function CalendarEventDialog({ event, open, onOpenChange, onUpdate }: CalendarEventDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    start_time: event?.start_time || "",
    end_time: event?.end_time || "",
    recurrence: recurrenceForSelect(event?.recurrence),
  });

  // Update form data when event changes
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        start_time: event.start_time,
        end_time: event.end_time,
        recurrence: recurrenceForSelect(event.recurrence),
      });
    }
  }, [event]);

  const handleSave = async () => {
    if (!event) return;

    setIsSaving(true);
    try {
      const recurrenceValue = formData.recurrence === "none" ? null : formData.recurrence;
      const response = await fetch(`/api/calendar/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          recurrence: recurrenceValue,
        }),
      });

      if (!response.ok) throw new Error("Failed to update event");

      toast.success("Event updated successfully");
      setIsEditing(false);
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update event");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/calendar/${event.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      toast.success("Event deleted successfully");
      onUpdate();
      onOpenChange(false);
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!event) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Event" : "Event Details"}</DialogTitle>
            <DialogDescription>{isEditing ? "Make changes to your event" : "View event information"}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              {isEditing ? <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /> : <p className="text-sm">{event.title}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              {isEditing ? <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /> : <p className="text-sm text-muted-foreground">{event.description || "No description"}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_time">Start Time</Label>
                {isEditing ? (
                  <Input id="start_time" type="datetime-local" value={format(new Date(formData.start_time), "yyyy-MM-dd'T'HH:mm")} onChange={(e) => setFormData({ ...formData, start_time: new Date(e.target.value).toISOString() })} />
                ) : (
                  <p className="text-sm">{format(new Date(event.start_time), "PPP 'at' p")}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_time">End Time</Label>
                {isEditing ? (
                  <Input id="end_time" type="datetime-local" value={format(new Date(formData.end_time), "yyyy-MM-dd'T'HH:mm")} onChange={(e) => setFormData({ ...formData, end_time: new Date(e.target.value).toISOString() })} />
                ) : (
                  <p className="text-sm">{format(new Date(event.end_time), "PPP 'at' p")}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recurrence">Recurrence</Label>
              {isEditing ? (
                <Select value={formData.recurrence} onValueChange={(value) => setFormData({ ...formData, recurrence: value })}>
                  <SelectTrigger id="recurrence">
                    <SelectValue placeholder="No recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No recurrence</SelectItem>
                    <SelectItem value="RRULE:FREQ=DAILY">Daily</SelectItem>
                    <SelectItem value="RRULE:FREQ=WEEKLY">Weekly</SelectItem>
                    <SelectItem value="RRULE:FREQ=MONTHLY">Monthly</SelectItem>
                    <SelectItem value="RRULE:FREQ=YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground">{recurrenceLabel(event.recurrence)}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            {!isEditing ? (
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)} className="flex-1 sm:flex-initial sm:mr-auto">
                  Delete
                </Button>
                <Button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-initial">
                  Edit
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving} className="flex-1 sm:flex-initial">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-initial">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
              {/* "{event?.title}". */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel disabled={isDeleting} className="flex-1 sm:flex-initial mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="flex-1 sm:flex-initial bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
