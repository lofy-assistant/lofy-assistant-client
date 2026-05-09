"use client";

import { motion } from "motion/react";
import { UserPlus, Users } from "lucide-react";

const CX = 50;
const CY = 52;

const orbit = [
  { id: "a", x: 22, y: 28, delay: 0.15 },
  { id: "b", x: 78, y: 30, delay: 0.25 },
  { id: "c", x: 18, y: 72, delay: 0.35 },
  { id: "d", x: 82, y: 70, delay: 0.45 },
];

export default function BentoFriends() {
  return (
    <div className="relative flex h-full min-h-[200px] w-full items-center justify-center overflow-hidden bg-linear-to-b from-marketing-accent-soft/40 to-transparent p-4">
      <svg className="pointer-events-none absolute inset-0 size-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {orbit.map((n) => (
          <motion.line
            key={`line-${n.id}`}
            x1={CX}
            y1={CY}
            x2={n.x}
            y2={n.y}
            stroke="url(#friendsLineGrad)"
            strokeWidth="0.6"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: n.delay }}
          />
        ))}
        <defs>
          <linearGradient id="friendsLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--marketing-accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--marketing-chat-user-to)" stopOpacity="0.45" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        className="absolute flex flex-col items-center"
        style={{ left: `${CX}%`, top: `${CY}%`, transform: "translate(-50%, -50%)" }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-14 items-center justify-center rounded-full border-2 border-marketing-accent bg-marketing-accent-soft text-marketing-accent-soft-foreground shadow-md ring-4 ring-marketing-accent/15"
        >
          <Users className="size-7 text-marketing-accent" strokeWidth={2} aria-hidden />
        </motion.div>
        <span className="mt-1.5 hidden text-[10px] font-medium text-marketing-body-muted sm:block">You</span>
      </motion.div>

      {orbit.map((n) => (
        <motion.div
          key={n.id}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, delay: n.delay, ease: "easeOut" }}
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: n.delay,
            }}
            className="flex size-10 items-center justify-center rounded-full border border-marketing-border bg-marketing-card-surface text-marketing-body-muted shadow-sm"
          >
            <span className="text-[11px] font-semibold">+</span>
          </motion.div>
        </motion.div>
      ))}

      <motion.div
        className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-marketing-border bg-marketing-chip-bg px-2.5 py-1 text-[10px] font-medium text-marketing-chip-text shadow-sm"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <UserPlus className="size-3 shrink-0 text-marketing-accent" aria-hidden />
        Invite pending…
      </motion.div>
    </div>
  );
}
