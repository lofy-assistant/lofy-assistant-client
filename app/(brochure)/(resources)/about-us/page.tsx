import Image from "next/image";
import Link from "next/link";
import {
  Brain,
  Calendar,
  Cat,
  CheckCircle2,
  Clock,
  Guitar,
  Heart,
  MessageSquare,
  Mic,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

import CTA from "@/components/brochure/home/cta";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatThousandsPlus, getAboutPlatformStats } from "@/lib/brochure/about-stats";

export const revalidate = 3600;

const values = [
  {
    icon: Shield,
    title: "Privacy first",
    description:
      "Your data belongs to you. We use strong security practices and do not sell your personal information.",
  },
  {
    icon: Sparkles,
    title: "Radical simplicity",
    description:
      "Complex technology, calm experience. Lofy handles the orchestration so you can stay in flow.",
  },
  {
    icon: Heart,
    title: "Human-centered",
    description:
      "AI should amplify your intent, not add noise. We design for real routines, not demos.",
  },
  {
    icon: Users,
    title: "Inclusive by default",
    description:
      "Clear language, respectful defaults, and room for different communication styles.",
  },
];

const capabilities = [
  {
    icon: Brain,
    title: "Context-aware help",
    description: "Connects tasks, events, and preferences so suggestions stay relevant.",
  },
  {
    icon: Calendar,
    title: "Scheduling that respects you",
    description: "Works with your calendar and reminders without turning life into a spreadsheet.",
  },
  {
    icon: MessageSquare,
    title: "Natural conversation",
    description: "Talk like yourself, with no command language or rigid syntax required.",
  },
  {
    icon: Zap,
    title: "Proactive nudges",
    description: "Reminders that consider timing and context, not only the clock.",
  },
  {
    icon: Target,
    title: "Goals in view",
    description: "Helps tie day-to-day actions back to what you said actually matters.",
  },
  {
    icon: Clock,
    title: "Persistent memory",
    description: "Remembers what you choose to save so you do not have to repeat yourself.",
  },
];

const personaCards = [
  {
    key: "atlas",
    name: "A.T.L.A.S",
    tagline: "The intelligent",
    desc: "Fast, structured, razor-sharp clarity.",
    icon: Zap,
  },
  {
    key: "brad",
    name: "Brad",
    tagline: "The bro",
    desc: "Confident, playful, always in your corner.",
    icon: Guitar,
  },
  {
    key: "lexi",
    name: "Lexi",
    tagline: "The bestie",
    desc: "Warm, steady, real, and your ride-or-die energy.",
    icon: Heart,
  },
  {
    key: "rocco",
    name: "Rocco",
    tagline: "The roaster",
    desc: "Quick wit on the mic, playful and never cruel.",
    icon: Mic,
  },
] as const;

function personaVoiceSharePercent(personas: { key: string; percent: number }[], key: string): number | null {
  const row = personas.find((p) => p.key === key);
  if (!row || row.percent <= 0) return null;
  return row.percent;
}

