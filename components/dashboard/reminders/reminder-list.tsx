"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, Clock, Loader2 } from "lucide-react";
import { ReminderDialog } from "@/components/dashboard/reminders/reminder-dialog";
import { ReminderFormDialog } from "@/components/dashboard/reminders/reminder-form-dialog";
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
        <div className="grid gap-3 sm:gap-4">
          {reminders.map((reminder) => {
            const reminderDate = new Date(reminder.reminder_time);
            const isToday = format(reminderDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            return (
              <Card key={`${reminder.id}-${reminder.reminder_time}`} className="transition-all cursor-pointer rounded-xl hover:shadow-md active:scale-[0.98]" onClick={() => handleReminderClick(reminder)}>
                <CardContent className="p-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Date Section */}
                    <div className="flex flex-col items-center justify-center w-16 py-3 border-r sm:w-24 sm:py-4">
                      <Badge variant={isToday ? "orange" : "default"} className="mb-1 sm:mb-2 text-[10px] sm:text-xs">
                        {format(reminderDate, "EEE")}
                      </Badge>
                      <div className="text-xl font-bold sm:text-2xl">{format(reminderDate, "d")}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">{format(reminderDate, "MMM yyyy")}</div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="flex-1 text-sm font-semibold sm:text-base line-clamp-2">{reminder.message}</h3>
                        <Badge variant={getStatusColor(reminder.status)} className="ml-2 text-[10px] sm:text-xs shrink-0">
                          {reminder.status}
                        </Badge>
                      </div>

                      <Separator className="mb-2 sm:mb-3" />

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span>{format(reminderDate, "h:mm a")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <ReminderDialog reminder={selectedReminder} open={dialogOpen} onOpenChange={setDialogOpen} onUpdate={handleUpdate} />

          <ReminderFormDialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen} onClose={handleFormDialogClose} />
        </div>
      )}
    </div>
  );
}
