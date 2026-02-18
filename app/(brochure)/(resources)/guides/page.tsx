"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  Bell,
  Calendar,
  MessageSquare,
  Lightbulb,
  HelpCircle,
  Rocket,
  CheckCircle2,
  XCircle,
  Menu,
  BookOpen,
  Plug,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { id: "getting-started", label: "Getting Started", icon: Rocket },
  { id: "messaging", label: "Text, Voice & Images", icon: MessageSquare },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "calendar", label: "Calendar Events", icon: Calendar },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "memory", label: "Memory Storage & Recall", icon: Brain },
  { id: "personas", label: "Personas", icon: User },
  { id: "quick-tips", label: "Quick Tips", icon: Lightbulb },
  { id: "help", label: "Need Help?", icon: HelpCircle },
] as const;

function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "tip" | "important";
  title?: string;
  children: React.ReactNode;
}) {
  const label = type === "tip" ? "Tip" : type === "important" ? "Important" : null;
  const showHeader = label || title;
  return (
    <div
      className={cn(
        "rounded-lg border p-4 my-4",
        type === "tip" && "bg-primary/5 border-primary/20",
        type === "important" && "bg-amber-500/10 border-amber-500/30 dark:bg-amber-500/5 dark:border-amber-500/20",
        type === "info" && "bg-muted/50 border-border"
      )}
    >
      {showHeader && (
        <p className="mb-2 text-sm font-semibold">
          {label && `${label}${title ? ": " : ""}`}
          {title}
        </p>
      )}
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function DocsSidebar({
  activeId,
  onItemClick,
  className,
}: {
  activeId: string | null;
  onItemClick: (id: string) => void;
  className?: string;
}) {
  return (
    <nav className={cn("space-y-1", className)}>
      <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <BookOpen className="h-4 w-4" />
        On this page
      </div>
      {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => {
            e.preventDefault();
            onItemClick(id);
          }}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
            activeId === id
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </a>
      ))}
    </nav>
  );
}

