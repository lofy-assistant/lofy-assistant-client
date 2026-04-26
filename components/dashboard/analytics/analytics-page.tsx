"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Brain, Flame, RefreshCw, Siren, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useAnalytics, type AnalyticsRange, type TrendPoint } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";
import { dnc } from "@/lib/dashboard-night";
import { useDashboardNight } from "@/components/dashboard/shared/dashboard-night-provider";

const ranges: Array<{ value: AnalyticsRange; label: string }> = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "all", label: "All" },
];

const trendChartConfig = {
  count: {
    label: "Count",
    color: "#d97757",
  },
} satisfies ChartConfig;

function SummaryCard({
  night,
  title,
  value,
  description,
  icon: Icon,
  accentClassName,
}: {
  night: boolean;
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentClassName: string;
}) {
  return (
    <Card
      className={cn(
        "py-4 shadow-[0_12px_32px_-24px_rgba(61,46,34,0.65)]",
        night
          ? "border-white/10 bg-white/5 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.45)]"
          : "border-[#eadfd2] bg-white/90"
      )}
    >
      <CardHeader className="flex flex-col items-start gap-3 space-y-0 pb-3">
        <div className={cn("rounded-2xl p-2.5", accentClassName)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <CardTitle
            className={cn(
              "text-sm",
              night ? "text-[#c4b8ae]" : "text-[#4b382d]"
            )}
          >
            {title}
          </CardTitle>
          <CardDescription
            className={cn(
              "text-xs",
              night ? "text-[#9a8f85]" : "text-[#8d7566]"
            )}
          >
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "text-2xl font-semibold tracking-tight",
            dnc.textPrimary(night)
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({
  night,
  title,
  value,
  helper,
}: {
  night: boolean;
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <Card
      className={cn(
        "py-3",
        night
          ? "border-white/10 bg-white/5"
          : "border-[#eadfd2] bg-[#fff8f1]"
      )}
    >
      <CardHeader className="pb-2">
        <CardDescription
          className={cn(
            "text-[11px] uppercase tracking-[0.18em]",
            night ? "text-[#8a7a6a]" : "text-[#a18472]"
          )}
        >
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "text-lg font-semibold",
            night ? "text-[#e8ddd4]" : "text-[#3b2d23]"
          )}
        >
          {value}
        </div>
        <p
          className={cn(
            "mt-1 text-xs",
            night ? "text-[#9a8f85]" : "text-[#8d7566]"
          )}
        >
          {helper}
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  const { isNight: night } = useDashboardNight();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {ranges.map((range) => (
          <Skeleton
            key={range.value}
            className={cn("h-8 w-14 rounded-full", night && "bg-white/10")}
          />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className={cn(
              "py-4",
              night && "border-white/10 bg-white/5"
            )}
          >
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card
        className={cn("py-4", night && "border-white/10 bg-white/5")}
      >
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[260px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function AnalyticsPage() {
  const { isNight: night } = useDashboardNight();
  const [range, setRange] = React.useState<AnalyticsRange>("30d");
  const [isPending, startTransition] = React.useTransition();
  const { data, messages, memories, reminders, calendar, overview, isLoading, error, refresh, isValidating, isCached } = useAnalytics(range);

  const trendTabs = React.useMemo(() => {
    if (!messages || !memories || !reminders || !calendar) {
      return [] as Array<{
        key: string;
        title: string;
        description: string;
        series: TrendPoint[];
        chart: "line" | "area";
        helper: string;
      }>;
    }

    return [
      {
        key: "messages",
        title: "Conversation Flow",
        description: "How often you and Lofy talked during the selected range.",
        series: messages.trend,
        chart: "area" as const,
        helper: `${messages.messagesInRange.toLocaleString()} messages in ${range}`,
      },
      {
        key: "memories",
        title: "Memory Capture",
        description: "How frequently you captured memories worth keeping.",
        series: memories.trend,
        chart: "line" as const,
        helper: `${memories.createdInRange.toLocaleString()} memories created in ${range}`,
      },
      {
        key: "reminders",
        title: "Reminder Activity",
        description: "How often you set up reminders in the selected range.",
        series: reminders.trend,
        chart: "line" as const,
        helper: `${reminders.createdInRange.toLocaleString()} reminders created in ${range}`,
      },
      {
        key: "calendar",
        title: "Planning Momentum",
        description: "How your event creation volume changed over time.",
        series: calendar.trend,
        chart: "line" as const,
        helper: `${calendar.createdInRange.toLocaleString()} events created in ${range}`,
      },
    ];
  }, [calendar, memories, messages, range, reminders]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data || !messages || !memories || !reminders || !calendar || !overview) {
    return (
      <Card
        className={cn(
          "py-4",
          night
            ? "border-white/10 bg-white/5"
            : "border-[#eadfd2] bg-white/90"
        )}
      >
        <CardHeader>
          <CardTitle
            className={night ? "text-[#c4b8ae]" : "text-[#4b382d]"}
          >
            Analytics unavailable
          </CardTitle>
          <CardDescription
            className={night ? "text-[#9a8f85]" : "text-[#8d7566]"}
          >
            The analytics page could not load your current activity. Try again in a moment.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      <div
        className={cn(
          "rounded-[1.75rem] border p-4 shadow-[0_18px_36px_-28px_rgba(61,46,34,0.55)]",
          night
            ? "border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(30,32,40,0.95),_rgba(20,22,30,0.95)_58%,_rgba(17,18,22,0.96)_100%)]"
            : "border-[#eadfd2] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(255,244,234,0.95)_58%,_rgba(246,226,206,0.96)_100%)]"
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em]",
                night
                  ? "border-white/10 bg-white/5 text-[#9a8f85]"
                  : "border-[#ebd7c5] bg-white/80 text-[#9b7a67]"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Your activity story
            </div>
            <h2
              className={cn(
                "text-lg font-semibold",
                dnc.textPrimary(night)
              )}
            >
              See your rhythm, memory habit, and planning load.
            </h2>
            <p
              className={cn(
                "max-w-[28rem] text-sm leading-6",
                night ? "text-[#9a8f85]" : "text-[#7e6658]"
              )}
            >
              Analytics stays user-scoped and query-cached, so you get useful trends without waiting on heavyweight reports.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {ranges.map((option) => (
              <Button
                key={option.value}
                variant={range === option.value ? "default" : "outline"}
                size="sm"
                disabled={isPending}
                className={cn(
                  "rounded-full px-3",
                  range === option.value
                    ? "bg-[#3d2e22] text-[#fff8f1] hover:bg-[#31241b]"
                    : night
                      ? "border-white/10 bg-white/5 text-[#c4b8ae] hover:bg-white/10"
                      : "border-[#e7d8c8] bg-white/80 text-[#6d584b] hover:bg-[#fff6ee]"
                )}
                onClick={() => startTransition(() => setRange(option.value))}
              >
                {option.label}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={isValidating}
              className={cn(
                "rounded-full",
                night
                  ? "border-white/10 bg-white/5 text-[#c4b8ae] hover:bg-white/10"
                  : "border-[#e7d8c8] bg-white/80 text-[#6d584b] hover:bg-[#fff6ee]"
              )}
              onClick={refresh}
            >
              <RefreshCw className={cn("h-4 w-4", isValidating && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
        <div
          className={cn(
            "mt-4 flex items-center gap-2 text-xs",
            night ? "text-[#9a8f85]" : "text-[#8d7566]"
          )}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>{messages.messagesInRange.toLocaleString()} conversations surfaced for this range</span>
          {isCached && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px]",
                night
                  ? "bg-white/10 text-[#9a8f85]"
                  : "bg-white/80 text-[#9b7a67]"
              )}
            >
              cached
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SummaryCard
          night={night}
          title="Conversation rhythm"
          value={messages.messagesInRange.toLocaleString()}
          description={`Messages across ${range}`}
          icon={Activity}
          accentClassName="bg-[#f8dfcf] text-[#a24f2f]"
        />
        <SummaryCard
          night={night}
          title="Memory habit"
          value={overview.totalMemories.toLocaleString()}
          description={`${memories.createdInRange.toLocaleString()} created in ${range}`}
          icon={Brain}
          accentClassName="bg-[#eee0f6] text-[#7d49a1]"
        />
        <SummaryCard
          night={night}
          title="Reminder health"
          value={overview.totalReminders.toLocaleString()}
          description={`${reminders.pending.toLocaleString()} still pending`}
          icon={Siren}
          accentClassName="bg-[#fde5c7] text-[#b56e10]"
        />
      </div>

      <div className="flex flex-col gap-3">
        <InsightCard
          night={night}
          title="Current streak"
          value={`${messages.currentStreak} day${messages.currentStreak === 1 ? "" : "s"}`}
          helper={`${messages.longestStreak} day best run so far`}
        />
        <InsightCard
          night={night}
          title="Peak hour"
          value={messages.peakHourLabel}
          helper="Most active time across your message history"
        />
        <InsightCard
          night={night}
          title="Due soon"
          value={`${reminders.dueSoon}`}
          helper="Pending reminders due within 7 days"
        />
        <InsightCard
          night={night}
          title="Upcoming events"
          value={`${calendar.upcoming}`}
          helper={`${calendar.recurring} recurring event${calendar.recurring === 1 ? "" : "s"} on your calendar`}
        />
      </div>

      <Tabs defaultValue="messages" className="space-y-3">
        <div className="flex flex-col gap-3">
          <div>
            <h3
              className={cn(
                "text-sm font-semibold",
                dnc.textPrimary(night)
              )}
            >
              Trend explorer
            </h3>
            <p
              className={cn(
                "text-xs",
                night ? "text-[#9a8f85]" : "text-[#8d7566]"
              )}
            >
              Switch between conversations, memories, reminders, and calendar activity.
            </p>
          </div>
          <TabsList
            className={cn(
              "w-full rounded-2xl p-1 sm:w-auto",
              night ? "bg-white/10" : "bg-[#f2e8de]"
            )}
          >
            {trendTabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="rounded-xl px-3 text-[11px] sm:text-xs"
              >
                {tab.key}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {trendTabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key}>
            <Card
              className={cn(
                "py-4 shadow-[0_12px_32px_-24px_rgba(61,46,34,0.55)]",
                night
                  ? "border-white/10 bg-white/5 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.4)]"
                  : "border-[#eadfd2] bg-white/90"
              )}
            >
              <CardHeader>
                <CardTitle
                  className={cn("text-base", dnc.textPrimary(night))}
                >
                  {tab.title}
                </CardTitle>
                <CardDescription
                  className={night ? "text-[#9a8f85]" : "text-[#8d7566]"}
                >
                  {tab.description}
                </CardDescription>
                <p
                  className={cn(
                    "text-xs font-medium",
                    night ? "text-[#9a8f85]" : "text-[#9b7a67]"
                  )}
                >
                  {tab.helper}
                </p>
              </CardHeader>
              <CardContent>
                <ChartContainer config={trendChartConfig} className="h-[260px] w-full">
                  {tab.chart === "area" ? (
                    <AreaChart data={tab.series} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
                      <defs>
                        <linearGradient id="analyticsArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.26} />
                          <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
                      <ChartTooltip
                        cursor={{ stroke: "var(--color-count)", strokeDasharray: "4 4" }}
                        content={<ChartTooltipContent labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""} />}
                      />
                      <Area type="monotone" dataKey="count" stroke="var(--color-count)" fill="url(#analyticsArea)" strokeWidth={2} />
                    </AreaChart>
                  ) : (
                    <LineChart data={tab.series} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
                      <ChartTooltip
                        cursor={{ stroke: "var(--color-count)", strokeDasharray: "4 4" }}
                        content={<ChartTooltipContent labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""} />}
                      />
                      <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                    </LineChart>
                  )}
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card
        className={cn(
          "py-4 shadow-[0_12px_32px_-24px_rgba(61,46,34,0.45)]",
          night
            ? "border-white/10 bg-white/5 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.35)]"
            : "border-[#eadfd2] bg-[#fff8f1]"
        )}
      >
          <CardHeader>
            <div
              className={cn(
                "flex items-center gap-2",
                night ? "text-[#9a8f85]" : "text-[#9b7a67]"
              )}
            >
              <Flame className="h-4 w-4" />
              <CardTitle
                className={cn("text-base", dnc.textPrimary(night))}
              >
                What stands out
              </CardTitle>
            </div>
            <CardDescription
              className={night ? "text-[#9a8f85]" : "text-[#8d7566]"}
            >
              A few compact signals designed to be immediately actionable.
            </CardDescription>
          </CardHeader>
          <CardContent
            className={cn(
              "space-y-3 text-sm",
              night ? "text-[#b0a69c]" : "text-[#6f5b4d]"
            )}
          >
            <div
              className={cn(
                "rounded-2xl border p-3",
                night
                  ? "border-white/10 bg-white/5"
                  : "border-[#eadfd2] bg-white/75"
              )}
            >
              You exchanged{" "}
              <span
                className={cn("font-semibold", dnc.textPrimary(night))}
              >
                {messages.byAssistant.toLocaleString()}
              </span>{" "}
              assistant replies and sent{" "}
              <span
                className={cn("font-semibold", dnc.textPrimary(night))}
              >
                {messages.byUser.toLocaleString()}
              </span>{" "}
              user messages overall.
            </div>
            <div
              className={cn(
                "rounded-2xl border p-3",
                night
                  ? "border-white/10 bg-white/5"
                  : "border-[#eadfd2] bg-white/75"
              )}
            >
              You created{" "}
              <span
                className={cn("font-semibold", dnc.textPrimary(night))}
              >
                {memories.sharedByYou.toLocaleString()}
              </span>{" "}
              shared-memory links and still have{" "}
              <span
                className={cn("font-semibold", dnc.textPrimary(night))}
              >
                {reminders.dueSoon.toLocaleString()}
              </span>{" "}
              reminder{reminders.dueSoon === 1 ? "" : "s"} coming up soon.
            </div>
            <div
              className={cn(
                "rounded-2xl border p-3",
                night
                  ? "border-white/10 bg-white/5"
                  : "border-[#eadfd2] bg-white/75"
              )}
            >
              Your next two weeks are currently heaviest on{" "}
              <span
                className={cn("font-semibold", dnc.textPrimary(night))}
              >
                {calendar.weekdayLoad.reduce((best, item) => (item.count > best.count ? item : best), { label: "No day", count: 0 }).label}
              </span>
              , based on upcoming calendar events.
            </div>
            <div
              className={cn(
                "rounded-2xl border border-dashed bg-transparent p-3 text-xs leading-5",
                night
                  ? "border-white/15 text-[#9a8f85]"
                  : "border-[#d8c7b7] text-[#8d7566]"
              )}
            >
              Generated {new Date(data.generatedAt).toLocaleString()} for the{" "}
              <span
                className={cn(
                  "font-medium",
                  night ? "text-[#b0a69c]" : "text-[#6f5b4d]"
                )}
              >
                {data.range}
              </span>{" "}
              window.
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
