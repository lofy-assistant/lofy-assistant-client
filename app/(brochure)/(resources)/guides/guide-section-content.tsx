"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  Bell,
  Calendar,
  MessageSquare,
  Lightbulb,
  HelpCircle,
  Rocket,
  Plug,
  User,
  Check,
  ChevronDown,
  ChevronUp,
  Type,
  Mic,
  ImageIcon,
  Cat,
  Zap,
  Heart,
  Guitar,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { CopyableExample, Callout, GuideKicker, GuidePageTitle, GuideExamplePanel, GuideSubheading } from "./guide-components";
import { GUIDE_SECTIONS, GUIDE_BASE_PATH, type GuideSectionId } from "./guide-config";
import { PERSONA_MARKETING_LIST } from "@/lib/persona";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "lofy-guide-checklist";

const GETTING_STARTED_ITEMS = [
  { id: "save", label: "Save something", example: "Remember that I love chocolate ice cream" },
  { id: "reminder", label: "Create a reminder", example: "Remind me in 1 hour to check my email" },
  { id: "event", label: "Schedule an event", example: "I have a doctor appointment tomorrow at 2pm" },
  { id: "find", label: "Find something", example: "Show me my reminders for tomorrow" },
  { id: "recall", label: "Recall memory", example: "What did I tell you about ice cream?" },
] as const;

const GUIDE_PERSONAS = PERSONA_MARKETING_LIST.map((p) => ({
  id: p.value,
  displayName: `${p.heroEmoji} ${p.cardTitle}`,
  description: p.description,
  color: p.colorClass,
  examples: p.examples,
}));