export default function GuidesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px", threshold: 0 }
    );

    SIDEBAR_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar trigger */}
      <div className="sticky top-0 z-40 flex items-center gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/60 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Lofy AI User Guide</h1>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r bg-background p-6 pt-20 transition-transform lg:sticky lg:top-0 lg:z-0 lg:self-start lg:translate-x-0 lg:pt-6",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <DocsSidebar activeId={activeId} onItemClick={scrollToSection} />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-8 lg:pl-10 lg:pr-12">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Lofy AI User Guide
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Learn everything you need to know to get the most out of Lofy AI.
                Manage your life with reminders, calendar events, and memory
                storage.
              </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              {/* Getting Started */}
              <section
                id="getting-started"
                className="scroll-mt-24 pb-12"
              >
                <h2 className="group flex items-center gap-2 text-2xl font-bold">
                  <Rocket className="h-6 w-6 text-primary" />
                  Getting Started
                </h2>
                <p className="text-muted-foreground">
                  Try these to get familiar:
                </p>
                <ol className="mt-4 list-decimal space-y-3 pl-6 text-muted-foreground">
                  <li>
                    <strong>Save something:</strong> &quot;Remember that I love
                    chocolate ice cream&quot;
                  </li>
                  <li>
                    <strong>Create a reminder:</strong> &quot;Remind me in 1 hour
                    to check my email&quot;
                  </li>
                  <li>
                    <strong>Schedule an event:</strong> &quot;I have a doctor
                    appointment tomorrow at 2pm&quot;
                  </li>
                  <li>
                    <strong>Find something:</strong> &quot;Show me my reminders
                    for tomorrow&quot;
                  </li>
                  <li>
                    <strong>Recall memory:</strong> &quot;What did I tell you
                    about ice cream?&quot;
                  </li>
                </ol>
              </section>

              {/* Text, Voice & Images */}
              <section id="messaging" className="scroll-mt-24 border-t pt-12 pb-12">
                <h2 className="group flex items-center gap-2 text-2xl font-bold">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Text, Voice & Images
                </h2>
                <p className="text-muted-foreground">
                  However you prefer to reach out, Lofy is ready. You can send
                  text messages, voice notes, or images—and Lofy will understand
                  and respond to all of them.
                </p>

                <h3 className="mt-8 text-lg font-semibold">Send Text</h3>
                <p className="text-muted-foreground">
                  Type naturally. You can also forward messages from other
                  chats—Lofy will read them and help you act on them.
                </p>

                <h3 className="mt-6 text-lg font-semibold">Send Voice Messages</h3>
                <p className="text-muted-foreground">
                  Too busy to type? Record a voice note instead. Lofy transcribes
                  it and treats it just like text. Great when you&apos;re
                  on the go or driving.
                </p>

                <h3 className="mt-6 text-lg font-semibold">Send Images</h3>
                <p className="text-muted-foreground">
                  Share a photo—like a wedding invitation or event flyer—and Lofy
                  can read the details and help you add them to your calendar. For
                  events and reminders, Lofy will ask for your confirmation
                  before creating anything.
                </p>
              </section>

              {/* Integrations */}
              <section id="integrations" className="scroll-mt-24 border-t pt-12 pb-12">
                <h2 className="group flex items-center gap-2 text-2xl font-bold">
                  <Plug className="h-6 w-6 text-primary" />
                  Integrations
                </h2>
                <p className="text-muted-foreground">
                  Connect your favorite tools so Lofy can help you stay organized
                  and on top of your schedule.
                </p>

                <h3 className="mt-8 text-lg font-semibold">Google Calendar</h3>
                <p className="text-muted-foreground">
                  Link your Google Calendar with Lofy to create, view, and manage
                  events in one place. When you ask Lofy to schedule something,
                  it syncs directly with your calendar. You can also see your
                  upcoming events by simply asking.
                </p>

                <h3 className="mt-6 text-lg font-semibold">More Coming Soon</h3>
                <p className="text-muted-foreground">
                  We&apos;re building more integrations to connect Lofy with the
                  tools you use every day. Stay tuned for updates.
                </p>
              </section>

              {/* Calendar Events */}
              <section id="calendar" className="scroll-mt-24 border-t pt-12 pb-12">
                <h2 className="group flex items-center gap-2 text-2xl font-bold">
                  <Calendar className="h-6 w-6 text-primary" />
                  Calendar Events
                </h2>
                <h3 className="mt-6 text-lg font-semibold">
                  Schedule Events
                </h3>
                <p className="text-muted-foreground">
                  Perfect for meetings, appointments, social events, and anything
                  with a specific time window.
                </p>
                <p className="mt-2 text-sm font-semibold">
                  What counts as an event:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li>Meetings and appointments (dentist, doctor, etc.)</li>
                  <li>Social events: weddings, parties, celebrations</li>
                  <li>Classes, workshops, concerts, shows</li>
                </ul>
                <div className="my-4 rounded-lg bg-muted p-4">
                  <p className="mb-2 text-sm font-semibold">How to use:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>&quot;Book a meeting with Jason tomorrow 3pm to 4pm&quot;</li>
                    <li>&quot;I have a dentist appointment on Friday at 10am&quot;</li>
                    <li>&quot;Schedule a party Friday night from 7pm to 11pm&quot;</li>
                  </ul>
                </div>
                <Callout type="tip">
                  The assistant creates both a calendar event AND a reminder.
                  You&apos;ll get a notification 15 minutes before the event. If
                  you only provide a start time, a reasonable duration (1-2
                  hours) is estimated.
                </Callout>

                <h3 className="mt-8 text-lg font-semibold">Find Events</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>&quot;Show me my meetings tomorrow&quot;</li>
                  <li>&quot;What do I have on Friday at 2pm?&quot;</li>
                  <li>&quot;Find my dentist appointment&quot;</li>
                </ul>

                <h3 className="mt-6 text-lg font-semibold">Update Events</h3>
                <p className="text-muted-foreground">
                  Reschedule or modify existing events. The event gets updated,
                  and if you change the time, the reminder automatically
                  reschedules too.
                </p>

                <h3 className="mt-6 text-lg font-semibold">Delete Events</h3>
                <p className="text-muted-foreground">
                  The event is deleted. The associated reminder is also
                  automatically deleted.
                </p>
              </section>

              {/* Reminders */}
              <section id="reminders" className="scroll-mt-24 border-t pt-12 pb-12">
                <h2 className="group flex items-center gap-2 text-2xl font-bold">
                  <Bell className="h-6 w-6 text-primary" />
                  Reminders
                </h2>
                <h3 className="mt-6 text-lg font-semibold">
                  Create Quick Reminders
                </h3>
                <p className="text-muted-foreground">
                  Perfect for tasks that need a nudge within the next few hours
                  (less than 5 hours away).
                </p>
                <div className="my-4 rounded-lg bg-muted p-4">
                  <p className="mb-2 text-sm font-semibold">How to use:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>&quot;Remind me to call mom in 2 hours&quot;</li>
                    <li>&quot;Remind me to take medicine in 30 minutes&quot;</li>
                    <li>&quot;Remind me tomorrow at 3pm to submit the report&quot;</li>
                    <li>&quot;Alert me in 15 minutes to check the oven&quot;</li>
                  </ul>
                </div>
                <div className="my-4 rounded-lg bg-muted p-4">
                  <p className="mb-2 text-sm font-semibold">
                    Supported time formats:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>&quot;in 30 minutes&quot;, &quot;in 2 hours&quot;</li>
                    <li>&quot;tomorrow at 9am&quot;, &quot;today at 3pm&quot;</li>
                    <li>&quot;tomorrow 9am&quot;, &quot;next Monday 2pm&quot;</li>
                    <li>&quot;3pm&quot;, &quot;9:30am&quot;, &quot;15:00&quot;</li>
                  </ul>
                </div>
                <Callout type="important">
                  Reminders work best for tasks less than 5 hours away. For
                  events more than 5 hours away, the assistant will
                  automatically create a calendar event instead. You&apos;ll get
                  a reminder notification 15 minutes before scheduled events.
                </Callout>

                <h3 className="mt-8 text-lg font-semibold">
                  Find Your Reminders
                </h3>
                <p className="text-muted-foreground">
                  Search for reminders by date, time, or message:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>&quot;Show me my reminders for tomorrow&quot;</li>
                  <li>&quot;Find my reminder to call mom&quot;</li>
                  <li>&quot;What reminders do I have this week?&quot;</li>
                </ul>

                <h3 className="mt-6 text-lg font-semibold">Update Reminders</h3>
                <p className="text-muted-foreground">
                  Change the time or message of an existing reminder:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>&quot;Change my reminder to call mom to 4pm instead&quot;</li>
                  <li>&quot;Update my reminder - change the time to tomorrow at 2pm&quot;</li>
                </ul>

                <h3 className="mt-6 text-lg font-semibold">Delete Reminders</h3>
                <p className="text-muted-foreground">
                  Remove reminders you no longer need:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>&quot;Delete my reminder to take medicine&quot;</li>
                  <li>&quot;Cancel my reminder&quot;</li>
                </ul>
              </section>

              {/* Memory Storage & Recall */}
              <section id="memory" className="scroll-mt-24 border-t pt-12 pb-12">
                <h2 className="group flex items-center gap-2 text-2xl font-bold">
                  <Brain className="h-6 w-6 text-primary" />
                  Memory Storage & Recall
                </h2>
                <h3 className="mt-6 text-lg font-semibold">
                  Save Information for Later
                </h3>
                <p className="text-muted-foreground">
                  Tell your assistant to remember anything important:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li>
                    Templates, account numbers, passwords (we make sure all data
                    that is stored is encrypted)
                  </li>
                  <li>Important facts, contact details, or notes</li>
                </ul>
                <div className="my-4 rounded-lg bg-muted p-4">
                  <p className="mb-2 text-sm font-semibold">How to use:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      &quot;Remember that David&apos;s email is
                      david123@gmail.com&quot;
                    </li>
                    <li>&quot;Remember my account number: 1234567890&quot;</li>
                  </ul>
                </div>

                <h3 className="mt-8 text-lg font-semibold">
                  Recall Saved Information
                </h3>
                <p className="text-muted-foreground">
                  Ask your assistant to retrieve what you&apos;ve saved:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>&quot;What&apos;s David&apos;s email again?&quot;</li>
                  <li>&quot;Recall my account number&quot;</li>
                </ul>
                <Callout type="tip">
                  After searching memories, you&apos;ll get a link to view all your
                  saved memories in the dashboard.
                </Callout>
              </section>

              {/* Personas */}
              <section id="personas" className="scroll-mt-24 border-t pt-12 pb-12">
                <h2 className="group flex items-center gap-2 text-2xl font-bold">
                  <User className="h-6 w-6 text-primary" />
                  Personas
                </h2>
                <p className="text-muted-foreground">
                  Change Lofy&apos;s persona to match your mood or workflow. Each
                  persona has a distinct communication style—choose the one that
                  fits, and switch anytime.
                </p>

                <h3 className="mt-8 text-lg font-semibold">Available Personas</h3>
                <div className="space-y-4 mt-4">
                  <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                    <p className="font-semibold">🌱 Hope</p>
                    <p className="text-sm text-muted-foreground">
                      Optimistic, resilient, and steady. Guides you through
                      uncertainty with clarity and hope—calm under pressure,
                      encouraging but realistic.
                    </p>
                  </div>
                  <div className="rounded-lg border border-pink-500/20 bg-pink-500/10 p-4">
                    <p className="font-semibold">💅 Sassy</p>
                    <p className="text-sm text-muted-foreground">
                      Confident, playful, and slightly sassy. Your bestie with
                      boundaries—light sass, friendly tone, and quick help.
                    </p>
                  </div>
                  <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                    <p className="font-semibold">👔 Chancellor</p>
                    <p className="text-sm text-muted-foreground">
                      Discreet, loyal, and composed. A trusted advisor who speaks
                      with quiet confidence—measured, thoughtful, and tactful.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-500/20 bg-slate-500/10 p-4">
                    <p className="font-semibold">🧠 ATLAS</p>
                    <p className="text-sm text-muted-foreground">
                      Composed, intelligent, and efficient. Cuts through the
                      noise with clarity and precision—a calm partner who
                      anticipates your needs.
                    </p>
                  </div>
                </div>

                <h3 className="mt-8 text-lg font-semibold">How to Switch</h3>
                <p className="text-muted-foreground">
                  Pick a persona in your settings, or just tell Lofy: &quot;Be
                  sassy&quot;, &quot;Switch to hope mode&quot;, or &quot;Use
                  ATLAS&quot;. Lofy adapts instantly. Each persona keeps its
                  unique voice across reminders, memories, and conversations.
                </p>
              </section>

              {/* Quick Tips */}
              <section id="quick-tips" className="scroll-mt-24 border-t pt-12 pb-12">
                <h2 className="group flex items-center gap-2 text-2xl font-bold">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  Quick Tips
                </h2>
                <h3 className="mt-6 text-lg font-semibold">
                  Time Formatting
                </h3>
                <p className="text-muted-foreground">
                  Use natural language. The assistant understands most ways of
                  saying time and will ask for clarification if unclear.
                </p>

                <h3 className="mt-6 text-lg font-semibold">
                  Reminders vs Events
                </h3>
                <div className="my-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="font-semibold">Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Quick tasks less than 5 hours away
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="font-semibold">Events</p>
                    <p className="text-sm text-muted-foreground">
                      Scheduled activities with specific times
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  The assistant automatically converts reminders to events if
                  they&apos;re more than 5 hours away.
                </p>
              </section>

              {/* Need Help */}
              <section id="help" className="scroll-mt-24 border-t pt-12 pb-12">
                <h2 className="group flex items-center gap-2 text-2xl font-bold">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  Need Help?
                </h2>
                <p className="text-muted-foreground">
                  Just ask naturally—the assistant understands intent. Be
                  specific about time, date, and details.
                </p>
                <div className="my-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Clear requests
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>&quot;Remind me to call mom tomorrow at 3pm&quot;</li>
                      <li>&quot;Schedule a meeting with Sarah on Friday 2pm-3pm&quot;</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                      <XCircle className="h-4 w-4" />
                      Needs clarification
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>&quot;Remind me later&quot; (when?)</li>
                      <li>&quot;I have a meeting&quot; (when? with whom?)</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
