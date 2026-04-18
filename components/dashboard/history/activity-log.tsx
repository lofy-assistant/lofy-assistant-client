"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Bell, Brain, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityEntity = "event" | "reminder" | "memory";
export type ActivityAction = "created" | "updated" | "deleted" | "sync";
export type ActivityPartyKind = "from" | "for";

export interface ActivityParty {
  kind: ActivityPartyKind;
  label: string;
}

export interface ActivityItem {
  id: string;
  entity: ActivityEntity;
  action: ActivityAction;
  label: string;
  detail: string;
  at: Date;
  party: ActivityParty | null;
  /** Google Calendar connection display name when known */
  integrationDisplayName: string | null;
}

type ActivityApiItem = Omit<ActivityItem, "at"> & {
  at: string;
  integrationDisplayName?: string | null;
};

type FilterId = "all" | ActivityEntity;

const ACTION_VERB: Record<ActivityAction, string> = {
  created: "Created",
  updated: "Updated",
  deleted: "Deleted",
  sync: "Synced",
};

const ENTITY_LABEL: Record<ActivityEntity, string> = {
  event: "event",
  reminder: "reminder",
  memory: "memory",
};

const FILTERS: {
  id: FilterId;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "event", label: "Events" },
  { id: "reminder", label: "Reminders" },
  { id: "memory", label: "Memories" },
];

const ENTITY_ICON: Record<ActivityEntity, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  event: Calendar,
  reminder: Bell,
  memory: Brain,
};

const ENTITY_ICON_STYLES: Record<ActivityEntity, { wrapper: string; icon: string }> = {
  event: {
    wrapper: "bg-neutral-100",
    icon: "text-neutral-500",
  },
  reminder: {
    wrapper: "bg-zinc-100",
    icon: "text-zinc-500",
  },
  memory: {
    wrapper: "bg-stone-100",
    icon: "text-stone-500",
  },
};

const ACTION_BADGE_STYLES: Record<ActivityAction, string> = {
  created: "border-primary/15 bg-primary/8 text-primary",
  updated: "border-sky-200/60 bg-sky-50/75 text-sky-700",
  deleted: "border-destructive/15 bg-destructive/8 text-destructive",
  sync: "border-emerald-200/70 bg-emerald-50/80 text-emerald-800",
};

const CREATED_ENTITY_BADGE_STYLES: Partial<Record<ActivityEntity, string>> = {
  reminder: "border-sky-200/80 bg-sky-50/80 text-sky-400",
  memory: "border-indigo-200/80 bg-indigo-50/80 text-indigo-400",
};

const PARTY_BADGE_STYLES: Record<ActivityPartyKind, string> = {
  for: "border-teal-200/80 bg-teal-50/80 text-teal-400",
  from: "border-violet-200/80 bg-violet-50/80 text-violet-400",
};

const INTEGRATION_BADGE_STYLES =
  "border-[#e5d8cf]/90 bg-[#fffdfb]/90 text-[#6b5b4f] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]";

function getActionBadgeStyle(action: ActivityAction, entity: ActivityEntity): string {
  if (action === "sync") {
    return ACTION_BADGE_STYLES.sync;
  }
  if (action === "created") {
    return CREATED_ENTITY_BADGE_STYLES[entity] ?? ACTION_BADGE_STYLES.created;
  }

  return ACTION_BADGE_STYLES[action];
}

const ISO_WITHOUT_TIMEZONE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/;
const ISO_TIMESTAMP_IN_TEXT = /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?\b/g;

