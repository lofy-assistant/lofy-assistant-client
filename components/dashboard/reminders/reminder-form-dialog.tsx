"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Reminder {
  id: number
  message: string
  reminder_time: string
  status: string
}

interface ReminderFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  reminder?: Reminder | null
}

export function ReminderFormDialog({
  open,
  onOpenChange,
  onClose,
  reminder,
}: ReminderFormDialogProps) {
  const [formData, setFormData] = useState({
    message: "",
    reminder_time: "",
    status: "pending",
  })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  useEffect(() => {
    if (reminder) {
      setFormData({
        message: reminder.message,
        reminder_time: utcToLocal(reminder.reminder_time),
        status: reminder.status,
      })
    } else {
      // Default to current date/time for new reminders
      const now = new Date()
      const offset = now.getTimezoneOffset() * 60000
      const localDate = new Date(now.getTime() - offset)
      setFormData({
        message: "",
        reminder_time: localDate.toISOString().slice(0, 16),
        status: "pending",
      })
    }
  }, [reminder])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = reminder ? `/api/reminder/${reminder.id}` : "/api/reminder"
      const method = reminder ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: formData.message,
          reminder_time: localToUTC(formData.reminder_time),
        }),
      })

      if (response.ok) {
        onClose()
      } else {
        console.error("Failed to save reminder")
      }
    } catch (error) {
      console.error("Error saving reminder:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!reminder) return
    
    if (!confirm("Are you sure you want to delete this reminder?")) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(`/api/reminder/${reminder.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        onClose()
      } else {
        console.error("Failed to delete reminder")
      }
    } catch (error) {
      console.error("Error deleting reminder:", error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {reminder ? "Edit Reminder" : "Create New Reminder"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              rows={3}
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
              onChange={(e) =>
                setFormData({ ...formData, reminder_time: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <div className="flex items-center h-10">
              <Badge variant={
                formData.status === "completed" ? "default" :
                formData.status === "cancelled" ? "destructive" :
                "secondary"
              }>
                {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            {reminder && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting || loading}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading || deleting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || deleting}>
                {loading ? "Saving..." : reminder ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
