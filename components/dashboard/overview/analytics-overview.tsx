"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Calendar, Bell, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from "@/hooks/use-analytics";

export function AnalyticsOverview() {
  const { overview, activity, isLoading: loading, error } = useAnalytics();
  const router = useRouter();

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

  if (error || !overview || !activity) {
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
      value: overview.totalMemories,
      change: activity.thisWeek.memories,
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      href: "/dashboard/memories",
    },
    {
      title: "Calendar Events",
      value: overview.totalEvents,
      change: activity.thisWeek.events,
      upcoming: overview.upcomingEvents,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      href: "/dashboard/calendar",
    },
    {
      title: "Reminders",
      value: overview.totalReminders,
      active: overview.activeReminders,
      icon: Bell,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      href: "/dashboard/reminders",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card 
            className="pt-2 transition-all cursor-pointer hover:shadow-md active:scale-[0.98]"
            key={stat.title}
            onClick={() => router.push(stat.href)}
          >
            <CardHeader className="flex flex-row items-center space-y-0">
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {stat.change !== undefined && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />+{stat.change} this week
                  </span>
                )}
                {stat.upcoming !== undefined && (
                  <Badge variant="indigo" className="text-xs">
                    {stat.upcoming} upcoming
                  </Badge>
                )}
                {stat.active !== undefined && (
                  <Badge variant="indigo" className="text-xs">
                    {stat.active} active
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
