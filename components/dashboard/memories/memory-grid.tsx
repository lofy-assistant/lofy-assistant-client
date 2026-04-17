"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowUpRight, BookHeart, Calendar, Inbox, Loader2, Search, Users } from "lucide-react";
import { MemoryDetailModal } from "@/components/dashboard/memories/memory-detail-modal";
import { Separator } from "@/components/ui/separator";

interface PersonSummary {
  id: string;
  name: string | null;
}

interface MemoryShareRecipient {
  id: string;
  name: string | null;
}

interface Memory {
  id: number;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  accessLevel: "owned" | "shared";
  shareId?: string;
  comment?: string | null;
  sharedAt?: string;
  sharedWith?: MemoryShareRecipient[];
  owner?: PersonSummary;
  sharedUser?: PersonSummary;
}

type MemoryApiResponse = {
  memories?: Array<{
    id: number;
    title: string | null;
    content: string;
    created_at: string;
    updated_at: string;
    sharedWith?: MemoryShareRecipient[];
  }>;
  sharedMemories?: Array<{
    id: number;
    title: string | null;
    content: string;
    created_at: string;
    updated_at: string;
    shareId: string;
    comment: string | null;
    sharedAt: string;
    owner?: PersonSummary;
    sharedUser?: PersonSummary;
  }>;
};

type ViewFilter = "all" | "owned" | "shared";

function truncateContent(content: string, maxLength: number = 170) {
  if (content.length <= maxLength) return content;
  return `${content.substring(0, maxLength)}...`;
}

function getDisplayName(person?: PersonSummary | null) {
  return person?.name?.trim() || "Someone in your circle";
}

