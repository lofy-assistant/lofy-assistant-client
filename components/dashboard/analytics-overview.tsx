"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Brain,
  Calendar,
  Bell,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnalyticsData {
  overview: {
    totalMemories: number;
    totalReminders: number;
    totalEvents: number;
    totalFeedbacks: number;
    activeReminders: number;
    upcomingEvents: number;
  };
  activity: {
    thisWeek: {
      memories: number;
      events: number;
      feedbacks: number;
    };
  };
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
}

export function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics");
        if (response.ok) {
          const analyticsData = await response.json();
          setData(analyticsData);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-16 h-8 mb-2" />
              <Skeleton className="w-32 h-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Failed to load analytics data
          </p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: "Total Memories",
      value: data.overview.totalMemories,
      change: data.activity.thisWeek.memories,
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Calendar Events",
      value: data.overview.totalEvents,
      change: data.activity.thisWeek.events,
      upcoming: data.overview.upcomingEvents,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Reminders",
      value: data.overview.totalReminders,
      active: data.overview.activeReminders,
      icon: Bell,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card className="pt-2" key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {stat.change !== undefined && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{stat.change} this week
                  </span>
                )}
                {stat.upcoming !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {stat.upcoming} upcoming
                  </Badge>
                )}
                {stat.active !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {stat.active} active
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Info Grid */}      
      <div className="grid gap-4 md:grid-cols-2">
     
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4" />
              Recent Memories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentMemories.length > 0 ? (
              <div className="space-y-3">
                {data.recentMemories.map((memory) => (
                  <div
                    key={memory.id}
                    className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <h4 className="text-sm font-medium mb-1">
                      {memory.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {memory.preview}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(memory.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No memories yet. Start creating some!
              </p>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
