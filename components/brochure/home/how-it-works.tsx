"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Bell, Brain, Clock, Mail, RefreshCw } from "lucide-react";
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
    <div className={`flex ${chat.isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[80%] rounded-2xl ${chat.isUser ? "bg-linear-to-r from-emerald-500 to-indigo-500 text-white rounded-br-sm px-4 py-2" : "bg-gray-100 text-gray-800 rounded-bl-sm overflow-hidden"}`}>
        <p className={`text-sm ${!chat.isUser ? "px-4 py-2" : ""}`}>{chat.message}</p>
        {!chat.isUser && chat.action && (
          <div className="border-t border-gray-200 px-4 py-2 flex items-center justify-center gap-1.5 text-[#075E54] text-sm font-medium select-none">
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
    <Card className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
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
        action: { label: "View Calendar", icon: <CalendarDays className="w-4 h-4" /> },
      },
    ],
    [
      { message: "Remind me to submit assignment report this evening", isUser: true },
      {
        message: "Got it! I'll remind you at 6 PM today to submit the assignment report.",
        isUser: false,
        action: { label: "View Reminders", icon: <Bell className="w-4 h-4" /> },
      },
    ],
    [
      { message: "What's on my schedule for tomorrow?", isUser: true },
      {
        message: "You have 3 meetings: Basketball practice at 9 AM, lunch with Sarah at 12 PM, and project review at 3 PM.",
        isUser: false,
        action: { label: "View Calendar", icon: <CalendarDays className="w-4 h-4" /> },
      },
    ],
    [
      { message: "Find me a good time to work on the presentation tomorrow", isUser: true },
      {
        message: "I found a 2-hour block tomorrow from 10 AM to 12 PM. Shall I block it?",
        isUser: false,
        action: { label: "View Calendar", icon: <CalendarDays className="w-4 h-4" /> },
      },
    ],
    [
      { message: "Remember Lofy's email is business@lofy-ai.com", isUser: true },
      {
        message: "I've saved Lofy's email: business@lofy-ai.com. If you need to recall it later, just let me know!",
        isUser: false,
        action: { label: "View Memories", icon: <Brain className="w-4 h-4" /> },
      },
    ],
    [
      { message: "Move my 3 PM call to next week", isUser: true },
      {
        message: "Done! I've rescheduled to next Tuesday at 3 PM and it's synced to your calendar and a 15 minute reminder has been set.",
        isUser: false,
        action: { label: "View Calendar", icon: <CalendarDays className="w-4 h-4" /> },
      },
    ],
  ];

  return (
    <section className="relative pt-24 pb-8 my-8 md:mt-16 md:mb-4 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl md:text-5xl font-bold text-transparent bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">Simple Conversations, Powerful Results</h2>
          <p className="max-w-5xl mx-auto leading-relaxed text-gray-600 text-md lg:text-lg">Just chat naturally with Lofy like you would with a real assistant. Watch how it understands and executes your requests effortlessly.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conversation, index) => (
            <ConversationCard key={index} conversation={conversation} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600">And that's just the beginning. Lofy learns from every interaction to serve you better.</p>
        </div>
      </div>
    </section>
  );
}
