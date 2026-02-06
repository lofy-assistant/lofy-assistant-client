"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Calendar } from "lucide-react";
import { MemoryDetailModal } from "@/components/dashboard/memories/memory-detail-modal";
import { Separator } from "@/components/ui/separator";

interface Memory {
  id: number;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export function MemoryGrid() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchMemories = async (search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/memories?${params.toString()}`, {
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

      const data = await response.json();

      if (!data.memories) {
        throw new Error("Invalid response format");
      }

      setMemories(data.memories);
    } catch (err) {
      console.error("Error fetching memories:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() || searchQuery === "") {
        fetchMemories(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setDialogOpen(true);
  };

  const handleUpdate = () => {
    fetchMemories(searchQuery);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="text" placeholder="Search memories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!loading && memories.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-lg text-muted-foreground">{searchQuery ? "No memories found matching your search" : "No memories yet"}</p>
        </div>
      )}

      {/* Grid Layout */}
      {!loading && memories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memories.map((memory) => {
            const memoryDate = new Date(memory.created_at);

            return (
              <Card key={memory.id} className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary" onClick={() => handleMemoryClick(memory)}>
                <CardContent className="p-5 space-y-3">
                  {/* Title */}
                  <h3 className="text-lg font-semibold line-clamp-2">{memory.title || "Untitled Memory"}</h3>

                  <Separator />

                  {/* Content Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">{truncateContent(memory.content)}</p>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(memoryDate, "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Memory Detail Modal */}
      <MemoryDetailModal memory={selectedMemory} open={dialogOpen} onOpenChange={setDialogOpen} onUpdate={handleUpdate} />
    </div>
  );
}
