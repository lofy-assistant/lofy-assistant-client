"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
import { Loader2 } from "lucide-react"

// ============================================================================
// Types
// ============================================================================

export interface CalendarEvent {
  id: number
  title: string
  description: string | null
  start_time: string
  end_time: string
  timezone?: string
  is_all_day: boolean
  recurrence?: string | null
}

interface FormData {
  title: string
  description: string
  start_time: string
  end_time: string
  timezone: string
  is_all_day: boolean
  recurrence: string
}

// ============================================================================
// Utilities
// ============================================================================

/** Convert UTC to local datetime string for datetime-local input */
function utcToLocal(utcDate: string): string {
  const date = new Date(utcDate)
  const offset = date.getTimezoneOffset() * 60000
  const localDate = new Date(date.getTime() - offset)
  return localDate.toISOString().slice(0, 16)
}

/** Convert datetime-local input to UTC ISO string */
function localToUTC(localDateTime: string): string {
  return new Date(localDateTime).toISOString()
}

/** Extract FREQ= value from RRULE string */
function parseRecurrenceFreq(r: string | null | undefined): string | null {
  if (!r) return null
  const s = r.replace(/^RRULE:/i, "")
  const match = s.match(/FREQ=([A-Za-z]+)/)
  return match ? match[1].toUpperCase() : null
}

/** Convert recurrence to select value */
function recurrenceForSelect(r: string | null | undefined): string {
  const freq = parseRecurrenceFreq(r)
  if (!freq) return "none"
  return `RRULE:FREQ=${freq}`
}

/** Get human-readable recurrence label */
function recurrenceLabel(r: string | null | undefined): string {
  const freq = parseRecurrenceFreq(r)
  if (!freq) return "No recurrence"
  const labels: Record<string, string> = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
  }
  return labels[freq] ?? r ?? "Unknown"
}

/** Get default form data for a new event */
function getDefaultFormData(): FormData {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  const localDate = new Date(now.getTime() - offset)
  const localDateEnd = new Date(now.getTime() - offset + 60 * 60000)
  
  return {
    title: "",
    description: "",
    start_time: localDate.toISOString().slice(0, 16),
    end_time: localDateEnd.toISOString().slice(0, 16),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    is_all_day: false,
    recurrence: "none",
  }
}

/** Get form data from an existing event */
function getFormDataFromEvent(event: CalendarEvent): FormData {
  return {
    title: event.title,
    description: event.description || "",
    start_time: utcToLocal(event.start_time),
    end_time: utcToLocal(event.end_time),
    timezone: event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    is_all_day: event.is_all_day,
    recurrence: recurrenceForSelect(event.recurrence),
  }
}

// ============================================================================
// Shared Form Fields Component
// ============================================================================

interface EventFormFieldsProps {
  formData: FormData
  onChange: (data: FormData) => void
  disabled?: boolean
}

