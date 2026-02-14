import useSWR from "swr";

// Types for the analytics API response
export interface MessageAnalytics {
  total: number;
  byUser: number;
  byAssistant: number;
  daysActive: number;
  messagesThisWeek: number;
  averageMessagesPerActiveDay: number;
  longestStreak: number;
  currentStreak: number;
  messagesByHour: number[];
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

export interface AnalyticsData {
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
  cached: boolean;
}

const fetcher = async (url: string): Promise<AnalyticsData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
};

export function useAnalytics() {
  const { data, error, isValidating, mutate } = useSWR<AnalyticsData>(
    "/api/analytics",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute deduping
    }
  );

  const refresh = async () => {
    // Force refresh by calling API with refresh=1 to bypass Redis cache
    const freshData = await fetcher("/api/analytics?refresh=1");
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
    recentMemories: data?.recentMemories,
    feedbacksByTag: data?.feedbacksByTag,
  };
}