export function MemoryGrid() {
  const [ownedMemories, setOwnedMemories] = useState<Memory[]>([]);
  const [sharedMemories, setSharedMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/memories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch memories:", response.status, errorData);
        throw new Error(errorData.error || `Failed to fetch memories (${response.status})`);
      }

      const data = (await response.json()) as MemoryApiResponse;

      if (!data.memories) {
        throw new Error("Invalid response format");
      }

      setOwnedMemories(
        data.memories.map((memory) => ({
          ...memory,
          accessLevel: "owned",
        })),
      );

      setSharedMemories(
        (data.sharedMemories ?? []).map((memory) => ({
          ...memory,
          accessLevel: "shared",
        })),
      );
    } catch (err) {
      console.error("Error fetching memories:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMemories();
  }, []);

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setDialogOpen(true);
  };

  const handleUpdate = () => {
    void fetchMemories();
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchesSearch = (memory: Memory) => {
    if (!normalizedQuery) {
      return true;
    }

    const haystacks = [memory.title, memory.content, memory.owner?.name, memory.comment, ...(memory.sharedWith?.map((recipient) => recipient.name) ?? [])].filter(Boolean) as string[];
    return haystacks.some((value) => value.toLowerCase().includes(normalizedQuery));
  };

  const filteredOwnedMemories = ownedMemories.filter(matchesSearch);
  const filteredSharedMemories = sharedMemories.filter(matchesSearch);
  const totalMemories = ownedMemories.length + sharedMemories.length;
  const visibleOwnedMemories = viewFilter === "shared" ? [] : filteredOwnedMemories;
  const visibleSharedMemories = viewFilter === "owned" ? [] : filteredSharedMemories;
  const hasVisibleResults = visibleOwnedMemories.length > 0 || visibleSharedMemories.length > 0;

  const filterOptions: Array<{ id: ViewFilter; label: string; count: number }> = [
    { id: "all", label: "All", count: filteredOwnedMemories.length + filteredSharedMemories.length },
    { id: "owned", label: "Mine", count: filteredOwnedMemories.length },
    { id: "shared", label: "Shared", count: filteredSharedMemories.length },
  ];

  if (error) {
    return (
      <div className="rounded-[1.75rem] border border-red-200 bg-red-50/80 px-4 py-5 text-sm text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      <section className="overflow-hidden rounded-[2rem] border border-[#eadfd3] bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(251,242,232,0.98)_48%,rgba(226,245,239,0.92)_100%)] shadow-[0_18px_45px_rgba(86,63,42,0.08)]">
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full border border-[#d8cab9] bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a6a5a]">
                Shared memory space
              </span>
              <div className="space-y-1">
                <h2 className="text-sm font-medium tracking-[-0.02em] text-[#3d2e22]">
                  One feed for what you saved and what your circle trusted you with.
                </h2>
                <p className="text-xs leading-relaxed text-[#8d7563]">
                  Review your own memories, spot the ones shared with you, and open any card for the full context.
                </p>
              </div>
            </div>
            <div className="hidden rounded-[1.4rem] bg-white/75 p-3 shadow-sm sm:block">
              <BookHeart className="h-6 w-6 text-[#0f8a6d]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.4rem] border border-[#eadfd3] bg-white/80 p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#7a6a5a]">
                <BookHeart className="h-3.5 w-3.5 text-[#b47b45]" />
                Your library
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#3d2e22]">{ownedMemories.length}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#9a8070]">Memories captured from yourself.</p>
            </div>
            <div className="rounded-[1.4rem] border border-[#cae4da] bg-[#f2fbf7] p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#487565]">
                <Inbox className="h-3.5 w-3.5 text-[#0f8a6d]" />
                Shared with you
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#204a3f]">{sharedMemories.length}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#5c8577]">Memories shared by people in your circle.</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-[1.4rem] border border-dashed border-[#d8cab9] bg-white/55 px-4 py-3">
            <div>
              <p className="text-xs md:text-sm font-medium text-[#3d2e22]">Sharing works best when your circle is ready.</p>
              <p className="mt-1 text-[11px] text-[#8d7563]">Invite friends, then open one of your memories to share it directly.</p>
            </div>
             <Button asChild variant="outline" className="w-full h-9 rounded-xl border-[#dacbbb] bg-white/80 px-3 text-[#4a392c] hover:bg-white">
              <Link href="/dashboard/friends">
                Friends
                <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          
        </div>

      </section>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a8070]" />
        <Input
          type="text"
          placeholder="Search titles, content, people, or notes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 rounded-2xl border-[#eadfd3] bg-white/80 pl-10 text-sm shadow-sm placeholder:text-[#b49f90]"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const selected = option.id === viewFilter;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setViewFilter(option.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
                selected
                  ? "border-[#d7c6b5] bg-white text-[#3d2e22] shadow-sm"
                  : "border-transparent bg-[#f1e8de] text-[#8d7563] hover:border-[#e2d6ca] hover:bg-white/80",
              )}
            >
              <span>{option.label}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px]", selected ? "bg-[#f6eee7] text-[#7a6a5a]" : "bg-white/75 text-[#9a8070]")}>{option.count}</span>
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center rounded-[1.75rem] border border-[#eadfd3] bg-white/60 p-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#9a8070]" />
        </div>
      )}

      {!loading && totalMemories === 0 && (
        <div className="rounded-[1.75rem] border border-dashed border-[#ddcfbf] bg-white/55 px-5 py-12 text-center">
          <p className="text-base font-medium text-[#3d2e22]">No memories yet</p>
          <p className="mt-2 text-sm leading-relaxed text-[#8d7563]">
            When you start saving memories or receiving them from friends, they will appear here in a single scrollable feed.
          </p>
        </div>
      )}

      {!loading && totalMemories > 0 && !hasVisibleResults && (
        <div className="rounded-[1.75rem] border border-dashed border-[#ddcfbf] bg-white/55 px-5 py-12 text-center">
          <p className="text-base font-medium text-[#3d2e22]">No matches for this view</p>
          <p className="mt-2 text-sm leading-relaxed text-[#8d7563]">Try a different search term or switch between your memories and shared memories.</p>
        </div>
      )}

      {!loading && hasVisibleResults && (
        <div className="space-y-5">
          {visibleSharedMemories.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold text-[#3d2e22]">Shared with you</h3>
                  <p className="text-xs text-[#8d7563]">Memories your circle has passed along for you to keep.</p>
                </div>
                <span className="rounded-full bg-[#e8f6f0] px-2.5 py-1 text-[10px] font-medium text-[#3e7362]">{visibleSharedMemories.length}</span>
              </div>
              <div className="space-y-3">
                {visibleSharedMemories.map((memory) => {
                  const memoryDate = new Date(memory.created_at);
                  const sharedDate = memory.sharedAt ? new Date(memory.sharedAt) : null;

                  return (
                    <Card
                      key={`shared-${memory.shareId ?? memory.id}`}
                      className="group cursor-pointer rounded-[1.75rem] border border-[#cfe5dc] bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(241,251,246,0.98)_100%)] shadow-[0_10px_30px_rgba(58,99,84,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(58,99,84,0.12)]"
                      onClick={() => handleMemoryClick(memory)}
                    >
                      <CardContent className="space-y-4 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 space-y-2">
                            <span className="inline-flex items-center rounded-full border border-[#b7dccd] bg-[#edf8f3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2e715d]">
                              Shared with you
                            </span>
                            <h3 className="break-words text-base font-semibold leading-snug text-[#214538]">{memory.title || "Untitled memory"}</h3>
                          </div>
                          <span className="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-[#6a8f82]">
                            {format(memoryDate, "MMM d")}
                          </span>
                        </div>

                        <p className="break-all text-sm leading-relaxed text-[#557b6d]">{truncateContent(memory.content)}</p>

                        {memory.comment ? (
                          <div className="rounded-[1.15rem] border border-[#d6ebe2] bg-white/80 px-3 py-2.5">
                            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b8d81]">Your note</p>
                            <p className="break-words mt-1 text-sm leading-relaxed text-[#426a5b]">{truncateContent(memory.comment, 120)}</p>
                          </div>
                        ) : null}

                        <Separator className="bg-[#dbeee6]" />

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#5d8578]">
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            From {getDisplayName(memory.owner)}
                          </span>
                          {sharedDate ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Inbox className="h-3.5 w-3.5" />
                              Shared {format(sharedDate, "MMM d, yyyy")}
                            </span>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {visibleOwnedMemories.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold text-[#3d2e22]">Your library</h3>
                  <p className="text-xs text-[#8d7563]">Private memories you can revisit or pass along to a friend.</p>
                </div>
                <span className="rounded-full bg-[#f4ece4] px-2.5 py-1 text-[10px] font-medium text-[#7c6554]">{visibleOwnedMemories.length}</span>
              </div>
              <div className="space-y-3">
                {visibleOwnedMemories.map((memory) => {
                  const memoryDate = new Date(memory.created_at);
                  const sharedRecipients = memory.sharedWith ?? [];
                  const isShared = sharedRecipients.length > 0;

                  return (
                    <Card
                      key={`owned-${memory.id}`}
                      className="group cursor-pointer rounded-[1.75rem] border border-[#eadfd3] bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(251,244,238,0.98)_100%)] shadow-[0_10px_28px_rgba(82,58,38,0.07)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(82,58,38,0.11)]"
                      onClick={() => handleMemoryClick(memory)}
                    >
                      <CardContent className="space-y-4 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-2">
                            <span className="inline-flex items-center rounded-full border border-[#e3d6c7] bg-[#fff9f3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6544]">
                              Your memory
                            </span>
                            <h3 className="text-base font-semibold leading-snug text-[#3d2e22]">{memory.title || "Untitled memory"}</h3>
                          </div>
                          <span className="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-[#8d7563]">
                            {format(memoryDate, "MMM d")}
                          </span>
                        </div>

                        <p className="text-sm leading-relaxed text-[#7c6657]">{truncateContent(memory.content)}</p>

                        <Separator className="bg-[#ede3d8]" />

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#8d7563]">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Saved {format(memoryDate, "MMM d, yyyy 'at' h:mm a")}
                          </span>
                          {isShared ? (
                            <span className="inline-flex items-center gap-1.5 text-[#537b6b]">
                              <Users className="h-3.5 w-3.5" />
                              {sharedRecipients.length} {sharedRecipients.length === 1 ? "friend" : "friends"}
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1.5 text-[#9a8070]">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            Open to edit or share
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      <MemoryDetailModal memory={selectedMemory} open={dialogOpen} onOpenChange={setDialogOpen} onUpdate={handleUpdate} />
    </div>
  );
}
