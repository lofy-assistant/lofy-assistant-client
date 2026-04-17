import useSWR from "swr";

export type AnalyticsRange = "7d" | "30d" | "90d" | "all";

export interface TrendPoint {
  bucket: string;
  label: string;
  count: number;
}

export interface WeekdayLoadPoint {
  label: string;
  count: number;
}

// Types for the analytics API response
export interface MessageAnalytics {
  total: number;
  byUser: number;
  byAssistant: number;
  daysActive: number;
  messagesThisWeek: number;
  messagesInRange: number;
  averageMessagesPerActiveDay: number;
  longestStreak: number;
  currentStreak: number;
  peakHour: number;
  peakHourLabel: string;
  messagesByHour: number[];
  trend: TrendPoint[];
}

export interface OverviewAnalytics {
  totalMemories: number;
  totalReminders: number;
  totalEvents: number;
  totalFeedbacks: number;
  activeReminders: number;
  upcomingEvents: number;
}

export interface ActivityAnalytics {
  thisWeek: {
    memories: number;
    events: number;
    feedbacks: number;
  };
}

export interface MemoryAnalytics {
  total: number;
  createdInRange: number;
  createdThisWeek: number;
  sharedByYou: number;
  received: number;
  trend: TrendPoint[];
}

export interface ReminderAnalytics {
  total: number;
  pending: number;
  completed: number;
  missed: number;
  dueSoon: number;
  createdInRange: number;
  trend: TrendPoint[];
}

export interface CalendarAnalytics {
  total: number;
  upcoming: number;
  recurring: number;
  createdInRange: number;
  trend: TrendPoint[];
  weekdayLoad: WeekdayLoadPoint[];
}

export interface AnalyticsData {
  range: AnalyticsRange;
  generatedAt: string;
  overview: OverviewAnalytics;
  activity: ActivityAnalytics;
  recentMemories: Array<{
    id: number;
    title: string;
    preview: string;
    createdAt: string;
  }>;
  feedbacksByTag: Array<{
    tag: string;
    count: number;
  }>;
  messages: MessageAnalytics;
  memories: MemoryAnalytics;
  reminders: ReminderAnalytics;
  calendar: CalendarAnalytics;
  cached: boolean;
}

const fetcher = async (url: string): Promise<AnalyticsData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
};

export function useAnalytics(range: AnalyticsRange = "30d") {
  const apiUrl = `/api/analytics?range=${range}`;

  const { data, error, isValidating, mutate } = useSWR<AnalyticsData>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute deduping
    }
  );

  const refresh = async () => {
    // Force refresh by calling API with refresh=1 to bypass Redis cache
    const freshData = await fetcher(`${apiUrl}&refresh=1`);
    mutate(freshData, { revalidate: false });
  };

  return {
    data,
    error,
    isLoading: !data && !error,
    isValidating,
    isCached: data?.cached ?? false,
    refresh,
    // Convenience accessors
    overview: data?.overview,
    activity: data?.activity,
    messages: data?.messages,
    memories: data?.memories,
    reminders: data?.reminders,
    calendar: data?.calendar,
    recentMemories: data?.recentMemories,
    feedbacksByTag: data?.feedbacksByTag,
  };
}
