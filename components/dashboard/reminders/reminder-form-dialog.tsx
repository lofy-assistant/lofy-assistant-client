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

interface ReminderFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function ReminderFormDialog({
  open,
  onOpenChange,
  onClose,
}: ReminderFormDialogProps) {
  const [formData, setFormData] = useState({
    message: "",
    reminder_time: "",
  })
  const [loading, setLoading] = useState(false)

  // Convert datetime-local input to UTC ISO string
  const localToUTC = (localDateTime: string) => {
    return new Date(localDateTime).toISOString()
  }

  useEffect(() => {
    if (open) {
      // Default to current date/time for new reminders
      const now = new Date()
      const offset = now.getTimezoneOffset() * 60000
      const localDate = new Date(now.getTime() - offset)
      setFormData({
        message: "",
        reminder_time: localDate.toISOString().slice(0, 16),
      })
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Reminder</DialogTitle>
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
              placeholder="Enter reminder message"
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

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}