export default async function AboutUsPage() {
  const stats = await getAboutPlatformStats();

  const statStrip = [
    {
      value: formatThousandsPlus(stats.remindersCompleted),
      label: "Reminders completed",
    },
    {
      value: formatThousandsPlus(stats.calendarEvents),
      label: "Calendar events",
    },
    {
      value: formatThousandsPlus(stats.registeredUsers),
      label: "Registered users",
    },
    {
      value: formatThousandsPlus(stats.assistantCalls),
      label: "Assistant calls",
    },
  ];

  const refreshed = new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(stats.generatedAt));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute bottom-0 right-[-120px] h-[380px] w-[380px] rounded-full bg-accent/[0.06] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <section className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-24">
          <div className="max-w-xl space-y-6">
            <Badge variant="indigo" className="w-fit gap-1.5 px-3 py-1">
              <Cat className="size-3.5" aria-hidden />
              About Lofy
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              A quiet assistant for a loud world.
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Lofy remembers what matters, nudges you when it helps, and stays out of the way when it does not, like
              the companion who inspired the name.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-95"
              >
                Get started
              </Link>
              <Link
                href="/features"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background/80 px-6 text-sm font-medium backdrop-blur transition hover:bg-muted/60"
              >
                Explore features
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm shrink-0 lg:mx-0">
            <div className="absolute inset-0 -rotate-3 rounded-[2rem] bg-gradient-to-br from-primary/15 to-accent/10 blur-xl" />
            <Card className="relative overflow-hidden border-border/80 shadow-lg">
              <CardContent className="space-y-5 p-7">
                <div className="flex items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
                    <Image
                      src="/assets/icons/lofy-logo-1.png"
                      alt="Lofy"
                      fill
                      className="object-contain p-2"
                      sizes="56px"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Live platform pulse</p>
                    <p className="text-xs text-muted-foreground/80">Rounded counts from our database</p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-4">
                  {statStrip.map((item) => (
                    <div key={item.label} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </dt>
                      <dd className="mt-1 font-mono text-2xl font-semibold tracking-tight text-primary">{item.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Figures aggregate production-style activity (reminders marked completed, active calendar rows, user
                  accounts, and logged assistant calls). Refreshed at least hourly; last build snapshot {refreshed}.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our story</p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Named after a cat who understood timing.</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Lofy is named after a cat named <span className="font-medium text-foreground">Lofy</span>, a quiet
                companion who showed up in the right moments without demanding the room.
              </p>
              <p>
                That idea carried into the product: be present when needed, remember what matters, and avoid the kind
                of constant interruption that turns assistants into chores.
              </p>
            </div>
          </div>
          <div className="space-y-6 lg:col-span-7">
            <Card className="border-border/80 bg-card/70 backdrop-blur-sm">
              <CardContent className="space-y-6 p-8">
                <div>
                  <h3 className="text-lg font-semibold">The Lofy philosophy</h3>
                  <p className="text-sm text-muted-foreground">How we think about helpful software</p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Present when needed, not performative",
                    "Remembers what you choose to share",
                    "Adapts to your rhythm and tone",
                    "Reliable without being loud",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <blockquote className="border-l-2 border-primary/40 pl-4 text-sm italic text-muted-foreground">
                  We are not optimizing for “the smartest model in the room.” We are optimizing for the right intervention
                  at the right time.
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/25">
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center space-y-4">
            <Badge variant="indigo" className="mx-auto w-fit gap-1.5 px-3 py-1">
              <Cat className="size-3.5" aria-hidden />
              Lore
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Same intelligence. Different energy.</h2>
            <p className="text-muted-foreground leading-relaxed">
              People do not feel the same every day, so Lofy offers distinct voices you can switch between. Percentages
              show each mode&apos;s share among users who picked a named voice.
            </p>
          </div>

          <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {personaCards.map((persona) => {
              const Icon = persona.icon;
              const sharePct = personaVoiceSharePercent(stats.personas, persona.key);
              return (
                <li key={persona.key}>
                  <Card className="group flex h-full flex-col border-border/80 bg-background/90 shadow-sm ring-1 ring-black/[0.03] transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md dark:ring-white/[0.04]">
                    <CardContent className="flex flex-1 flex-col gap-0 p-6 sm:p-7">
                      <div className="flex gap-4">
                        <div
                          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary/[0.14]"
                          aria-hidden
                        >
                          <Icon className="size-[18px]" strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                            <h3 className="text-[15px] font-semibold leading-snug tracking-tight">{persona.name}</h3>
                            {sharePct !== null ? (
                              <span
                                className="shrink-0 rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-xs font-medium tabular-nums tracking-tight text-muted-foreground"
                                title="Approximate share of users who selected a named voice mode (live data)"
                                aria-label={`${sharePct} percent of users who picked a named voice chose this mode`}
                              >
                                {sharePct}%
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{persona.tagline}</p>
                          <p className="mt-4 border-t border-border/50 pt-4 text-sm leading-relaxed text-muted-foreground">
                            {persona.desc}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>

          <Card className="mx-auto max-w-3xl border-primary/20 bg-gradient-to-br from-primary/[0.06] to-transparent">
            <CardContent className="space-y-4 p-8 text-center sm:p-10">
              <p className="text-sm font-medium text-muted-foreground">At its core, Lofy follows one rule:</p>
              <p className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">Be there when needed.</p>
              <p className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">Stay out of the way when not.</p>
              <p className="text-sm text-muted-foreground">Just like the cat that inspired it.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Purpose</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What drives us</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/80">
            <CardContent className="space-y-4 p-8">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Target className="size-5" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold">Mission</h3>
              <p className="leading-relaxed text-muted-foreground">
                Build an assistant that truly supports day-to-day life by remembering what you asked it to hold,
                reminding you when it helps, and adapting to your context without turning every ping into pressure.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/80">
            <CardContent className="space-y-4 p-8">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-accent/15 text-primary">
                <Sparkles className="size-5" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold">Vision</h3>
              <p className="leading-relaxed text-muted-foreground">
                A world where personal AI gives people mental breathing room, with less juggling and more room for what
                actually feels meaningful.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Principles</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How we build</h2>
            <p className="text-muted-foreground leading-relaxed">Values we return to when tradeoffs get noisy.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="border-border/70 bg-background/80">
                  <CardContent className="flex items-center gap-4 p-6 sm:p-7">
                    <div className="mt-0.5 rounded-xl bg-primary/10 p-2.5 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">{value.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Product</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What Lofy is good at</h2>
          <p className="text-muted-foreground leading-relaxed">
            Capabilities grounded in how people actually use the assistant, not a speculative feature laundry list.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-5 transition hover:border-primary/25 hover:bg-card"
              >
                <div className="mt-0.5 shrink-0 rounded-lg bg-muted p-2 text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold">{cap.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{cap.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/15">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Made with care in{" "}
            <span className="font-medium text-foreground">Malaysia</span>
            <span className="mx-1" aria-hidden>
              🇲🇾
            </span>
            ·{" "}
            <Link href="/" className="text-foreground underline-offset-4 hover:underline">
              lofy.ai
            </Link>
          </p>
        </div>
      </section>

      <CTA />
    </div>
  );
}