function EventFormFields({ formData, onChange, disabled }: EventFormFieldsProps) {
  const handleAllDayChange = (checked: boolean) => {
    if (checked) {
      const startDate = formData.start_time.split("T")[0]
      onChange({
        ...formData,
        start_time: `${startDate}T00:00`,
        end_time: `${startDate}T23:59`,
        is_all_day: true,
      })
    } else {
      onChange({ ...formData, is_all_day: false })
    }
  }

  const handleStartTimeChange = (value: string) => {
    if (formData.is_all_day) {
      const newDate = value.split("T")[0]
      onChange({
        ...formData,
        start_time: `${newDate}T00:00`,
        end_time: `${newDate}T23:59`,
      })
    } else {
      onChange({ ...formData, start_time: value })
    }
  }

  const handleEndTimeChange = (value: string) => {
    if (formData.is_all_day) return
    
    const startDateTime = new Date(formData.start_time)
    const endDateTime = new Date(value)
    if (endDateTime < startDateTime) return
    
    onChange({ ...formData, end_time: value })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          disabled={disabled}
          required
          placeholder="Event title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          disabled={disabled}
          rows={3}
          placeholder="Event description (optional)"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_all_day"
          checked={formData.is_all_day}
          onCheckedChange={handleAllDayChange}
          disabled={disabled}
        />
        <Label htmlFor="is_all_day" className="cursor-pointer">
          All day event
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recurrence">Recurrence</Label>
        <Select
          value={formData.recurrence}
          onValueChange={(value) => onChange({ ...formData, recurrence: value })}
          disabled={disabled}
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
            value={formData.is_all_day ? formData.start_time.split("T")[0] : formData.start_time}
            onChange={(e) =>
              handleStartTimeChange(
                formData.is_all_day ? `${e.target.value}T00:00` : e.target.value
              )
            }
            disabled={disabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type={formData.is_all_day ? "date" : "datetime-local"}
            value={formData.is_all_day ? formData.end_time.split("T")[0] : formData.end_time}
            onChange={(e) => handleEndTimeChange(e.target.value)}
            disabled={disabled || formData.is_all_day}
            required
            className={formData.is_all_day ? "cursor-not-allowed opacity-60" : ""}
          />
          {formData.is_all_day && (
            <p className="text-xs text-muted-foreground">
              End date matches start date for all-day events
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// View-only Display Component
// ============================================================================

interface EventViewFieldsProps {
  event: CalendarEvent
}

function EventViewFields({ event }: EventViewFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Title</Label>
        <p className="text-sm">{event.title}</p>
      </div>

      <div className="space-y-1">
        <Label>Description</Label>
        <p className="text-sm text-muted-foreground">
          {event.description || "No description"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Start Time</Label>
          <p className="text-sm">{format(new Date(event.start_time), "PPP 'at' p")}</p>
        </div>
        <div className="space-y-1">
          <Label>End Time</Label>
          <p className="text-sm">{format(new Date(event.end_time), "PPP 'at' p")}</p>
        </div>
      </div>

      <div className="space-y-1">
        <Label>Recurrence</Label>
        <p className="text-sm text-muted-foreground">{recurrenceLabel(event.recurrence)}</p>
      </div>
    </div>
  )
}

// ============================================================================
// Add Event Dialog
// ============================================================================

interface CalendarAddEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CalendarAddEventDialog({
  open,
  onOpenChange,
  onSuccess,
}: CalendarAddEventDialogProps) {
  const [formData, setFormData] = useState<FormData>(getDefaultFormData)
  const [loading, setLoading] = useState(false)

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData(getDefaultFormData())
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
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
        toast.success("Event created successfully")
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error("Failed to create event")
      }
    } catch (error) {
      console.error("Error creating event:", error)
      toast.error("Failed to create event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Add a new event to your calendar</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <EventFormFields formData={formData} onChange={setFormData} disabled={loading} />
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Edit/Delete Event Dialog
// ============================================================================

interface CalendarEditEventDialogProps {
  event: CalendarEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CalendarEditEventDialog({
  event,
  open,
  onOpenChange,
  onSuccess,
}: CalendarEditEventDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [formData, setFormData] = useState<FormData>(getDefaultFormData)

  // Update form data when event changes
  useEffect(() => {
    if (event) {
      setFormData(getFormDataFromEvent(event))
      setIsEditing(false)
    }
  }, [event])

  const handleSave = async () => {
    if (!event) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/calendar/${event.id}`, {
        method: "PUT",
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
        toast.success("Event updated successfully")
        setIsEditing(false)
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error("Failed to update event")
      }
    } catch (error) {
      console.error("Error updating event:", error)
      toast.error("Failed to update event")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!event) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/calendar/${event.id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        toast.success("Event deleted successfully")
        onSuccess()
        onOpenChange(false)
        setShowDeleteDialog(false)
      } else {
        toast.error("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to delete event")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    if (event) {
      setFormData(getFormDataFromEvent(event))
    }
    setIsEditing(false)
  }

  if (!event) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Event" : "Event Details"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Make changes to your event" : "View event information"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isEditing ? (
              <EventFormFields
                formData={formData}
                onChange={setFormData}
                disabled={isSaving}
              />
            ) : (
              <EventViewFields event={event} />
            )}
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            {!isEditing ? (
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex-1 sm:flex-initial sm:mr-auto"
                >
                  Delete
                </Button>
                <Button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-initial">
                  Edit
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial"
                >
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
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel disabled={isDeleting} className="flex-1 sm:flex-initial mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 sm:flex-initial bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
