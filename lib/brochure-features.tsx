import { Brain, History, Plug, Sparkles, Users, type LucideIcon } from "lucide-react";

export type BrochureFeatureSlug =
  | "integrations"
  | "friends"
  | "history"
  | "memories"
  | "personas";

export type BrochureFeatureCard = {
  title: string;
  description: string;
  badge?: string;
};

export type BrochureFeatureStep = {
  title: string;
  description: string;
};

export type BrochureFeatureStat = {
  label: string;
  value: string;
  helper: string;
};

export type BrochureFeature = {
  slug: BrochureFeatureSlug;
  title: string;
  shortTitle: string;
  badge: string;
  eyebrow: string;
  href: `/features/${BrochureFeatureSlug}`;
  metadataTitle: string;
  metadataDescription: string;
  overviewDescription: string;
  overviewHighlights: string[];
  icon: LucideIcon;
  heroTitle: string;
  heroDescription: string;
  stats: BrochureFeatureStat[];
  capabilityTitle: string;
  capabilityDescription: string;
  capabilityCards: BrochureFeatureCard[];
  workflowTitle: string;
  workflowDescription: string;
  steps: BrochureFeatureStep[];
  valueTitle: string;
  valueDescription: string;
  valueCards: BrochureFeatureCard[];
  availableNow: string[];
  comingNext?: string[];
};

export const LEGACY_FEATURE_REDIRECTS: Record<string, BrochureFeatureSlug> = {
  "apps-integration": "integrations",
  "limitless-reminder": "history",
  "save-to-memory": "memories",
  "personality-modes": "personas",
  "settings-personas": "personas",
  analytics: "history",
};