function ChecklistRow({
  id,
  label,
  example,
  checked,
  onToggle,
}: {
  id: string;
  label: string;
  example: string;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-4 transition-colors",
        checked ? "border-primary/25 bg-primary/[0.04]" : "border-border/70 bg-card/60 hover:border-border"
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onToggle(id)}
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/35 bg-background hover:border-primary/50"
        )}
        aria-label={`Mark: ${label}`}
      >
        {checked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </button>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="font-medium text-foreground">{label}</p>
        <CopyableExample text={example} className="text-sm text-muted-foreground" />
      </div>
    </div>
  );
}

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
        <section className="not-prose space-y-12">
          <div>
            <GuideKicker icon={Rocket}>Start here</GuideKicker>
            <GuidePageTitle
              icon={Rocket}
              title="How to get the most out of Lofy"
              description="Lofy is built for natural language, so you never need a command cheatsheet. This guide shows patterns that work reliably, then points you to the details."
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <Card className="border-border/70 shadow-md">
              <CardContent className="space-y-4 p-6 sm:p-7">
                <GuideSubheading>Chat where you already are</GuideSubheading>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Lofy meets you on{" "}
                  <span className="inline-flex items-center gap-1.5 align-middle font-medium text-foreground">
                    <Image src="/assets/icons/whatsapp-icon.svg" alt="" width={18} height={18} className="inline-block size-[18px]" />
                    WhatsApp
                  </span>{" "}
                  or{" "}
                  <span className="inline-flex items-center gap-1.5 align-middle font-medium text-foreground">
                    <Image src="/assets/icons/telegram-icon.svg" alt="" width={18} height={18} className="inline-block size-[18px]" />
                    Telegram
                  </span>
                  . Say things the way you would to a friend who is great at logistics: include time, place, and who is involved when it matters.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href="/register"
                    className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-95"
                  >
                    Get started
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background/90 px-5 text-sm font-medium backdrop-blur transition hover:bg-muted/70"
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden />
                    Dashboard
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <GuideSubheading>First session checklist</GuideSubheading>
                <span className="text-xs text-muted-foreground">
                  {checkedItems.size}/{GETTING_STARTED_ITEMS.length} done
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Try these once. Progress saves in this browser.</p>
              <div className="space-y-3">
                {GETTING_STARTED_ITEMS.map((item) => (
                  <ChecklistRow
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    example={item.example}
                    checked={checkedItems.has(item.id)}
                    onToggle={toggleCheck}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <GuideSubheading className="mb-4">Jump to a topic</GuideSubheading>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {GUIDE_SECTIONS.filter((item) => item.id !== "getting-started").map(({ id, label, icon: Icon }) => (
                <Link
                  key={id}
                  href={`${GUIDE_BASE_PATH}/${id}`}
                  className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card/50 px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/25 hover:bg-primary/[0.03]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-primary/10 transition group-hover:border-primary/20">
                    <Icon className="h-4 w-4 text-primary" aria-hidden />
                  </span>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Curious where the name came from?{" "}
            <Link href={`${GUIDE_BASE_PATH}/story`} className="font-medium text-primary underline-offset-4 hover:underline">
              Read the Lofy story
            </Link>
            .
          </p>
        </section>
      );

    case "story":
      return (
        <section className="not-prose space-y-10">
          <div>
            <GuideKicker icon={Cat}>Lofy</GuideKicker>
            <GuidePageTitle icon={Cat} title="The Lofy origin" description="Why the product feels the way it does, and how the personas fit that idea." />
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p className="text-lg font-medium text-foreground">Lofy started with a cat.</p>
            <p>Lofy wasn&apos;t clever in an obvious way. He didn&apos;t demand attention or make noise. He just showed up at the right moments, during long nights, stressful days, or quiet breaks in between. Always present. Never intrusive.</p>
            <p className="font-medium text-foreground">That behavior stuck.</p>
            <p>When Lofy was built, the goal wasn&apos;t to create the smartest assistant in the room. It was to build something that understood timing. Something that watched, remembered, and stepped in only when it actually helped.</p>
            <p>As Lofy grew, one personality wasn&apos;t enough. Different moments needed different energy. So the system adapted, the same way a cat does.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "A.T.L.A.S", tagline: "The Intelligent", desc: "Fast, structured, razor-sharp clarity.", icon: Zap },
              { name: "Brad", tagline: "The Bro", desc: "Confident, playful, always in your corner.", icon: Guitar },
              { name: "Lexi", tagline: "The Bestie", desc: "Warm, steady, real, ride-or-die energy.", icon: Heart },
              { name: "Rocco", tagline: "The Roaster", desc: "Quick wit on the mic: fun, never cruel.", icon: Mic },
            ].map((persona) => {
              const Icon = persona.icon;
              return (
                <Card key={persona.name} className="border-border/70 border-primary/10 shadow-sm">
                  <CardContent className="space-y-2 p-5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" aria-hidden />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{persona.name}</p>
                        <p className="text-xs text-muted-foreground">{persona.tagline}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{persona.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      );

    case "messaging":
      return (
        <section className="not-prose space-y-10">
          <div>
            <GuideKicker icon={MessageSquare}>Channels & input</GuideKicker>
            <GuidePageTitle
              icon={MessageSquare}
              title="Text, voice, and images"
              description="Use whatever is easiest in the moment. Lofy treats voice and images as first-class input, not an afterthought."
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-border/70 shadow-sm">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Type className="h-5 w-5 text-primary" aria-hidden />
                  </div>
                  <h3 className="text-sm font-semibold">Text</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">Type naturally. You can forward messages from other chats. Lofy can read them and help you act (save, schedule, remind).</p>
              </CardContent>
            </Card>
            <Card className="border-border/70 shadow-sm">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Mic className="h-5 w-5 text-primary" aria-hidden />
                  </div>
                  <h3 className="text-sm font-semibold">Voice</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">Record a voice note when you are walking or driving. It is transcribed and handled like typed text.</p>
              </CardContent>
            </Card>
            <Card className="border-border/70 shadow-sm">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <ImageIcon className="h-5 w-5 text-primary" aria-hidden />
                  </div>
                  <h3 className="text-sm font-semibold">Images</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">Invites, flyers, screenshots: Lofy can read details and help add them to your calendar. You&apos;ll be asked to confirm before anything is created.</p>
              </CardContent>
            </Card>
          </div>
          <Callout type="tip" title="Clarity wins">
            If something could mean two dates or two people, add one extra detail. That single sentence saves a clarification round-trip.
          </Callout>
        </section>
      );

    case "integrations":
      return (
        <section className="not-prose space-y-10">
          <div>
            <GuideKicker icon={Plug}>Connections</GuideKicker>
            <GuidePageTitle
              icon={Plug}
              title="Integrations"
              description="Link the tools you already rely on so Lofy can reflect your real schedule, not a parallel copy of it."
            />
          </div>

          <Card className="overflow-hidden border-border/70 shadow-md">
            <CardContent className="space-y-4 p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <Image src="/assets/icons/google-calendar-icon.svg" alt="" width={40} height={40} className="size-10 object-contain" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Google Calendar</h2>
                  <p className="text-sm text-muted-foreground">Connect from the dashboard under Integrations.</p>
                </div>
              </div>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>Create and update events through chat; changes can sync to Google when your account is connected.</li>
                <li>If you use more than one Google account, say which calendar or account you mean when you schedule so Lofy can target the right connection.</li>
                <li>You can still use Lofy without Google; events stay in Lofy until you connect.</li>
              </ul>
              <Link
                href="/dashboard/integrations"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted/70"
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden />
                Open integrations
              </Link>
            </CardContent>
          </Card>

          <div>
            <GuideSubheading>Roadmap</GuideSubheading>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              More integrations are in progress. In the dashboard you can vote on what ships next, and your feedback shapes the queue.
            </p>
          </div>
        </section>
      );

    case "calendar":
      return (
        <section className="not-prose space-y-10">
          <div>
            <GuideKicker icon={Calendar}>Scheduling</GuideKicker>
            <GuidePageTitle
              icon={Calendar}
              title="Calendar events"
              description="Use events for anything with a clear time window: meetings, appointments, travel blocks, and social plans."
            />
          </div>

          <div>
            <GuideSubheading>What counts as an event</GuideSubheading>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>Meetings and appointments (dentist, doctor, interviews)</li>
              <li>Social plans: weddings, parties, dinners</li>
              <li>Classes, workshops, shows, flights with a start time</li>
            </ul>
          </div>

          <GuideExamplePanel title="Try saying (tap to copy)">
            <CopyableExample text="Book a meeting with Jason tomorrow 3pm to 4pm" />
            <CopyableExample text="I have a dentist appointment on Friday at 10am" />
            <CopyableExample text="Schedule a party Friday night from 7pm to 11pm" />
          </GuideExamplePanel>

          <Callout type="tip">
            Creating an event also sets a nudge for shortly before it starts. If you only give a start time, Lofy estimates a sensible duration (often one to two hours).
          </Callout>

          <div>
            <GuideSubheading>Find or change events</GuideSubheading>
            <p className="mt-2 text-sm text-muted-foreground">Ask in plain language. Lofy matches titles and times the same way you remember them.</p>
            <div className="mt-4 space-y-1">
              <CopyableExample text="Show me my meetings tomorrow" />
              <CopyableExample text="What do I have on Friday at 2pm?" />
              <CopyableExample text="Find my dentist appointment" />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Rescheduling updates the event; if the time moves, the pre-event nudge moves with it. Deleting an event removes its linked nudge.
            </p>
          </div>
        </section>
      );

    case "reminders":
      return (
        <section className="not-prose space-y-10">
          <div>
            <GuideKicker icon={Bell}>Nudges</GuideKicker>
            <GuidePageTitle
              icon={Bell}
              title="Reminders"
              description="Quick pings for tasks that need a nudge. Prefer natural time phrases; Lofy parses most everyday wording."
            />
          </div>

          <div>
            <GuideSubheading>Quick reminders</GuideSubheading>
            <p className="mt-2 text-sm text-muted-foreground">Great for &quot;in a bit&quot; and same-day follow-ups.</p>
            <div className="mt-4">
              <GuideExamplePanel title="Try saying (tap to copy)">
                <CopyableExample text="Remind me to call mom in 2 hours" />
                <CopyableExample text="Remind me to take medicine in 30 minutes" />
                <CopyableExample text="Remind me tomorrow at 3pm to submit the report" />
                <CopyableExample text="Alert me in 15 minutes to check the oven" />
              </GuideExamplePanel>
            </div>
          </div>

          <GuideExamplePanel title="Time formats that work well">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>&quot;in 30 minutes&quot;, &quot;in 2 hours&quot;</li>
              <li>&quot;tomorrow at 9am&quot;, &quot;today at 3pm&quot;</li>
              <li>&quot;next Monday 2pm&quot;, weekday names with a time</li>
              <li>Explicit clocks: &quot;3pm&quot;, &quot;9:30am&quot;, &quot;15:00&quot;</li>
            </ul>
          </GuideExamplePanel>

          <Callout type="important">
            For something far in the future with a fixed block on your calendar, say it like an event. Lofy may use a calendar event (with its own pre-start nudge) instead of a short-horizon reminder. If you are unsure, describe the situation; Lofy picks the better tool.
          </Callout>

          <div>
            <GuideSubheading>Remind an accepted friend</GuideSubheading>
            <p className="mt-2 text-sm text-muted-foreground">
              If you are connected as friends in Lofy, you can set a reminder that delivers to their number, which is useful for shared plans and gentle accountability.
            </p>
            <div className="mt-4 space-y-1">
              <CopyableExample text="Remind Alex tomorrow at 9am to bring the tickets" />
            </div>
          </div>

          <div>
            <GuideSubheading>Search and manage</GuideSubheading>
            <div className="mt-4 space-y-1">
              <CopyableExample text="Show me my reminders for tomorrow" />
              <CopyableExample text="Find my reminder to call mom" />
              <CopyableExample text="What reminders do I have this week?" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Ask to change the time or message, or to cancel one you no longer need.</p>
          </div>
        </section>
      );

    case "memory":
      return (
        <section className="not-prose space-y-10">
          <div>
            <GuideKicker icon={Brain}>Saved context</GuideKicker>
            <GuidePageTitle
              icon={Brain}
              title="Memory storage & recall"
              description="Tell Lofy what to remember so you do not have to repeat it. Retrieve it anytime in chat, or review everything in the dashboard."
            />
          </div>

          <div>
            <GuideSubheading>Good candidates for memory</GuideSubheading>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>Stable facts: contact details, sizes, preferences, standing instructions</li>
              <li>Reference snippets you paste often (templates, boilerplate)</li>
            </ul>
            <Callout type="important" title="Sensitive data">
              Avoid storing highly sensitive secrets (bank PINs, raw government IDs) in any chat assistant. For passwords, prefer a dedicated password manager; if you still choose to store something sensitive, understand it is encrypted in transit and at rest, but human error in chat is still a risk.
            </Callout>
          </div>

          <GuideExamplePanel title="Try saying (tap to copy)">
            <CopyableExample text="Remember that David's email is david123@gmail.com" />
            <CopyableExample text="Remember my shirt size is medium tall" />
          </GuideExamplePanel>

          <div>
            <GuideSubheading>Recall</GuideSubheading>
            <div className="mt-4 space-y-1">
              <CopyableExample text="What's David's email again?" />
              <CopyableExample text="What shirt size did I save?" />
            </div>
            <Callout type="tip">After a memory search, you may get a link to open your full memory list in the dashboard.</Callout>
          </div>

          <Link
            href="/dashboard/memories"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted/70"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            Open memories
          </Link>
        </section>
      );

    case "personas":
      return (
        <section className="not-prose space-y-10">
          <div>
            <GuideKicker icon={User}>Voice & tone</GuideKicker>
            <GuidePageTitle
              icon={User}
              title="Personas"
              description="A.T.L.A.S, Brad, Lexi, and Rocco share the same capabilities, but they differ in how responses feel. Switch whenever your mood changes."
            />
          </div>

          <div className="space-y-3">
            {GUIDE_PERSONAS.map((persona) => {
              const isExpanded = expandedPersona === persona.id;
              return (
                <div
                  key={persona.id}
                  className={cn(
                    "rounded-xl border p-4 transition-shadow cursor-pointer shadow-sm",
                    persona.color,
                    isExpanded ? "ring-2 ring-primary/25" : "hover:shadow-md"
                  )}
                >
                  <button type="button" onClick={() => setExpandedPersona(isExpanded ? null : persona.id)} className="w-full text-left">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-foreground">{persona.displayName}</p>
                      {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{persona.description}</p>
                  </button>
                  {isExpanded ? (
                    <div className="mt-4 space-y-1 border-t border-current/10 pt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Example lines (tap to copy)</p>
                      {persona.examples.map((ex) => (
                        <CopyableExample key={ex} text={ex} className="text-sm" />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div>
            <GuideSubheading>How to switch</GuideSubheading>
            <p className="mt-2 text-sm text-muted-foreground">Use dashboard settings, or ask in chat:</p>
            <div className="mt-4 space-y-1">
              <CopyableExample text="Switch to Lexi" />
              <CopyableExample text="Be Brad" />
              <CopyableExample text="Use A.T.L.A.S" />
              <CopyableExample text="Switch to Rocco" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">The persona you pick carries across reminders, memories, and conversation.</p>
          </div>
        </section>
      );

    case "quick-tips":
      return (
        <section className="not-prose space-y-10">
          <div>
            <GuideKicker icon={Lightbulb}>Shortcuts</GuideKicker>
            <GuidePageTitle
              icon={Lightbulb}
              title="Quick tips"
              description="Small habits that make Lofy feel effortless, mostly about being specific once instead of vague twice."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/70 shadow-sm">
              <CardContent className="space-y-2 p-5">
                <GuideSubheading>Time & timezone</GuideSubheading>
                <p className="text-sm leading-relaxed text-muted-foreground">Natural language works best. Set your timezone in the dashboard if travel throws things off.</p>
              </CardContent>
            </Card>
            <Card className="border-border/70 shadow-sm">
              <CardContent className="space-y-2 p-5">
                <GuideSubheading>One message, one job</GuideSubheading>
                <p className="text-sm leading-relaxed text-muted-foreground">Bundling is fine, but if three unrelated tasks arrive in one paragraph, confirm each outcome so nothing is missed.</p>
              </CardContent>
            </Card>
          </div>

          <div>
            <GuideSubheading>Reminder vs calendar event</GuideSubheading>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Card className="border-amber-500/15 bg-amber-500/[0.04] shadow-sm">
                <CardContent className="p-5">
                  <p className="font-semibold text-foreground">Reminder</p>
                  <p className="mt-1 text-sm text-muted-foreground">A ping at a time you choose, great for tasks and follow-ups.</p>
                </CardContent>
              </Card>
              <Card className="border-primary/15 bg-primary/[0.04] shadow-sm">
                <CardContent className="p-5">
                  <p className="font-semibold text-foreground">Calendar event</p>
                  <p className="mt-1 text-sm text-muted-foreground">A booked block of time, great when duration and collisions matter.</p>
                </CardContent>
              </Card>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">When something reads like a calendar block weeks out, Lofy tends toward an event so your week view stays honest.</p>
          </div>

          <Callout type="tip" title="Forward-first workflow">
            Forward confirmations, addresses, or long threads into chat and say what you want done (&quot;save this&quot;, &quot;put this on my calendar&quot;, &quot;remind me the day before&quot;).
          </Callout>
        </section>
      );

    case "help":
      return (
        <section className="not-prose space-y-10">
          <div>
            <GuideKicker icon={HelpCircle}>Support</GuideKicker>
            <GuidePageTitle
              icon={HelpCircle}
              title="Need help?"
              description="Lofy understands intent, and you rarely need special syntax. The usual fix is adding time, people, or place when something is ambiguous."
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <GuideExamplePanel title="Clear requests (tap to copy)">
              <CopyableExample text="Remind me to call mom tomorrow at 3pm" />
              <CopyableExample text="Schedule a meeting with Sarah on Friday 2pm-3pm" />
              <CopyableExample text="Remember my hotel confirmation is LOFY-88421" />
            </GuideExamplePanel>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-5">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Usually needs a follow-up detail</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>&quot;Remind me later&quot;: which day and time?</li>
                <li>&quot;I have a meeting&quot;: with whom, and when?</li>
                <li>&quot;Move my appointment&quot;: which one, and to when?</li>
              </ul>
            </div>
          </div>

          <Card className="border-border/70 shadow-sm">
            <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Product feedback</p>
                  <p className="text-sm text-muted-foreground">Something broken or confusing? The feedback page goes straight to the team.</p>
                </div>
              </div>
              <Link
                href="/dashboard/feedback"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-95"
              >
                Send feedback
              </Link>
            </CardContent>
          </Card>
        </section>
      );

    default:
      return null;
  }
}
