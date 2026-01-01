"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

const ChatBubble = ({ message, isUser }: ChatBubbleProps) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isUser
            ? "bg-linear-to-r from-emerald-500 to-indigo-500 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

interface ConversationCardProps {
  conversation: { message: string; isUser: boolean }[];
  index: number;
}

const ConversationCard = ({ conversation, index }: ConversationCardProps) => {
  return (
    <Card
      className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl"
    >
      <CardContent className="p-0">
        <div className="space-y-2">
          {conversation.map((chat, idx) => (
            <ChatBubble key={idx} message={chat.message} isUser={chat.isUser} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function HowItWorks() {
  const conversations = [
    [
      { message: "Schedule a meeting with John tomorrow at 2 PM", isUser: true },
      { message: "Meeting scheduled! I've added it to your calendar and sent John an invite.", isUser: false },
    ],
    [
      { message: "Remind me to call Mom this evening", isUser: true },
      { message: "Got it! I'll remind you at 6 PM today.", isUser: false },
    ],
    [
      { message: "What's on my agenda for tomorrow?", isUser: true },
      { message: "You have 3 meetings: Team sync at 9 AM, lunch with Sarah at 12 PM, and project review at 3 PM.", isUser: false },
    ],
    [
      { message: "Find me a good time to work on the presentation", isUser: true },
      { message: "I found a 2-hour block tomorrow from 10 AM to 12 PM. Shall I block it?", isUser: false },
    ],
    [
      { message: "Summarize my emails from this morning", isUser: true },
      { message: "You received 12 emails. 3 require action, 5 are FYI, and 4 are newsletters.", isUser: false },
    ],
    [
      { message: "Move my 3 PM call to next week", isUser: true },
      { message: "Done! I've rescheduled to next Tuesday at 3 PM and notified all participants.", isUser: false },
    ],
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-5xl font-bold text-transparent bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
            Simple Conversations, Powerful Results
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600">
            Just chat naturally with Lofy like you would with a real assistant. 
            Watch how it understands and executes your requests effortlessly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conversation, index) => (
            <ConversationCard
              key={index}
              conversation={conversation}
              index={index}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600">
            And that's just the beginning. Lofy learns from every interaction to serve you better.
          </p>
        </div>
      </div>
    </section>
  );
}
