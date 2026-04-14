"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Persona,
  PERSONA_OPTIONS,
  normalizePersonaFromDb,
} from "@/lib/persona";

const CUSTOM_INSTRUCTION_MAX_LENGTH = 1000;

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
  ai_persona: string | null;
  custom_instruction: string | null;
}

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<Persona>("atlas");
  const [customInstruction, setCustomInstruction] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setProfile(data.user);
      setName(data.user.name || "");
      setType(normalizePersonaFromDb(data.user.ai_persona));
      setCustomInstruction(data.user.custom_instruction || "");
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInstruction = customInstruction.trim();

    if (trimmedInstruction.length > CUSTOM_INSTRUCTION_MAX_LENGTH) {
      toast.error(
        `Custom instruction must be ${CUSTOM_INSTRUCTION_MAX_LENGTH} characters or fewer`
      );
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type,
          customInstruction: trimmedInstruction || null,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      if (data.user) {
        setProfile(data.user);
        setName(data.user.name || "");
        setType(normalizePersonaFromDb(data.user.ai_persona));
        setCustomInstruction(data.user.custom_instruction || "");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
       <Card className="py-4 text-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-xs">Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-4 text-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <User className="w-5 h-5" />
          Profile Information
        </CardTitle>
        <CardDescription className="text-xs">Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || "Not set"}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Lofy&apos;s Persona</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as Persona)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select persona" />
              </SelectTrigger>
              <SelectContent>
                {PERSONA_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-instruction">Custom Instruction</Label>
            <Textarea
              id="custom-instruction"
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Example: Keep replies brief, use bullet points for plans, and ask before making assumptions."
              maxLength={CUSTOM_INSTRUCTION_MAX_LENGTH}
              className="min-h-32"
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground">
              This preference is injected with your conversation context to guide how Lofy responds. It helps steer style and behavior, but it won&apos;t override safety rules or your current request.
            </p>
            <p className="text-xs text-muted-foreground text-right">
              {customInstruction.length}/{CUSTOM_INSTRUCTION_MAX_LENGTH}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Account Created</Label>
            <Input
              value={new Date(profile?.created_at || "").toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
              disabled
              className="bg-muted"
            />
          </div>

          <Separator />

          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
