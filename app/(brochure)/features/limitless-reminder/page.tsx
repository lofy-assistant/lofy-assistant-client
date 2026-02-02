"use client";

import AppNavBar from "@/components/app-navbar";
import FeatureBreadcrumb from "@/components/brochure/features/feature-breadcrumb";
import FeatureHeader from "@/components/brochure/features/feature-header";
import Footer from "@/components/brochure/home/footer";
import CTASection from "@/components/brochure/home/cta-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Repeat, Clock, Zap, MessageSquare } from "lucide-react";

export default function LimitlessReminderPage() {
  const reminderTypes = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "One-Time Reminders",
      description: "Set a reminder for a specific date and time. Perfect for appointments, deadlines, or one-off tasks.",
      examples: ["Remind me at 3pm to call mom", "Reminder tomorrow 9am: submit report"],
    },
    {
      icon: <Repeat className="w-6 h-6" />,
      title: "Recurring Reminders",
      description: "Daily, weekly, monthly, or custom intervals. Great for habits, bills, or regular check-ins.",
      examples: ["Every Monday remind me to review goals", "Daily at 8am: take vitamins"],
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Event-Based Reminders",
      description: "Get notified before calendar events. Customize lead time for each reminder.",
      examples: ["Remind me 1 hour before meetings", "30 min heads up for dentist"],
    },
  ];

  return (
    <div className="relative min-h-screen">
      <AppNavBar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <FeatureBreadcrumb featureName="Limitless Reminder" />
          </div>
          <FeatureHeader
            badge="⏰ Reminders"
            title="Limitless Reminder"
            description="Tailor reminders to any specific task or calendar event. Never miss an important deadline or appointment again."
          />
        </div>
      </section>

      {/* Reminder Types Section */}
      <section className="relative py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">🔔 Reminder Types</Badge>
            <h2 className="text-4xl font-bold mb-4">Flexible Scheduling</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From quick one-time alerts to complex recurring schedules—Lofy handles it all.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reminderTypes.map((type) => (
              <Card key={type.title} className="hover:shadow-lg transition-all hover:scale-[1.02] py-6">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
                    {type.icon}
                  </div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{type.description}</CardDescription>
                  <div className="space-y-2">
                    {type.examples.map((example) => (
                      <div key={example} className="text-xs px-3 py-2 bg-muted rounded-lg">
                        "{example}"
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">✨ Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Smart Reminder Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just notifications—intelligent reminders that adapt to your life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 py-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                  <CardTitle>Natural Language</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Just talk naturally. "Remind me next Tuesday at 2pm" or "Every Friday remind me to submit timesheet." 
                  No forms, no menus—just chat.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 py-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-emerald-600" />
                  <CardTitle>Smart Snooze</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Busy when the reminder hits? Just reply "snooze 30 min" or "remind me tonight instead." 
                  Lofy reschedules instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-2 py-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-orange-600" />
                  <CardTitle>Priority Levels</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mark reminders as urgent for persistent notifications, or low-priority for gentle nudges. 
                  Lofy adjusts notification intensity accordingly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-2 py-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-pink-600" />
                  <CardTitle>Calendar Sync</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Reminders sync with Google Calendar automatically. See all your reminders alongside 
                  events in one unified view.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Unlimited Section */}
      <section className="relative py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">♾️ Unlimited</Badge>
            <h2 className="text-4xl font-bold mb-4">No Limits, No Worries</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlike other apps that cap your reminders, Lofy gives you unlimited freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">∞</div>
              <h3 className="text-xl font-bold mb-2">Limitless Reminder</h3>
              <p className="text-muted-foreground">
                Create as many reminders as you need. Personal, work, family—no restrictions.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">∞</div>
              <h3 className="text-xl font-bold mb-2">Unlimited Recurring</h3>
              <p className="text-muted-foreground">
                Set up daily, weekly, or monthly reminders without limits. Build your perfect routine.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">∞</div>
              <h3 className="text-xl font-bold mb-2">Unlimited History</h3>
              <p className="text-muted-foreground">
                Access your complete reminder history. See what you've accomplished over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Setting reminders is as easy as sending a message.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                1️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Tell Lofy What & When</h3>
              <p className="text-muted-foreground">
                Just message what you need to be reminded about and when. Natural language, no special format needed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                2️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Lofy Confirms & Schedules</h3>
              <p className="text-muted-foreground">
                Lofy confirms the details and schedules your reminder. It syncs to your calendar automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                3️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Get Notified On Time</h3>
              <p className="text-muted-foreground">
                When the time comes, Lofy sends you a WhatsApp message. Snooze, complete, or reschedule with a reply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Conversation */}
      <section className="relative py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">💬 In Action</Badge>
            <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg rounded-tr-none p-3 max-w-[80%]">
                  <p className="text-sm">Remind me every weekday at 9am to check my emails and every Friday at 5pm to submit my timesheet</p>
                </div>
              </div>
              
              {/* AI response */}
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-sm">Done! ⏰ I've set up two recurring reminders:<br/><br/>1. Daily (Mon-Fri) at 9:00 AM: Check emails<br/>2. Weekly (Friday) at 5:00 PM: Submit timesheet<br/><br/>Both added to your calendar!</p>
                </div>
              </div>

              {/* Later notification */}
              <div className="text-center text-xs text-muted-foreground py-2">— Friday, 5:00 PM —</div>

              {/* AI notification */}
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-sm">🔔 Reminder: Submit timesheet<br/><br/>Reply "done" to mark complete, or "snooze 1 hour" to delay.</p>
                </div>
              </div>
              
              {/* User response */}
              <div className="flex justify-end">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg rounded-tr-none p-3 max-w-[80%]">
                  <p className="text-sm">done!</p>
                </div>
              </div>

              {/* AI confirmation */}
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-sm">Nice work! ✅ Timesheet reminder marked complete. See you next Friday!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}
