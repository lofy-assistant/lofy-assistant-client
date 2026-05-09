"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Bell, Brain } from "lucide-react";
import React from "react";

interface ChatAction {
  label: string;
  icon: React.ReactNode;
}

interface ChatMessage {
  message: string;
  isUser: boolean;
  action?: ChatAction;
}

interface ChatBubbleProps {
  chat: ChatMessage;
}

const ChatBubble = ({ chat }: ChatBubbleProps) => {
  return (
    <div className={`mb-3 flex ${chat.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl ${
          chat.isUser
            ? "rounded-br-sm bg-linear-to-br from-marketing-chat-user-from to-marketing-chat-user-to px-4 py-2 text-white"
            : "overflow-hidden rounded-bl-sm border border-marketing-border bg-marketing-chat-assistant-bg text-marketing-chat-assistant-text"
        }`}
      >
        <p className={`text-sm ${!chat.isUser ? "px-4 py-2" : ""}`}>{chat.message}</p>
        {!chat.isUser && chat.action && (
          <div className="flex items-center justify-center gap-1.5 border-t border-marketing-border px-4 py-2 text-sm font-medium text-marketing-chat-action select-none">
            {chat.action.icon}
            {chat.action.label}
          </div>
        )}
      </div>
    </div>
  );
};

interface ConversationCardProps {
  conversation: ChatMessage[];
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {
  return (
    <Card className="marketing-card rounded-lg p-6 transition-shadow hover:shadow-[0_22px_48px_-34px_var(--marketing-shadow)]">
      <CardContent className="p-0">
        <div className="space-y-2">
          {conversation.map((chat, idx) => (
            <ChatBubble key={idx} chat={chat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function HowItWorks() {
  const conversations: ChatMessage[][] = [
    [
      { message: "Schedule a meeting with John tomorrow at 2 PM", isUser: true },
      {
        message: "Meeting scheduled! It's synced to your calendar and a 15 minute reminder has been set.",
        isUser: false,
        action: { label: "View Calendar", icon: <CalendarDays className="size-4" /> },
      },
    ],
    [
      { message: "Remind me to submit assignment report this evening", isUser: true },
      {
        message: "Got it! I'll remind you at 6 PM today to submit the assignment report.",
        isUser: false,
        action: { label: "View Reminders", icon: <Bell className="size-4" /> },
      },
    ],
    [
      { message: "What's on my schedule for tomorrow?", isUser: true },
      {
        message: "You have 3 meetings: Basketball practice at 9 AM, lunch with Sarah at 12 PM, and project review at 3 PM.",
        isUser: false,
        action: { label: "View Calendar", icon: <CalendarDays className="size-4" /> },
      },
    ],
    [
      { message: "Find me a good time to work on the presentation tomorrow", isUser: true },
      {
        message: "I found a 2-hour block tomorrow from 10 AM to 12 PM. Shall I block it?",
        isUser: false,
        action: { label: "View Calendar", icon: <CalendarDays className="size-4" /> },
      },
    ],
    [
      { message: "Remember Lofy's email is business@lofy-ai.com", isUser: true },
      {
        message: "I've saved Lofy's email: business@lofy-ai.com. If you need to recall it later, just let me know!",
        isUser: false,
        action: { label: "View Memories", icon: <Brain className="size-4" /> },
      },
    ],
    [
      { message: "Move my 3 PM call to next week", isUser: true },
      {
        message: "Done! I've rescheduled to next Tuesday at 3 PM and it's synced to your calendar and a 15 minute reminder has been set.",
        isUser: false,
        action: { label: "View Calendar", icon: <CalendarDays className="size-4" /> },
      },
    ],
  ];

  return (
    <section className="marketing-section relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
          <Badge className="mb-4 border-marketing-border bg-marketing-accent-soft text-marketing-accent-soft-foreground hover:bg-marketing-accent-soft">
            Natural language, real outcomes
          </Badge>
          <h2 className="marketing-heading mb-6 text-4xl font-bold md:text-5xl">
            Simple conversations, powerful results
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-marketing-body md:text-lg">
            Chat the way you would with a real assistant. Lofy interprets the request and reflects it back in your
            calendar, reminders, and memories.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conversation, index) => (
            <ConversationCard key={index} conversation={conversation} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base text-marketing-body-muted">
            And that&apos;s just the beginning. Lofy learns from every interaction to serve you better.
          </p>
        </div>
      </div>
    </section>
  );
}
