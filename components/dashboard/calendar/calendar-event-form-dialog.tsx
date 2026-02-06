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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CalendarEvent {
  id: number
  title: string
  description: string | null
  start_time: string
  end_time: string
  timezone: string
  is_all_day: boolean
  recurrence: string | null
}

interface CalendarEventFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  event?: CalendarEvent | null
}

export function CalendarEventFormDialog({
  open,
  onOpenChange,
  onClose,
  event,
}: CalendarEventFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    is_all_day: false,
    recurrence: "none",
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
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        start_time: utcToLocal(event.start_time),
        end_time: utcToLocal(event.end_time),
        timezone: event.timezone,
        is_all_day: event.is_all_day,
        recurrence: event.recurrence || "none",
      })
    } else {
      // Default to current date/time for new events
      const now = new Date()
      const offset = now.getTimezoneOffset() * 60000
      const localDate = new Date(now.getTime() - offset)
      const localDateEnd = new Date(now.getTime() - offset + 60 * 60000) // +1 hour
      setFormData({
        title: "",
        description: "",
        start_time: localDate.toISOString().slice(0, 16),
        end_time: localDateEnd.toISOString().slice(0, 16),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        is_all_day: false,
        recurrence: "none",
      })
    }
  }, [event, open])

  // Handle all-day checkbox change
  const handleAllDayChange = (checked: boolean) => {
    if (checked) {
      // Set start time to 12:00 AM and end time to 11:59 PM on the same date
      const startDate = formData.start_time.split('T')[0]
      setFormData({
        ...formData,
        start_time: `${startDate}T00:00`,
        end_time: `${startDate}T23:59`,
        is_all_day: true,
      })
    } else {
      setFormData({
        ...formData,
        is_all_day: false,
      })
    }
  }

  // Handle start time change
  const handleStartTimeChange = (value: string) => {
    if (formData.is_all_day) {
      // If all day, only update the date and keep times fixed
      const newDate = value.split('T')[0]
      setFormData({
        ...formData,
        start_time: `${newDate}T00:00`,
        end_time: `${newDate}T23:59`,
      })
    } else {
      // Normal behavior: just update start time
      setFormData({
        ...formData,
        start_time: value,
      })
    }
  }

  // Handle end time change
  const handleEndTimeChange = (value: string) => {
    if (formData.is_all_day) {
      // If all day is checked, don't allow changing end time
      return
    }
    
    // Validate that end time is not before start time
    const startDateTime = new Date(formData.start_time)
    const endDateTime = new Date(value)
    
    if (endDateTime < startDateTime) {
      // Don't update if end time is before start time
      return
    }
    
    setFormData({
      ...formData,
      end_time: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = event ? `/api/calendar/${event.id}` : "/api/calendar"
      const method = event ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          start_time: localToUTC(formData.start_time),
          end_time: localToUTC(formData.end_time),
          timezone: formData.timezone,
          is_all_day: formData.is_all_day,
          recurrence: formData.recurrence === "none" ? null : formData.recurrence,
        }),
      })

      if (response.ok) {
        onClose()
      } else {
        console.error("Failed to save event")
      }
    } catch (error) {
      console.error("Error saving event:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!event) return
    
    if (!confirm("Are you sure you want to delete this event?")) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(`/api/calendar/${event.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (response.ok) {
        onClose()
      } else {
        console.error("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {event ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Event title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Event description (optional)"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_all_day"
              checked={formData.is_all_day}
              onCheckedChange={handleAllDayChange}
            />
            <Label htmlFor="is_all_day" className="cursor-pointer">
              All day event
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurrence">Recurrence</Label>
            <Select
              value={formData.recurrence}
              onValueChange={(value) =>
                setFormData({ ...formData, recurrence: value })
              }
            >
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type={formData.is_all_day ? "date" : "datetime-local"}
                value={formData.is_all_day ? formData.start_time.split('T')[0] : formData.start_time}
                onChange={(e) => handleStartTimeChange(
                  formData.is_all_day 
                    ? `${e.target.value}T00:00` 
                    : e.target.value
                )}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type={formData.is_all_day ? "date" : "datetime-local"}
                value={formData.is_all_day ? formData.end_time.split('T')[0] : formData.end_time}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                disabled={formData.is_all_day}
                required
                className={formData.is_all_day ? "cursor-not-allowed opacity-60" : ""}
              />
              {formData.is_all_day && (
                <p className="text-xs text-muted-foreground">
                  End date is automatically set to match the start date for all-day events
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-2">
            {event && (
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
                {loading ? "Saving..." : event ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
