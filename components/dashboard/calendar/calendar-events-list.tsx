"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Loader2, Repeat } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CalendarEventDialog } from "@/components/dashboard/calendar/calendar-event-dialog";
import { CalendarEventFormDialog } from "@/components/dashboard/calendar/calendar-event-form-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  recurrence?: string | null;
}

/** Extract FREQ= from RRULE and return a short label (e.g. "Weekly"). */
function recurrenceLabel(r: string | null | undefined): string | null {
  if (!r) return null;
  const match = r.replace(/^RRULE:/i, "").match(/FREQ=([A-Za-z]+)/);
  if (!match) return null;
  const labels: Record<string, string> = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
  };
  return labels[match[1].toUpperCase()] ?? null;
}

export function CalendarEventsList() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  // Filter state
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState<string>(currentDate.getFullYear().toString());
  const [showPastEvents, setShowPastEvents] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        month: selectedMonth,
        year: selectedYear,
      });

      const response = await fetch(`/api/calendar?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch events:", response.status, errorData);
        throw new Error(errorData.error || `Failed to fetch events (${response.status})`);
      }

      const data = await response.json();

      if (!data.events) {
        throw new Error("Invalid response format");
      }

      setEvents(data.events);
    } catch (err) {
      console.error("Error fetching calendar events:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleUpdate = () => {
    fetchEvents();
  };

  const handleFormDialogClose = () => {
    setIsFormDialogOpen(false);
    fetchEvents();
  };

  // Generate month options
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Generate year options (current year ± 2 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Filter out past events if showPastEvents is false
  const filteredEvents = events.filter((event) => {
    if (showPastEvents) return true;
    const eventEndTime = new Date(event.end_time);
    const now = new Date();
    return eventEndTime >= now;
  });

  // Group events by date (yyyy-MM-dd), sorted by date
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of filteredEvents) {
      const key = format(new Date(event.start_time), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    }
    const entries = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    return entries;
  }, [filteredEvents]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 mb-4 animate-spin text-muted-foreground" />
          <p className="text-center text-muted-foreground">Loading calendar events...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="w-12 h-12 mb-4 text-destructive" />
          <p className="text-center text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Section */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            {/* Top row: Filters */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full sm:w-[100px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bottom row: Checkbox and Button */}
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Checkbox id="show-past-events" checked={showPastEvents} onCheckedChange={(checked) => setShowPastEvents(checked as boolean)} />
                <label htmlFor="show-past-events" className="text-sm cursor-pointer select-none">
                  Show past events
                </label>
              </div>
              <Button onClick={() => setIsFormDialogOpen(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-12 h-12 mb-4 text-muted-foreground" />
            <p className="px-4 text-center text-muted-foreground">{events.length === 0 ? `No calendar events found for ${months[parseInt(selectedMonth) - 1]?.label} ${selectedYear}` : "No upcoming events. Check 'Show past events' to see all events."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8">
          {eventsByDate.map(([dateKey, dayEvents]) => {
            const startDate = new Date(dayEvents[0].start_time);
            const isToday = dateKey === format(new Date(), "yyyy-MM-dd");

            return (
              <div key={dateKey} className="space-y-3">
                {/* Clean date header */}
                <div className="flex items-baseline gap-3 px-1">
                  <h3 className="text-xl font-bold sm:text-2xl">{format(startDate, "d")}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-sm font-medium ${isToday ? "text-orange-600" : "text-muted-foreground"}`}>{format(startDate, "EEEE")}</span>
                    <span className="text-xs text-muted-foreground">{format(startDate, "MMMM yyyy")}</span>
                  </div>
                </div>

                {/* Event cards */}
                <div className="space-y-2">
                  {dayEvents.map((event) => {
                    const eventStart = new Date(event.start_time);
                    const eventEnd = new Date(event.end_time);
                    const recLabel = recurrenceLabel(event.recurrence);

                    return (
                      <Card key={`${event.id}-${event.start_time}`} className="transition-all cursor-pointer hover:shadow-md border-l-4 border-l-primary/20 hover:border-l-primary" onClick={() => handleEventClick(event)}>
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start gap-2 sm:gap-3">
                            {/* Time column */}
                            <div className="flex flex-col items-end pt-0.5 w-12 sm:w-16 shrink-0">
                              <span className="text-xs sm:text-sm font-medium">{event.is_all_day ? "All day" : format(eventStart, "h:mm")}</span>
                              {!event.is_all_day && <span className="text-[10px] sm:text-xs text-muted-foreground">{format(eventStart, "a")}</span>}
                            </div>

                            <Separator orientation="vertical" className="h-10 sm:h-12" />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1">
                                <h3 className="text-sm sm:text-base font-semibold line-clamp-1 break-words">{event.title}</h3>
                                {recLabel && (
                                  <Badge variant="default" className="shrink-0 text-[9px] sm:text-[10px] gap-0.5 sm:gap-1">
                                    <Repeat className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    <span className="hidden xs:inline">{recLabel}</span>
                                  </Badge>
                                )}
                              </div>

                              {event.description && <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mb-1.5 sm:mb-2 break-words">{event.description}</p>}

                              {!event.is_all_day && (
                                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  <span className="truncate">
                                    {format(eventStart, "h:mm a")} - {format(eventEnd, "h:mm a")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialogs - Always rendered */}
      <CalendarEventDialog event={selectedEvent} open={dialogOpen} onOpenChange={setDialogOpen} onUpdate={handleUpdate} />

      <CalendarEventFormDialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen} onClose={handleFormDialogClose} />
    </div>
  );
}
