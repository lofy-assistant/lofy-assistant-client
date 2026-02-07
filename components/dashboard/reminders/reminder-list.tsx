"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, Clock, Loader2, Repeat } from "lucide-react";
import { ReminderAddDialog, ReminderEditDialog } from "@/components/dashboard/reminders/reminder-form";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Reminder {
  id: number;
  message: string;
  reminder_time: string;
  status: string;
  created_at: string;
  updated_at: string;
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

export function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  // Filter state
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState<string>(currentDate.getFullYear().toString());
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        month: selectedMonth,
        year: selectedYear,
        status: selectedStatus,
      });

      const response = await fetch(`/api/reminder?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch reminders:", response.status, errorData);
        throw new Error(errorData.error || `Failed to fetch reminders (${response.status})`);
      }

      const data = await response.json();

      if (!data.reminders) {
        throw new Error("Invalid response format");
      }

      setReminders(data.reminders);
    } catch (err) {
      console.error("Error fetching reminders:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [selectedMonth, selectedYear, selectedStatus]);

  const handleReminderClick = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setDialogOpen(true);
  };

  const handleUpdate = () => {
    fetchReminders();
  };

  const handleFormDialogClose = () => {
    setIsFormDialogOpen(false);
    fetchReminders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "indigo";
      case "completed":
        return "emerald";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
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

  // Group reminders by date (yyyy-MM-dd), sorted by date
  const remindersByDate = useMemo(() => {
    const map = new Map<string, Reminder[]>();
    for (const reminder of reminders) {
      const key = format(new Date(reminder.reminder_time), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(reminder);
    }
    const entries = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    return entries;
  }, [reminders]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 mb-4 animate-spin text-muted-foreground" />
          <p className="text-center text-muted-foreground">Loading reminders...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="w-12 h-12 mb-4 text-destructive" />
          <p className="text-center text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Section */}
      <Card>
        <CardContent className="flex flex-col items-start gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto sm:ml-auto">
            <Button onClick={() => setIsFormDialogOpen(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Reminder
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="w-12 h-12 mb-4 text-muted-foreground" />
            <p className="px-4 text-center text-muted-foreground">
              No reminders found for {months[parseInt(selectedMonth) - 1]?.label} {selectedYear}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8">
          {remindersByDate.map(([dateKey, dayReminders]) => {
            const startDate = new Date(dayReminders[0].reminder_time);
            const isToday = dateKey === format(new Date(), "yyyy-MM-dd");

            return (
              <div key={dateKey} className="space-y-3">
                {/* Clean date header — day, day name, month & year in primary when today */}
                <div className={`flex items-baseline gap-3 px-1 ${isToday ? "text-primary" : ""}`}>
                  <h3 className="text-xl font-bold sm:text-2xl">{format(startDate, "d")}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-sm font-medium ${isToday ? "" : "text-muted-foreground"}`}>{format(startDate, "EEEE")}</span>
                    <span className={`text-xs ${isToday ? "" : "text-muted-foreground"}`}>{format(startDate, "MMMM yyyy")}</span>
                  </div>
                </div>

                {/* Reminder cards */}
                <div className="space-y-2">
                  {dayReminders.map((reminder) => {
                    const reminderTime = new Date(reminder.reminder_time);
                    const recLabel = recurrenceLabel(reminder.recurrence);

                    return (
                      <Card key={`${reminder.id}-${reminder.reminder_time}`} className="transition-all cursor-pointer hover:shadow-md border-l-4 border-l-primary/20 hover:border-l-primary" onClick={() => handleReminderClick(reminder)}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {/* Time column */}
                            <div className="flex flex-col items-end pt-0.5 w-16 shrink-0">
                              <span className="text-sm font-medium">{format(reminderTime, "h:mm")}</span>
                              <span className="text-xs text-muted-foreground">{format(reminderTime, "a")}</span>
                            </div>

                            <Separator orientation="vertical" className="h-12" />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-semibold line-clamp-2">{reminder.message}</h3>
                                <div className="flex flex-col gap-1 shrink-0 min-w-[80px]">
                                  <Badge variant={getStatusColor(reminder.status)} className="text-[10px] w-full justify-center">
                                    {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                                  </Badge>
                                  {recLabel && (
                                    <Badge variant="default" className="text-[10px] gap-1 w-full justify-center">
                                      <Repeat className="w-3 h-3" />
                                      {recLabel}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{format(reminderTime, "h:mm a")}</span>
                              </div>
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

          <ReminderEditDialog reminder={selectedReminder} open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={handleUpdate} />

          <ReminderAddDialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen} onSuccess={handleFormDialogClose} />
        </div>
      )}
    </div>
  );
}
