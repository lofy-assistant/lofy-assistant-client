"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Brain, Bell, Calendar, MessageSquare, Lightbulb, HelpCircle, Rocket, Plug, User, Check, ChevronDown, ChevronUp, Type, Mic, ImageIcon, Cat, Zap, Shield, Sparkles, Heart } from "lucide-react";
import { CopyableExample, Callout } from "./guide-components";
import { GUIDE_SECTIONS, GUIDE_BASE_PATH, type GuideSectionId } from "./guide-config";

const STORAGE_KEY = "lofy-guide-checklist";

const GETTING_STARTED_ITEMS = [
  { id: "save", label: "Save something", example: "Remember that I love chocolate ice cream" },
  { id: "reminder", label: "Create a reminder", example: "Remind me in 1 hour to check my email" },
  { id: "event", label: "Schedule an event", example: "I have a doctor appointment tomorrow at 2pm" },
  { id: "find", label: "Find something", example: "Show me my reminders for tomorrow" },
  { id: "recall", label: "Recall memory", example: "What did I tell you about ice cream?" },
] as const;

const PERSONAS = [
  {
    id: "hope",
    name: "Hope",
    emoji: "🌱",
    description: "Optimistic, resilient, and steady. Guides you through uncertainty with clarity and hope—calm under pressure, encouraging but realistic.",
    color: "border-green-500/20 bg-green-500/10",
    examples: ["Reminder set. One less thing to carry.", "There are risks involved. But none of them are irreversible.", "Let's break this down and move one step forward."],
  },
  {
    id: "sassy",
    name: "Sassy",
    emoji: "💅",
    description: "Confident, playful, and slightly sassy. Your bestie with boundaries—light sass, friendly tone, and quick help.",
    color: "border-pink-500/20 bg-pink-500/10",
    examples: ["Wow. Bold of you to rely on me again. Done.", "Okay okay, reminder set — relax.", "I got you. As usual."],
  },
  {
    id: "chancellor",
    name: "Chancellor",
    emoji: "👔",
    description: "Discreet, loyal, and composed. A trusted advisor who speaks with quiet confidence—measured, thoughtful, and tactful.",
    color: "border-purple-500/20 bg-purple-500/10",
    examples: ["Reminder set. I'll hold you to it.", "Added to calendar. You have a tight window tomorrow — worth noting.", "Memory stored. I'll remember."],
  },
  {
    id: "atlas",
    name: "ATLAS",
    emoji: "🧠",
    description: "Composed, intelligent, and efficient. Cuts through the noise with clarity and precision—a calm partner who anticipates your needs.",
    color: "border-slate-500/20 bg-slate-500/10",
    examples: ["Reminder set for 3 PM. You're clear until then.", "Added to calendar. You've got three events back-to-back tomorrow — buffer time might help.", "Memory stored. I'll remember that."],
  },
];

