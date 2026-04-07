"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Brain, Calendar, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityEntity = "event" | "reminder" | "memory";
export type ActivityAction = "created" | "updated" | "deleted";

export interface ActivityItem {
  id: string;
  entity: ActivityEntity;
  action: ActivityAction;
  /** Primary line (bold), like the card title in the reference UI */
  label: string;
  /** Supporting paragraph under the title */
  detail: string;
  at: Date;
}

type FilterId = "all" | ActivityEntity;

const ACTION_VERB: Record<ActivityAction, string> = {
  created: "Created",
  updated: "Updated",
  deleted: "Deleted",
};

const ENTITY_LABEL: Record<ActivityEntity, string> = {
  event: "event",
  reminder: "reminder",
  memory: "memory",
};

const FILTERS: {
  id: FilterId;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "all", label: "All" },
  { id: "event", label: "Events", icon: Calendar },
  { id: "reminder", label: "Reminders", icon: Bell },
  { id: "memory", label: "Memories", icon: Brain },
];

function buildMockActivities(): ActivityItem[] {
  const now = Date.now();
  const m = (mins: number) => new Date(now - mins * 60 * 1000);
  const h = (hours: number) => new Date(now - hours * 60 * 60 * 1000);
  const d = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000);

  return [
    {
      id: "1",
      entity: "reminder",
      action: "created",
      label: "Take vitamins",
      detail:
        "Lofy added a daily reminder based on your message. You will get a nudge around the time you usually prefer.",
      at: m(38),
    },
    {
      id: "2",
      entity: "event",
      action: "updated",
      label: "Team standup",
      detail:
        "The event time was adjusted after you asked to move it. Invites stay in sync with your calendar.",
      at: h(2),
    },
    {
      id: "3",
      entity: "memory",
      action: "created",
      label: "Mom's birthday is in April",
      detail:
        "Saved as a personal memory so Lofy can bring it up when you are planning family time or gifts.",
      at: h(5),
    },
    {
      id: "4",
      entity: "reminder",
      action: "deleted",
      label: "Old grocery list",
      detail:
        "You asked to clear this reminder. It will no longer appear in your list or notifications.",
      at: d(1),
    },
    {
      id: "5",
      entity: "event",
      action: "created",
      label: "Dentist - next Friday",
      detail:
        "Created from chat with date and location you mentioned. You can edit it anytime from the calendar.",
      at: d(2),
    },
    {
      id: "6",
      entity: "memory",
      action: "updated",
      label: "WiFi password for the cafe",
      detail:
        "Lofy replaced the previous note with the new password you sent, so answers stay accurate.",
      at: d(3),
    },
  ];
}

export function ActivityLog() {
  const allItems = useMemo(() => buildMockActivities(), []);
  const [filter, setFilter] = useState<FilterId>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const items = useMemo(() => {
    if (filter === "all") return allItems;
    return allItems.filter((i) => i.entity === filter);
  }, [allItems, filter]);

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (allItems.length === 0) {
    return (
      <p className="text-center text-sm text-[#9a8070] py-10 px-4">
        No activity yet. When Lofy creates or changes something, it will show up here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Filter tabs — inspired by segmented filters + icons */}
      <div
        role="tablist"
        aria-label="Filter activity"
        className="sticky top-0 z-10 -mx-1 px-1 py-1 flex flex-wrap items-center gap-1.5 bg-[#faf6f2]"
      >
        {FILTERS.map(({ id, label, icon: Icon }) => {
          const selected = filter === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFilter(id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                selected
                  ? "bg-[#e8e0d6] text-[#3d2e22] shadow-sm"
                  : "text-[#7a6a5a] hover:bg-white/60"
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5 opacity-80" strokeWidth={2} />}
              {label}
            </button>
          );
        })}
      </div>

      <ul className="flex flex-col gap-2.5 pb-2">
        {items.length === 0 ? (
          <li className="text-center text-sm text-[#9a8070] py-8">
            Nothing in this category yet.
          </li>
        ) : (
          items.map((item) => {
            const isOpen = expanded[item.id] ?? false;
            const when = formatDistanceToNow(item.at, { addSuffix: true });

            return (
              <li key={item.id}>
                <div className="rounded-xl border border-[#e5ddd4] bg-white px-3.5 py-3 shadow-sm">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-violet-600" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#3d2e22] leading-snug pr-1">
                          {item.label}
                        </h3>
                        <button
                          type="button"
                          onClick={() => toggle(item.id)}
                          className="shrink-0 p-0.5 rounded-md text-[#9a8070] hover:bg-black/4 hover:text-[#3d2e22] transition-colors"
                          aria-expanded={isOpen}
                          aria-label={isOpen ? "Hide action type" : "Show action type"}
                        >
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform duration-200",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-[#6b5d52]">
                        {item.detail}
                      </p>
                      <p className="mt-2 text-xs text-[#9a8070]">{when}</p>
                      {isOpen && (
                        <p className="mt-1.5 text-xs font-medium text-[#7a6a5a]">
                          {ACTION_VERB[item.action]} {ENTITY_LABEL[item.entity]}
                        </p>
                      )}
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
