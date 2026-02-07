"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface Reminder {
  id: number
  message: string
  reminder_time: string
  status: string
}

interface FormData {
  message: string
  reminder_time: string
}

function utcToLocal(utcDate: string) {
  const date = new Date(utcDate)
  const offset = date.getTimezoneOffset() * 60000
  const localDate = new Date(date.getTime() - offset)
  return localDate.toISOString().slice(0, 16)
}

function localToUTC(localDateTime: string) {
  return new Date(localDateTime).toISOString()
}

function getDefaultFormData(): FormData {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  const localDate = new Date(now.getTime() - offset)
  return {
    message: "",
    reminder_time: localDate.toISOString().slice(0, 16),
  }
}

// Shared form fields
function ReminderFormFields({ formData, onChange, disabled }: { formData: FormData; onChange: (f: FormData) => void; disabled?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => onChange({ ...formData, message: e.target.value })}
          rows={3}
          disabled={disabled}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reminder_time">Reminder Time</Label>
        <Input
          id="reminder_time"
          type="datetime-local"
          value={formData.reminder_time}
          min={(() => {
            const now = new Date()
            const offset = now.getTimezoneOffset() * 60000
            const localDate = new Date(now.getTime() - offset)
            return localDate.toISOString().slice(0, 16)
          })()}
          onChange={(e) => onChange({ ...formData, reminder_time: e.target.value })}
          disabled={disabled}
          required
        />
      </div>
    </div>
  )
}

// Add dialog
export function ReminderAddDialog({ open, onOpenChange, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState<FormData>(getDefaultFormData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) setFormData(getDefaultFormData())
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: formData.message,
          reminder_time: localToUTC(formData.reminder_time),
        }),
      })

      if (response.ok) {
        toast.success("Reminder created successfully")
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error("Failed to create reminder")
      }
    } catch (err) {
      console.error("Error creating reminder:", err)
      toast.error("Failed to create reminder")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Reminder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ReminderFormFields formData={formData} onChange={setFormData} disabled={loading} />
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Edit/Delete dialog
export function ReminderEditDialog({ reminder, open, onOpenChange, onSuccess }: { reminder: Reminder | null; open: boolean; onOpenChange: (open: boolean) => void; onSuccess: () => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>(getDefaultFormData)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (reminder) {
      setFormData({ message: reminder.message, reminder_time: utcToLocal(reminder.reminder_time) })
      setIsEditing(false)
    }
  }, [reminder])

  if (!reminder) return null

  const isCompleted = reminder.status === "completed"

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/reminder/${reminder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: formData.message, reminder_time: localToUTC(formData.reminder_time) }),
      })

      if (response.ok) {
        toast.success("Reminder updated successfully")
        setIsEditing(false)
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error("Failed to update reminder")
      }
    } catch (err) {
      console.error("Error updating reminder:", err)
      toast.error("Failed to update reminder")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/reminder/${reminder.id}`, { method: "DELETE", credentials: "include" })
      if (response.ok) {
        toast.success("Reminder deleted successfully")
        onSuccess()
        onOpenChange(false)
        setShowDeleteDialog(false)
      } else {
        toast.error("Failed to delete reminder")
      }
    } catch (err) {
      console.error("Error deleting reminder:", err)
      toast.error("Failed to delete reminder")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Reminder" : "Reminder Details"}</DialogTitle>
            <DialogDescription>{isEditing ? "Make changes to your reminder" : "View reminder information"}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {isEditing ? (
              <ReminderFormFields formData={formData} onChange={setFormData} disabled={isSaving || isCompleted} />
            ) : (
              <div className="grid gap-2">
                <Label>Message</Label>
                <p className="text-sm">{reminder.message}</p>
                <Label>Reminder Time</Label>
                <p className="text-sm">{format(new Date(reminder.reminder_time), "PPP 'at' p")}</p>
                <Label>Status</Label>
                <p className="text-sm">{reminder.status}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            {!isEditing ? (
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="flex-1 sm:flex-initial sm:mr-auto">
                  Delete
                </Button>
                <Button onClick={() => setIsEditing(true)} disabled={isCompleted} className="flex-1 sm:flex-initial">
                  Edit
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={() => { if (reminder) { setFormData({ message: reminder.message, reminder_time: utcToLocal(reminder.reminder_time) }) } setIsEditing(false) }} disabled={isSaving} className="flex-1 sm:flex-initial">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving || isCompleted} className="flex-1 sm:flex-initial">
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
            <p className="text-sm">This action cannot be undone. This will permanently delete the reminder.</p>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel disabled={isDeleting} className="flex-1 sm:flex-initial mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="flex-1 sm:flex-initial bg-destructive text-destructive-foreground hover:bg-destructive/90">{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