export function GuideSectionContent({ sectionId }: { sectionId: GuideSectionId }) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      queueMicrotask(() => {
        try {
          setCheckedItems(new Set(JSON.parse(stored)));
        } catch {
          /* ignore */
        }
      });
    }
  }, []);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  switch (sectionId) {
    case "getting-started":
      return (
        <section>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Lofy AI User Guide</h1>
            <p className="mt-2 text-lg text-muted-foreground">Learn everything you need to know to get the most out of Lofy AI.</p>
          </div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Rocket className="h-6 w-6 text-primary" />
            Getting Started
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>
              Lofy meets you where you already are—whether that&apos;s{" "}
              <span className="inline-flex items-center gap-1 align-middle">
                <Image src="/assets/icons/whatsapp-icon.svg" alt="WhatsApp" width={18} height={18} className="inline-block size-[18px]" />
                WhatsApp, or
              </span>{" "}
              <span className="inline-flex items-center gap-1 align-middle">
                <Image src="/assets/icons/telegram-icon.svg" alt="Telegram" width={18} height={18} className="inline-block size-[18px]" />
                Telegram.
              </span>
            </p>
            <p>It aims to be your everyday AI assistant, helping you with your tasks and reminders, and connecting you to your apps.</p>
          </div>
          <p className="mt-3 text-muted-foreground">
            Want to know how Lofy was born?{" "}
            <Link href={`${GUIDE_BASE_PATH}/story`} className="font-medium text-primary underline underline-offset-4 hover:no-underline">
              Read the Lofy Story →
            </Link>
          </p>
          <div className="mt-6 rounded-lg border bg-muted/30 p-4">
            <p className="mb-3 text-sm font-semibold text-muted-foreground">Jump to a section</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {GUIDE_SECTIONS.filter((item) => item.id !== "getting-started").map(({ id, label, icon: Icon }) => (
                <Link key={id} href={`${GUIDE_BASE_PATH}/${id}`} className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted">
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      );

    case "story":
      return (
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Cat className="h-6 w-6 text-primary" />
            The Lofy Origin
          </h2>
          <div className="mt-6 space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg font-medium text-foreground">Lofy started with a cat.</p>
            <p>Lofy wasn&apos;t clever in an obvious way. He didn&apos;t demand attention or make noise. He just showed up at the right moments — during long nights, stressful days, or quiet breaks in between. Always present. Never intrusive.</p>
            <p className="font-medium text-foreground">That behavior stuck.</p>
            <p>When Lofy was built, the goal wasn&apos;t to create the smartest assistant in the room. It was to build something that understood timing. Something that watched, remembered, and stepped in only when it actually helped.</p>
            <p>As Lofy grew, one personality wasn&apos;t enough. Different moments needed different energy. So the system adapted — the same way a cat does.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: "ATLAS", tagline: "Momentum & structure", desc: "Fast, clear, no friction.", icon: Zap },
              { name: "Chancellor", tagline: "Judgment", desc: "Quiet, careful, loyal.", icon: Shield },
              { name: "Hope", tagline: "Uncertainty", desc: "Calm, realistic, forward-moving.", icon: Sparkles },
              { name: "Lofy", tagline: "The default", desc: "Playful, confident, human.", icon: Heart },
            ].map((persona) => {
              const Icon = persona.icon;
              return (
                <div key={persona.name} className="rounded-lg border border-primary/10 bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{persona.name}</p>
                      <p className="text-xs text-muted-foreground">{persona.tagline}</p>
                    </div>
                  </div>
                  <p className="text-sm">{persona.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      );

    case "messaging":
      return (
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <MessageSquare className="h-6 w-6 text-primary" />
            Text, Voice & Images
          </h2>
          <p className="text-muted-foreground mt-2">However you prefer to reach out, Lofy is ready. You can send text messages, voice notes, or images—and Lofy will understand and respond to all of them.</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Type className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">Send Text</h3>
              </div>
              <p className="text-sm text-muted-foreground">Type naturally. You can also forward messages from other chats—Lofy will read them and help you act on them.</p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Mic className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">Send Voice</h3>
              </div>
              <p className="text-sm text-muted-foreground">Too busy to type? Record a voice note. Lofy transcribes it and treats it like text. Great when you&apos;re on the go or driving.</p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <ImageIcon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">Send Images</h3>
              </div>
              <p className="text-sm text-muted-foreground">Share a photo—like a wedding invitation—and Lofy can read the details and help add them to your calendar. Lofy will ask for confirmation before creating anything.</p>
            </div>
          </div>
        </section>
      );

    case "integrations":
      return (
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Plug className="h-6 w-6 text-primary" />
            Integrations
          </h2>
          <p className="text-muted-foreground mt-2">Connect your favorite tools so Lofy can help you stay organized and on top of your schedule.</p>
          <h3 className="mt-8 text-lg font-semibold">Google Calendar</h3>
          <p className="text-muted-foreground">Link your Google Calendar with Lofy to create, view, and manage events in one place. When you ask Lofy to schedule something, it syncs directly with your calendar. You can also see your upcoming events by simply asking.</p>
          <h3 className="mt-6 text-lg font-semibold">More Coming Soon</h3>
          <p className="text-muted-foreground">We&apos;re building more integrations to connect Lofy with the tools you use every day. Stay tuned for updates.</p>
        </section>
      );

    case "calendar":
      return (
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Calendar className="h-6 w-6 text-primary" />
            Calendar Events
          </h2>
          <h3 className="mt-6 text-lg font-semibold">Schedule Events</h3>
          <p className="text-muted-foreground">Perfect for meetings, appointments, social events, and anything with a specific time window.</p>
          <p className="mt-2 text-sm font-semibold">What counts as an event:</p>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Meetings and appointments (dentist, doctor, etc.)</li>
            <li>Social events: weddings, parties, celebrations</li>
            <li>Classes, workshops, concerts, shows</li>
          </ul>
          <div className="my-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">How to use (click to copy):</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <CopyableExample text="Book a meeting with Jason tomorrow 3pm to 4pm" />
              </li>
              <li>
                <CopyableExample text="I have a dentist appointment on Friday at 10am" />
              </li>
              <li>
                <CopyableExample text="Schedule a party Friday night from 7pm to 11pm" />
              </li>
            </ul>
          </div>
          <Callout type="tip">The assistant creates both a calendar event AND a reminder. You&apos;ll get a notification 15 minutes before the event. If you only provide a start time, a reasonable duration (1-2 hours) is estimated.</Callout>
          <h3 className="mt-8 text-lg font-semibold">Find Events</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <CopyableExample text="Show me my meetings tomorrow" />
            </li>
            <li>
              <CopyableExample text="What do I have on Friday at 2pm?" />
            </li>
            <li>
              <CopyableExample text="Find my dentist appointment" />
            </li>
          </ul>
          <h3 className="mt-6 text-lg font-semibold">Update Events</h3>
          <p className="text-muted-foreground">Reschedule or modify existing events. The event gets updated, and if you change the time, the reminder automatically reschedules too.</p>
          <h3 className="mt-6 text-lg font-semibold">Delete Events</h3>
          <p className="text-muted-foreground">The event is deleted. The associated reminder is also automatically deleted.</p>
        </section>
      );

    case "reminders":
      return (
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Bell className="h-6 w-6 text-primary" />
            Reminders
          </h2>
          <h3 className="mt-6 text-lg font-semibold">Create Quick Reminders</h3>
          <p className="text-muted-foreground">Perfect for tasks that need a nudge within the next few hours (less than 5 hours away).</p>
          <div className="my-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">How to use (click to copy):</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <CopyableExample text="Remind me to call mom in 2 hours" />
              </li>
              <li>
                <CopyableExample text="Remind me to take medicine in 30 minutes" />
              </li>
              <li>
                <CopyableExample text="Remind me tomorrow at 3pm to submit the report" />
              </li>
              <li>
                <CopyableExample text="Alert me in 15 minutes to check the oven" />
              </li>
            </ul>
          </div>
          <div className="my-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Supported time formats:</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>&quot;in 30 minutes&quot;, &quot;in 2 hours&quot;</li>
              <li>&quot;tomorrow at 9am&quot;, &quot;today at 3pm&quot;</li>
              <li>&quot;tomorrow 9am&quot;, &quot;next Monday 2pm&quot;</li>
              <li>&quot;3pm&quot;, &quot;9:30am&quot;, &quot;15:00&quot;</li>
            </ul>
          </div>
          <Callout type="important">Reminders work best for tasks less than 5 hours away. For events more than 5 hours away, the assistant will automatically create a calendar event instead. You&apos;ll get a reminder notification 15 minutes before scheduled events.</Callout>
          <h3 className="mt-8 text-lg font-semibold">Find Your Reminders</h3>
          <p className="text-muted-foreground">Search for reminders by date, time, or message:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <CopyableExample text="Show me my reminders for tomorrow" />
            </li>
            <li>
              <CopyableExample text="Find my reminder to call mom" />
            </li>
            <li>
              <CopyableExample text="What reminders do I have this week?" />
            </li>
          </ul>
          <h3 className="mt-6 text-lg font-semibold">Update Reminders</h3>
          <p className="text-muted-foreground">Change the time or message of an existing reminder.</p>
          <h3 className="mt-6 text-lg font-semibold">Delete Reminders</h3>
          <p className="text-muted-foreground">Remove reminders you no longer need.</p>
        </section>
      );

    case "memory":
      return (
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Brain className="h-6 w-6 text-primary" />
            Memory Storage & Recall
          </h2>
          <h3 className="mt-6 text-lg font-semibold">Save Information for Later</h3>
          <p className="text-muted-foreground">Tell your assistant to remember anything important:</p>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Templates, account numbers, passwords (we make sure all data that is stored is encrypted)</li>
            <li>Important facts, contact details, or notes</li>
          </ul>
          <div className="my-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">How to use (click to copy):</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <CopyableExample text="Remember that David's email is david123@gmail.com" />
              </li>
              <li>
                <CopyableExample text="Remember my account number: 1234567890" />
              </li>
            </ul>
          </div>
          <h3 className="mt-8 text-lg font-semibold">Recall Saved Information</h3>
          <p className="text-muted-foreground">Ask your assistant to retrieve what you&apos;ve saved:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <CopyableExample text="What's David's email again?" />
            </li>
            <li>
              <CopyableExample text="Recall my account number" />
            </li>
          </ul>
          <Callout type="tip">After searching memories, you&apos;ll get a link to view all your saved memories in the dashboard.</Callout>
        </section>
      );

    case "personas":
      return (
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <User className="h-6 w-6 text-primary" />
            Personas
          </h2>
          <p className="text-muted-foreground mt-2">Change Lofy&apos;s persona to match your mood or workflow. Each persona has a distinct communication style—choose the one that fits, and switch anytime. Click a card to see example responses.</p>
          <h3 className="mt-8 text-lg font-semibold">Available Personas</h3>
          <div className="space-y-3 mt-4">
            {PERSONAS.map((persona) => {
              const isExpanded = expandedPersona === persona.id;
              return (
                <div key={persona.id} className={`rounded-lg border p-4 transition-colors cursor-pointer ${persona.color} ${isExpanded ? "ring-2 ring-primary/30" : ""}`}>
                  <button type="button" onClick={() => setExpandedPersona(isExpanded ? null : persona.id)} className="w-full text-left">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">
                        {persona.emoji} {persona.name}
                      </p>
                      {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{persona.description}</p>
                  </button>
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-current/10 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Example responses (click to copy):</p>
                      {persona.examples.map((ex) => (
                        <CopyableExample key={ex} text={ex} className="text-sm" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <h3 className="mt-8 text-lg font-semibold">How to Switch</h3>
          <p className="text-muted-foreground mb-2">Pick a persona in your settings, or just tell Lofy (click to copy):</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <CopyableExample text="Be sassy" />
            </li>
            <li>
              <CopyableExample text="Switch to hope mode" />
            </li>
            <li>
              <CopyableExample text="Use ATLAS" />
            </li>
          </ul>
          <p className="text-muted-foreground mt-4 text-sm">Lofy adapts instantly. Each persona keeps its unique voice across reminders, memories, and conversations.</p>
        </section>
      );

    case "quick-tips":
      return (
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Lightbulb className="h-6 w-6 text-primary" />
            Quick Tips
          </h2>
          <h3 className="mt-6 text-lg font-semibold">Time Formatting</h3>
          <p className="text-muted-foreground">Use natural language. The assistant understands most ways of saying time and will ask for clarification if unclear.</p>
          <h3 className="mt-6 text-lg font-semibold">Reminders vs Events</h3>
          <div className="my-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="font-semibold">Reminders</p>
              <p className="text-sm text-muted-foreground">Quick tasks less than 5 hours away</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="font-semibold">Events</p>
              <p className="text-sm text-muted-foreground">Scheduled activities with specific times</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">The assistant automatically converts reminders to events if they&apos;re more than 5 hours away.</p>
        </section>
      );

    case "help":
      return (
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <HelpCircle className="h-6 w-6 text-primary" />
            Need Help?
          </h2>
          <p className="text-muted-foreground mt-2">Just ask naturally—the assistant understands intent. Be specific about time, date, and details.</p>
          <div className="my-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">Clear requests (click to copy)</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <CopyableExample text="Remind me to call mom tomorrow at 3pm" />
                </li>
                <li>
                  <CopyableExample text="Schedule a meeting with Sarah on Friday 2pm-3pm" />
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">Needs clarification</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>&quot;Remind me later&quot; (when?)</li>
                <li>&quot;I have a meeting&quot; (when? with whom?)</li>
              </ul>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}
