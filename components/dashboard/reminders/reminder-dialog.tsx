"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2 } from "lucide-react"

interface Reminder {
  id: number
  message: string
  reminder_time: string
  status: string
}

interface ReminderDialogProps {
  reminder: Reminder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function ReminderDialog({
  reminder,
  open,
  onOpenChange,
  onUpdate,
}: ReminderDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const [formData, setFormData] = useState({
    message: reminder?.message || "",
    reminder_time: reminder?.reminder_time || "",
  })

  // Update form data when reminder changes
  useEffect(() => {
    if (reminder) {
      setFormData({
        message: reminder.message,
        reminder_time: reminder.reminder_time,
      })
    }
  }, [reminder])

  // Convert UTC to local datetime string for datetime-local input
  const utcToLocal = (utcDate: string) => {
    const date = new Date(utcDate)
    const offset = date.getTimezoneOffset() * 60000
    const localDate = new Date(date.getTime() - offset)
    return localDate.toISOString().slice(0, 16)
  }

  // Convert datetime-local input to UTC ISO string
  const localToUTC = (localDateTime: string) => {
    return new Date(localDateTime).toISOString()
  }

  const handleSave = async () => {
    if (!reminder) return
    
    setIsSaving(true)
    try {
      const response = await fetch(`/api/reminder/${reminder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: formData.message,
          reminder_time: localToUTC(utcToLocal(formData.reminder_time)),
        }),
      })

      if (!response.ok) throw new Error("Failed to update reminder")

      toast.success("Reminder updated successfully")
      setIsEditing(false)
      onUpdate()
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update reminder")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!reminder) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/reminder/${reminder.id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) throw new Error("Failed to delete reminder")

      toast.success("Reminder deleted successfully")
      onUpdate()
      onOpenChange(false)
      setShowDeleteDialog(false)
    } catch (error) {
      toast.error("Failed to delete reminder")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!reminder) return null

  const isCompleted = reminder.status === "completed"

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Reminder" : "Reminder Details"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Make changes to your reminder" : "View reminder information"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              {isEditing ? (
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  disabled={isCompleted}
                />
              ) : (
                <p className="text-sm">{reminder.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reminder_time">Reminder Time</Label>
              {isEditing ? (
                <Input
                  id="reminder_time"
                  type="datetime-local"
                  value={utcToLocal(formData.reminder_time)}
                  min={(() => {
                    const now = new Date()
                    const offset = now.getTimezoneOffset() * 60000
                    const localDate = new Date(now.getTime() - offset)
                    return localDate.toISOString().slice(0, 16)
                  })()}
                  onChange={(e) => setFormData({ ...formData, reminder_time: localToUTC(e.target.value) })}
                  disabled={isCompleted}
                />
              ) : (
                <p className="text-sm">
                  {format(new Date(reminder.reminder_time), "PPP 'at' p")}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Badge 
                variant={
                  reminder.status === "pending" ? "indigo" :
                  reminder.status === "completed" ? "emerald" :
                  reminder.status === "cancelled" ? "destructive" : "default"
                }
                className="w-fit"
              >
                {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
              </Badge>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isSaving}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving || isCompleted}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} disabled={isCompleted}>
                  Edit
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the reminder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
