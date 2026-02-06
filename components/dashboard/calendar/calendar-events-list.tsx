"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Loader2 } from "lucide-react";
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
        <div className="grid gap-3 sm:gap-4">
          {filteredEvents.map((event) => {
            const startDate = new Date(event.start_time);
            const endDate = new Date(event.end_time);
            const isToday = format(startDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            return (
              <Card key={`${event.id}-${event.start_time}`} className="transition-all cursor-pointer rounded-xl hover:shadow-md active:scale-[0.98]" onClick={() => handleEventClick(event)}>
                <CardContent className="p-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Date Section */}
                    <div className="flex flex-col items-center justify-center w-16 py-3 border-r sm:w-24 sm:py-4">
                      <Badge variant={isToday ? "orange" : "default"} className="mb-1 sm:mb-2 text-[10px] sm:text-xs">
                        {format(startDate, "EEE")}
                      </Badge>
                      <div className="text-xl font-bold sm:text-2xl">{format(startDate, "d")}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">{format(startDate, "MMM yyyy")}</div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 p-3 sm:p-4">
                      <h3 className="mb-2 text-sm font-semibold sm:text-base line-clamp-1">{event.title}</h3>

                      {event.description && (
                        <>
                          <p className="mb-2 text-xs sm:mb-3 sm:text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                          <Separator className="mb-2 sm:mb-3" />
                        </>
                      )}

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate">{event.is_all_day ? "All day" : `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