export const BROCHURE_FEATURES: BrochureFeature[] = [
  {
    slug: "integrations",
    title: "Integrations",
    shortTitle: "Integrations",
    badge: "Live now",
    eyebrow: "Connected workflows",
    href: "/features/integrations",
    metadataTitle: "Lofy Integrations",
    metadataDescription:
      "Connect WhatsApp and Google accounts in Lofy, manage multiple Google identities, and keep calendar actions flowing through one assistant.",
    overviewDescription:
      "Connect WhatsApp and Google, manage multiple Google identities, and keep calendar actions routed through one assistant.",
    overviewHighlights: ["WhatsApp delivery", "Google OAuth", "Multi-account support"],
    icon: Plug,
    heroTitle: "Connect Lofy to the tools you already use.",
    heroDescription:
      "The integrations experience is built around the real client flow today: WhatsApp for delivery, Google OAuth for account access, and a single place to manage which identity Lofy should use.",
    stats: [
      {
        label: "Messaging channel",
        value: "WhatsApp",
        helper: "The current live channel for prompts, reminders, and updates.",
      },
      {
        label: "Google accounts",
        value: "Multi-account",
        helper: "Separate work and personal identities, then choose a default.",
      },
      {
        label: "Access model",
        value: "OAuth 2.0",
        helper: "Standard consent flow without handing Lofy your password.",
      },
    ],
    capabilityTitle: "What the integrations page is built for",
    capabilityDescription:
      "The live dashboard keeps the surface intentionally focused: connect what works today, show account status clearly, and reuse those connections as more Google features light up.",
    capabilityCards: [
      {
        title: "Google suite connection",
        description:
          "Connect each Google identity once, keep tokens per account, and reuse the same sign-in for Calendar today and other Google tools later.",
        badge: "Account-level OAuth",
      },
      {
        title: "Default account control",
        description:
          "Pick which connected Google account should be the default for new events, then change it anytime from the dashboard.",
        badge: "Default routing",
      },
      {
        title: "Messaging status at a glance",
        description:
          "WhatsApp and Google both surface as clear status cards so users can see what is connected before asking Lofy to act.",
        badge: "Live status",
      },
    ],
    workflowTitle: "How it works in the app",
    workflowDescription:
      "The product flow is short on purpose: connect, label, and start using it. The brochure page should mirror that clarity.",
    steps: [
      {
        title: "Connect an account",
        description:
          "Start the OAuth flow, label the account so you can tell identities apart, and return to the dashboard with the connection stored.",
      },
      {
        title: "Choose your default",
        description:
          "If you use more than one Google identity, set the one Lofy should prefer for new calendar work.",
      },
      {
        title: "Let Lofy act through it",
        description:
          "Once the connection is live, Lofy can use that account context for scheduling today and future Google surfaces without a second sign-in loop.",
      },
    ],
    valueTitle: "Why this matters",
    valueDescription:
      "The point is not to list every possible app. It is to show how Lofy reduces friction across the connections users actually touch.",
    valueCards: [
      {
        title: "Less app switching",
        description:
          "Users can stay in conversation while Lofy handles the setup required to schedule and sync through connected tools.",
      },
      {
        title: "Safer account handling",
        description:
          "OAuth keeps the trust story simple: approve scopes with Google, then manage those connections from one place.",
      },
      {
        title: "Built to expand cleanly",
        description:
          "The current connection model already anticipates Gmail, Drive, and other Google surfaces without creating a separate auth experience for each one.",
      },
    ],
    availableNow: [
      "WhatsApp is the live messaging channel surfaced in the client.",
      "Google accounts can be connected, disconnected, and set as the default.",
      "Calendar use is available now through the Google connection.",
    ],
    comingNext: [
      "Gmail and Drive can reuse the existing Google connection model as those flows ship.",
    ],
  },
  {
    slug: "friends",
    title: "Friends",
    shortTitle: "Friends",
    badge: "Social layer",
    eyebrow: "Your circle",
    href: "/features/friends",
    metadataTitle: "Lofy Friends",
    metadataDescription:
      "Invite people by phone, track pending invites, and build the circle that unlocks shared memory in Lofy.",
    overviewDescription:
      "Invite people by phone, track pending invites, and build the circle that makes shared memory work.",
    overviewHighlights: ["Phone invites", "Pending requests", "Circle-based sharing"],
    icon: Users,
    heroTitle: "Build the circle around your memory and planning.",
    heroDescription:
      "The friends surface is how Lofy turns personal capture into a shared experience. It keeps invites lightweight, shows pending requests clearly, and creates the relationships that shared memory depends on.",
    stats: [
      {
        label: "Invite method",
        value: "Phone-first",
        helper: "Users invite by mobile number instead of searching profiles.",
      },
      {
        label: "State tracking",
        value: "Pending + active",
        helper: "The dashboard separates sent invites from confirmed friends.",
      },
      {
        label: "Social outcome",
        value: "Shared memory",
        helper: "Friend relationships power the memory-sharing experience.",
      },
    ],
    capabilityTitle: "What the friends page does today",
    capabilityDescription:
      "This part of the product is intentionally practical. It is not a full social feed; it is the circle-management surface users need before sharing anything meaningful.",
    capabilityCards: [
      {
        title: "Invite by mobile number",
        description:
          "Enter a phone number, send an invite, and let Lofy create the relationship from a simple phone-first flow.",
        badge: "Direct invite",
      },
      {
        title: "See who is already in",
        description:
          "Confirmed friends show up with lightweight identity cues and the date the relationship became active.",
        badge: "Circle visibility",
      },
      {
        title: "Track pending invites",
        description:
          "Users can see outstanding invitations, expiration timing, and whether a request is still waiting to be accepted.",
        badge: "Pending state",
      },
    ],
    workflowTitle: "How it works in the app",
    workflowDescription:
      "The flow stays small: invite someone, wait for the relationship to go live, then unlock sharing flows in the rest of the product.",
    steps: [
      {
        title: "Add a phone number",
        description:
          "Users choose the dial code, enter the number, and send the invite from the dashboard.",
      },
      {
        title: "Track the invite",
        description:
          "Pending requests stay visible so users can tell whether an invite already exists or is still waiting to be accepted.",
      },
      {
        title: "Share through your circle",
        description:
          "Once someone becomes a friend, they can participate in the shared-memory flows surfaced elsewhere in the app.",
      },
    ],
    valueTitle: "Why this matters",
    valueDescription:
      "Friends makes the app feel collaborative without pretending to be a social network. It supports one of the product's most tangible relationship-based workflows.",
    valueCards: [
      {
        title: "Clear setup path",
        description:
          "Users do not need a complicated discovery model before sharing something important with another person.",
      },
      {
        title: "Context for memory sharing",
        description:
          "The memory surface can speak in terms of 'your circle' because the friends page establishes that relationship explicitly.",
      },
      {
        title: "Minimal but useful social graph",
        description:
          "Lofy keeps the graph focused on people you actively trust, which fits the product tone better than a broad follower model.",
      },
    ],
    availableNow: [
      "Users can send invites by phone number from the dashboard.",
      "The client shows confirmed friends and pending invites separately.",
      "Friends relationships are already referenced by the memories experience.",
    ],
  },
  {
    slug: "history",
    title: "History & Planning",
    shortTitle: "History",
    badge: "Action log",
    eyebrow: "What Lofy did",
    href: "/features/history",
    metadataTitle: "Lofy History",
    metadataDescription:
      "Review reminders, events, and memory activity in one timeline, with filters and integration labels that show what Lofy handled for you.",
    overviewDescription:
      "Review reminders, events, and memory activity in one timeline with filters and integration context.",
    overviewHighlights: ["Events + reminders", "Filter tabs", "Timeline detail"],
    icon: History,
    heroTitle: "See every event, reminder, and memory action in one place.",
    heroDescription:
      "The old reminders story now lives inside a broader history surface. Instead of a standalone reminder brochure page, the client shows a timeline of what Lofy created, updated, synced, or removed across planning and memory actions.",
    stats: [
      {
        label: "Activity types",
        value: "3 streams",
        helper: "Events, reminders, and memories share one log.",
      },
      {
        label: "Filter model",
        value: "All or by type",
        helper: "Switch between the full timeline and focused categories.",
      },
      {
        label: "Source context",
        value: "Integration labels",
        helper: "Calendar activity can show which connected account it came from.",
      },
    ],
    capabilityTitle: "What the history surface covers",
    capabilityDescription:
      "History gives users a reliable answer to 'what happened?' after Lofy acts. That makes reminders and planning feel tangible instead of invisible.",
    capabilityCards: [
      {
        title: "Unified activity feed",
        description:
          "Events, reminders, and memory actions all land in one timeline instead of being split across separate product areas.",
        badge: "One log",
      },
      {
        title: "Category filters",
        description:
          "Users can narrow the feed to reminders, events, or memories when they want to focus on one kind of action.",
        badge: "Focused review",
      },
      {
        title: "Rich detail blocks",
        description:
          "Each entry keeps action labels, relative time, and formatted detail text so users can review exactly what changed.",
        badge: "Readable audit trail",
      },
    ],
    workflowTitle: "How it works in the app",
    workflowDescription:
      "History is passive but important. It confirms that Lofy acted, helps users verify the result, and keeps planning activity legible over time.",
    steps: [
      {
        title: "Lofy performs an action",
        description:
          "When a reminder, event, or memory changes, the action is captured as a timeline item.",
      },
      {
        title: "The timeline normalizes it",
        description:
          "Timestamps, action labels, and integration names are formatted into a consistent feed entry.",
      },
      {
        title: "Users review or filter it",
        description:
          "The dashboard lets users scan the whole story or filter down to one category when they need to confirm something specific.",
      },
    ],
    valueTitle: "Why this matters",
    valueDescription:
      "A planning assistant feels more trustworthy when users can inspect what it actually did. History makes reminders and scheduling visible after the fact.",
    valueCards: [
      {
        title: "Reminder confidence",
        description:
          "Users can confirm that a reminder was created or updated instead of wondering whether the request went through.",
      },
      {
        title: "Calendar transparency",
        description:
          "Integration badges make it easier to understand which connected account an event came from.",
      },
      {
        title: "Better continuity",
        description:
          "Because memories also appear here, the page reflects Lofy's broader role across planning and recall instead of narrowing the story to one feature.",
      },
    ],
    availableNow: [
      "History already tracks reminders, events, and memories together.",
      "Users can filter the feed by activity type in the dashboard.",
      "Calendar-linked items can include integration display names for added context.",
    ],
  },
  {
    slug: "memories",
    title: "Memories",
    shortTitle: "Memories",
    badge: "Second brain",
    eyebrow: "Capture and recall",
    href: "/features/memories",
    metadataTitle: "Lofy Memories",
    metadataDescription:
      "Capture personal memories, search them later, and review what has been shared with you by people in your circle.",
    overviewDescription:
      "Capture personal memories, search them later, and revisit what has been shared by people in your circle.",
    overviewHighlights: ["Owned + shared", "Searchable library", "Share from detail view"],
    icon: Brain,
    heroTitle: "Keep your own memories close and shared ones in the same flow.",
    heroDescription:
      "The memory experience in the client is already more grounded than the older marketing copy: it separates what you saved from what your circle shared, keeps search close at hand, and turns each memory card into an entry point for editing or sharing.",
    stats: [
      {
        label: "View modes",
        value: "All / Mine / Shared",
        helper: "Users can switch between one combined feed and scoped views.",
      },
      {
        label: "Recall tools",
        value: "Search + detail modal",
        helper: "Titles, content, people, and notes can all drive discovery.",
      },
      {
        label: "Sharing model",
        value: "Circle-based",
        helper: "Shared memories are tied to relationships created in Friends.",
      },
    ],
    capabilityTitle: "What the memories page does today",
    capabilityDescription:
      "The live product already treats memory as a working library, not just a slogan about AI recall. The brochure should reflect that concrete structure.",
    capabilityCards: [
      {
        title: "Owned and shared memory in one feed",
        description:
          "Users can move between their private library and the memories other people passed to them without changing surfaces.",
        badge: "Dual feed",
      },
      {
        title: "Search across useful context",
        description:
          "Search checks titles, memory content, related people, comments, and sharing context so recall feels practical.",
        badge: "Fast recall",
      },
      {
        title: "Open a memory to act on it",
        description:
          "Memory cards are not dead-end content blocks. They open into a detail flow where users can review and manage the item further.",
        badge: "Editable depth",
      },
    ],
    workflowTitle: "How it works in the app",
    workflowDescription:
      "The memory flow is built around capture, discovery, and optional sharing, with each step staying visible in the dashboard.",
    steps: [
      {
        title: "Capture or receive a memory",
        description:
          "A memory can originate from you or arrive from someone in your circle through the shared-memory flow.",
      },
      {
        title: "Browse and filter the library",
        description:
          "Users can search the feed, switch between owned and shared views, and quickly see what is relevant.",
      },
      {
        title: "Open, edit, or share",
        description:
          "Selecting a card opens the full context so the memory can be reviewed, updated, or passed along when appropriate.",
      },
    ],
    valueTitle: "Why this matters",
    valueDescription:
      "This is one of the clearest product loops in the client today: capture something once, then make it easy to revisit or pass forward.",
    valueCards: [
      {
        title: "A feed that respects ownership",
        description:
          "Users can tell whether something belongs to them or was shared into their circle, which keeps memory context trustworthy.",
      },
      {
        title: "Useful recall, not just storage",
        description:
          "Search, filters, and memory detail views make the feature feel operational rather than archival.",
      },
      {
        title: "Built for sharing",
        description:
          "The friends system gives memories a social layer without turning the product into a generic feed of posts.",
      },
    ],
    availableNow: [
      "Users can browse owned memories and shared memories in one dashboard surface.",
      "The library supports search plus all/mine/shared filtering.",
      "Memory cards open into a detail view for deeper review and sharing actions.",
    ],
  },
  {
    slug: "personas",
    title: "Personas",
    shortTitle: "Personas",
    badge: "Adaptive voice",
    eyebrow: "Choose your vibe",
    href: "/features/personas",
    metadataTitle: "Lofy Personas",
    metadataDescription:
      "Choose between A.T.L.A.S, Brad, Lexi, and Rocco so Lofy sounds like the voice you want in the moment.",
    overviewDescription:
      "Choose between four distinct Lofy voices so the assistant feels sharper, warmer, funnier, or more direct when you need it.",
    overviewHighlights: ["4 live voices", "Switch in profile", "Tone that matches the moment"],
    icon: Sparkles,
    heroTitle: "Pick the version of Lofy that matches your energy.",
    heroDescription:
      "The persona system is one of the clearest ways Lofy feels personal. Users can switch between A.T.L.A.S, Brad, Lexi, and Rocco to change how the assistant sounds without changing the core product flow.",
    stats: [
      {
        label: "Live personas",
        value: "4 voices",
        helper: "A.T.L.A.S, Brad, Lexi, and Rocco are all already available.",
      },
      {
        label: "Where it lives",
        value: "Profile controls",
        helper: "Users switch personas directly from the account profile flow.",
      },
      {
        label: "Experience impact",
        value: "Tone shift",
        helper: "The same assistant feels different depending on the voice you pick.",
      },
    ],
    capabilityTitle: "What the persona feature already supports",
    capabilityDescription:
      "This is where the personality story becomes real. The client does not just mention personas in marketing; it already lets users pick a voice and feel that choice as part of the product identity.",
    capabilityCards: [
      {
        title: "Persona selection",
        description:
          "Users can switch between the four current personas directly in profile, turning the marketing story into a live product control.",
        badge: "4 live voices",
      },
      {
        title: "Distinct character",
        description:
          "Each persona has a different tone, which lets users choose whether they want calm clarity, bestie energy, playful bro confidence, or sharper roasting.",
        badge: "Clear voice difference",
      },
      {
        title: "Lightweight switching",
        description:
          "Persona choice does not ask users to learn a new system. It is a simple control that changes how Lofy shows up, not how the rest of the app works.",
        badge: "Low friction",
      },
    ],
    workflowTitle: "How it works in the app",
    workflowDescription:
      "The flow is intentionally simple: open profile, pick a voice, and keep using the product with a different tone.",
    steps: [
      {
        title: "Open your profile",
        description:
          "Users go to their profile controls where the persona picker already lives.",
      },
      {
        title: "Pick a persona",
        description:
          "They choose the Lofy voice that fits the moment, from structured and intelligent to playful or warm.",
      },
      {
        title: "Feel the tone change",
        description:
          "From there, Lofy keeps the same core abilities while sounding more like the version the user wants.",
      },
    ],
    valueTitle: "Why this matters",
    valueDescription:
      "Personas give Lofy a more human product identity. They make the assistant feel chosen, not generic.",
    valueCards: [
      {
        title: "Persona marketing becomes product truth",
        description:
          "The persona story is stronger when users can actually switch voices instead of only reading about them.",
      },
      {
        title: "Different moods, same assistant",
        description:
          "Users can change the emotional feel of the assistant without losing access to reminders, memory, integrations, or planning flows.",
      },
      {
        title: "A more memorable brand layer",
        description:
          "A.T.L.A.S, Brad, Lexi, and Rocco make the product easier to remember because they give the assistant recognizable personalities instead of one neutral tone.",
      },
    ],
    availableNow: [
      "The profile flow already supports persona selection in the client.",
      "The four persona options are live in the client today.",
      "Users can change the voice without leaving the rest of the product model behind.",
    ],
    comingNext: [
      "As more product moments reflect persona more visibly, this feature can grow without needing to become a broader settings story.",
    ],
  },
];

export function getBrochureFeature(slug: string): BrochureFeature | undefined {
  return BROCHURE_FEATURES.find((feature) => feature.slug === slug);
}
