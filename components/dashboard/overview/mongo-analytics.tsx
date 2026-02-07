"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  CalendarDays,
  TrendingUp,
  Flame,
  User,
  Bot,
  RefreshCw,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalytics } from "@/hooks/use-analytics";

export function MongoAnalytics() {
  const isMobile = useIsMobile();
  const { messages: analytics, isLoading: loading, error, isValidating, isCached, refresh } = useAnalytics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-stretch">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-full">
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
        <Card>
          <CardHeader>
            <Skeleton className="w-48 h-5" />
            <Skeleton className="w-64 h-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-[250px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Failed to load message analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data for messages by hour
  const chartData = analytics.messagesByHour.map((count, hour) => ({
    hour: hour,
    messages: count,
  }));

  const chartConfig = {
    messages: {
      label: "Messages",
      color: "var(--color-chart-1)",
    },
  } satisfies ChartConfig;

  // Find peak hour for insights
  const peakHour = analytics.messagesByHour.indexOf(
    Math.max(...analytics.messagesByHour)
  );
  const peakHourLabel =
    peakHour >= 12
      ? `${peakHour === 12 ? 12 : peakHour - 12} PM`
      : `${peakHour === 0 ? 12 : peakHour} AM`;

  return (
    <div className="space-y-6">
      {/* Message Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Message Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Your conversation statistics
            {isCached && (
              <span className="ml-2 text-xs text-muted-foreground/70">
                (cached)
              </span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isValidating}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`}
          />
          {isValidating ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stats Grid - 4 Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-stretch">
        {/* Card 1: Total Conversations */}
        <Card className="h-full py-4 transition-all hover:shadow-md flex flex-col">
          <CardHeader className="flex flex-row items-center space-y-0">
            <div className="p-2 rounded-full bg-indigo-500/10">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
            </div>
            <CardTitle className="text-sm font-medium">
              Total Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="text-2xl font-bold">
              {analytics.total.toLocaleString()}
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <User className="w-4 h-4" /> You
                </span>
                <span className="font-medium">
                  {analytics.byUser.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Bot className="w-4 h-4" /> Lofy
                </span>
                <span className="font-medium">
                  {analytics.byAssistant.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Messages This Week */}
        <Card className="h-full py-4 transition-all hover:shadow-md flex flex-col">
          <CardHeader className="flex flex-row items-center space-y-0">
            <div className="p-2 rounded-full bg-green-500/10">
              <CalendarDays className="w-4 h-4 text-green-500" />
            </div>
            <CardTitle className="text-sm font-medium">
              Messages This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="text-2xl font-bold">
              {analytics.messagesThisWeek.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              In the last 7 days
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Average Messages Per Day */}
        <Card className="h-full py-4 transition-all hover:shadow-md flex flex-col">
          <CardHeader className="flex flex-row items-center space-y-0">
            <div className="p-2 rounded-full bg-purple-500/10">
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <CardTitle className="text-sm font-medium">
              Avg Messages/Day
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="text-2xl font-bold">
              {analytics.averageMessagesPerActiveDay}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Active days</span>
              <span className="font-medium">{analytics.daysActive} days</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Longest Streak */}
        <Card className="h-full py-4 transition-all hover:shadow-md flex flex-col">
          <CardHeader className="flex flex-row items-center space-y-0">
            <div className="p-2 rounded-full bg-orange-500/10">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <CardTitle className="text-sm font-medium">
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="text-2xl font-bold">
              {analytics.longestStreak} days
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Consecutive days messaging
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Messages by Time of Day Chart */}
      <Card className="transition-all hover:shadow-md py-4 flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg">
                Activity by Time of Day
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                See when you&apos;re most active throughout the day
              </CardDescription>
            </div>
            {analytics.total > 0 && (
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-muted-foreground">Peak:</span>
                <span className="font-semibold text-primary">
                  {peakHourLabel}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ChartContainer
            config={chartConfig}
            className="h-[200px] sm:h-[280px] w-full"
          >
            <AreaChart
              data={chartData}
              margin={
                isMobile
                  ? { top: 10, right: 10, left: -20, bottom: 0 }
                  : { top: 10, right: 30, left: 0, bottom: 0 }
              }
            >
              <defs>
                <linearGradient
                  id="messagesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/50"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={isMobile ? 5 : 2}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickFormatter={(value) =>
                  isMobile
                    ? `${value}h`
                    : `${String(value).padStart(2, "0")}:00`
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 30 : 40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const hour = payload?.[0]?.payload?.hour;
                      if (hour === undefined || hour === null) return "";
                      const period = hour >= 12 ? "PM" : "AM";
                      const displayHour =
                        hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                      return `${displayHour}:00 ${period}`;
                    }}
                  />
                }
                cursor={{
                  stroke: "var(--color-chart-1)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#messagesGradient)"
                dot={false}
                activeDot={{
                  r: isMobile ? 4 : 6,
                  fill: "var(--color-chart-1)",
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>

          {/* Mobile-friendly time period indicators */}
          <div className="flex justify-between mt-2 px-2 text-[10px] sm:text-xs text-muted-foreground">
            <span>🌙 Night</span>
            <span>🌅 Morning</span>
            <span>☀️ Afternoon</span>
            <span>🌆 Evening</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