function normalizeActivityTimestamp(value: string): Date | null {
  const normalizedValue = ISO_WITHOUT_TIMEZONE.test(value) ? `${value}Z` : value;
  const parsed = new Date(normalizedValue);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function normalizeActivity(item: ActivityApiItem): ActivityItem | null {
  const at = normalizeActivityTimestamp(item.at);

  if (!at) {
    return null;
  }

  const rawIntegration = item.integrationDisplayName;
  const integrationDisplayName =
    typeof rawIntegration === "string" && rawIntegration.trim().length > 0
      ? rawIntegration.trim()
      : null;

  return {
    ...item,
    at,
    integrationDisplayName,
  };
}

function normalizeActivityDetail(detail: string, formatter: Intl.DateTimeFormat): string {
  return detail.replace(ISO_TIMESTAMP_IN_TEXT, (match) => {
    const parsed = normalizeActivityTimestamp(match);
    return parsed ? formatter.format(parsed) : match;
  });
}

function formatActivityDetail(detail: string, entity: ActivityEntity): string {
  if (entity === "event") {
    return detail.replace(/\.\s+End:/g, ".\nEnd:").replace(/\.\s+Notes:/g, ".\nNotes:");
  }

  return detail;
}

export function ActivityLog() {
  const [allItems, setAllItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterId>("all");
  const [userTimeZone, setUserTimeZone] = useState("UTC");

  useEffect(() => {
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detectedTimeZone) {
      setUserTimeZone(detectedTimeZone);
    }
  }, []);

  const absoluteDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: userTimeZone,
      }),
    [userTimeZone]
  );

  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/history/me?limit=50", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch history (${response.status})`);
        }

        const data = await response.json();

        if (!Array.isArray(data.items)) {
          throw new Error("Invalid history response");
        }

        if (!cancelled) {
          const normalizedItems: ActivityItem[] = (data.items as ActivityApiItem[])
            .map(normalizeActivity)
            .filter((item: ActivityItem | null): item is ActivityItem => item !== null)
            .sort((left: ActivityItem, right: ActivityItem) => right.at.getTime() - left.at.getTime());

          setAllItems(normalizedItems);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : "Failed to load history");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    if (filter === "all") return allItems;
    return allItems.filter((i) => i.entity === filter);
  }, [allItems, filter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-[#7a6a5a]">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="text-sm">Loading activity from your domain events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#ead8cb] bg-[#fff9f5] px-4 py-10 text-center">
        <AlertCircle className="h-5 w-5 text-[#b45309]" />
        <p className="text-sm text-[#7a6a5a]">{error}</p>
      </div>
    );
  }

  if (allItems.length === 0) {
    return (
      <p className="text-center text-sm text-[#9a8070] py-10 px-4">
        No activity yet. When Lofy creates or changes something, it will show up here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 overflow-x-clip">
      <div className="-mx-1 px-1 pt-1">
        <div
          role="tablist"
          aria-label="Filter activity"
          className="flex flex-row flex-nowrap items-center gap-2 rounded-2xl border border-[#f0e7df] bg-[#fcf8f4] px-1.5 py-1.5 gap-1 flex-wrap justify-between"
        >
        {FILTERS.map(({ id, label }) => {
          const selected = filter === id;
          const isEntity = id !== "all";
          const FilterIcon = isEntity ? ENTITY_ICON[id] : null;

          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFilter(id)}
              className={cn(
                "inline-flex items-center justify-center border font-medium transition-colors",
                isEntity
                  ? "h-11 min-w-0 flex-1 rounded-2xl text-[#8a7769] sm:h-auto sm:min-w-0 sm:flex-1 sm:rounded-full sm:px-2.5 sm:py-1.5 sm:text-[10px]"
                  : "h-11 min-w-0 flex-1 rounded-2xl px-2 text-sm sm:h-auto sm:flex-1 sm:rounded-full sm:px-2.5 sm:py-1.5 sm:text-[10px]",
                selected
                  ? "border-[#e7d9cb] bg-white text-[#4a392c] shadow-[0_6px_18px_rgba(84,58,33,0.05)]"
                  : "border-transparent text-[#8a7769] hover:border-[#efe4db] hover:bg-white/70"
              )}
            >
              {isEntity && FilterIcon ? (
                <>
                  <FilterIcon className="size-5 sm:hidden" strokeWidth={2} aria-hidden />
                  <span className="sr-only sm:not-sr-only sm:inline">{label}</span>
                </>
              ) : (
                label
              )}
            </button>
          );
        })}
        </div>
      </div>

      <ul className="flex flex-col gap-2.5 pb-2">
        {items.length === 0 ? (
          <li className="text-center text-sm text-[#9a8070] py-8">
            Nothing in this category yet.
          </li>
        ) : (
          items.map((item) => {
            const when = formatDistanceToNow(item.at, { addSuffix: true });
            const absoluteWhen = absoluteDateFormatter.format(item.at);
            const detail = formatActivityDetail(
              normalizeActivityDetail(item.detail, absoluteDateFormatter),
              item.entity
            );
            const ItemIcon = ENTITY_ICON[item.entity];
            const iconStyle = ENTITY_ICON_STYLES[item.entity];
            const showIntegrationBadge = item.entity === "event" && item.integrationDisplayName;

            return (
              <li key={item.id} className="group">
                <div className="rounded-[1.35rem] border border-[#eee3da] bg-[linear-gradient(180deg,#fffefd_0%,#fdf8f4_100%)] px-4 py-4 shadow-[0_8px_24px_rgba(84,58,33,0.045)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_28px_rgba(84,58,33,0.06)]">
                  <div className="flex gap-3.5">
                    <div
                      className={cn(
                        "shrink-0 flex h-10 w-10 items-center justify-center rounded-2xl ring-1 ring-black/4",
                        iconStyle.wrapper
                      )}
                    >
                      <ItemIcon className={cn("h-4 w-4", iconStyle.icon)} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium capitalize",
                              getActionBadgeStyle(item.action, item.entity)
                            )}
                          >
                            {item.action === "sync" ? (
                              <>Synced event</>
                            ) : (
                              <>
                                {ACTION_VERB[item.action]} {ENTITY_LABEL[item.entity]}
                              </>
                            )}
                          </span>
                          {showIntegrationBadge ? (
                            <span
                              className={cn(
                                "inline-flex max-w-full items-center truncate rounded-full border px-2.5 py-1 text-[10px] font-medium tabular-nums",
                                INTEGRATION_BADGE_STYLES
                              )}
                              title={item.integrationDisplayName ?? undefined}
                            >
                              [{item.integrationDisplayName}]
                            </span>
                          ) : null}
                          {item.party ? (
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium",
                                PARTY_BADGE_STYLES[item.party.kind]
                              )}
                            >
                              {item.party.label}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-2 text-sm font-semibold leading-snug text-[#3d2e22] sm:text-[15px]">
                          {item.label}
                        </h3>
                      </div>

                      <p className="mt-2.5 whitespace-pre-line text-[13px] leading-relaxed text-[#76695f] sm:text-[13.5px]">
                        {detail}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#f2e9e1] pt-3 text-xs text-[#938174]">
                        <span className="font-medium text-[#776659]">{when}</span>
                        <span className="h-1 w-1 rounded-full bg-[#dcc8b8]" aria-hidden="true" />
                        <span>{absoluteWhen}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
