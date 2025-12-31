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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

  useEffect(() => {
    if (reminder) {
      setFormData({
        message: reminder.message,
        reminder_time: new Date(reminder.reminder_time)
          .toISOString()
          .slice(0, 16),
        status: reminder.status,
      })
    } else {
      setFormData({
        message: "",
        reminder_time: "",
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
          ...formData,
          reminder_time: new Date(formData.reminder_time).toISOString(),
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
              onChange={(e) =>
                setFormData({ ...formData, reminder_time: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : reminder ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
