import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { BookOpen, Brain, Bell, Calendar, MessageSquare, Mic, Lightbulb, HelpCircle, RefreshCw, Rocket, CheckCircle2, XCircle } from "lucide-react";

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Lofy AI User Guide</h1>
          </div>
          <p className="max-w-3xl mx-auto text-xl text-muted-foreground">Learn everything you need to know to get the most out of Lofy AI. Manage your life with reminders, calendar events, and memory storage.</p>
        </div>

        <Separator className="mb-12" />
      </div>

      <TracingBeam className="px-4">
        {/* Memory Storage & Recall */}
        <Card className="mb-8 py-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Memory Storage & Recall</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Save Information for Later</h3>
              <p className="mb-3 text-muted-foreground">Tell your assistant to remember anything important:</p>
              <ul className="mb-4 space-y-2 list-disc list-inside text-muted-foreground">
                <li>Templates, account numbers, passwords (we make sure all data that is stored is encrypted)</li>
                <li>Important facts, contact details, or notes</li>
              </ul>
              <div className="p-4 bg-muted rounded-lg">
                <p className="mb-2 text-sm font-semibold">How to use:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>&quot;Remember that David&apos;s email is david123@gmail.com&quot;</li>
                  <li>&quot;Remember my account number: 1234567890&quot;</li>
                </ul>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Recall Saved Information</h3>
              <p className="mb-3 text-muted-foreground">Ask your assistant to retrieve what you&apos;ve saved:</p>
              <ul className="mb-4 space-y-2 list-disc list-inside text-muted-foreground">
                <li>&quot;What&apos;s David&apos;s email again?&quot;</li>
                <li>&quot;Recall my account number&quot;</li>
              </ul>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> After searching memories, you&apos;ll get a link to view all your saved memories in the dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card className="mb-8 py-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Reminders</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Create Quick Reminders</h3>
              <p className="mb-3 text-muted-foreground">Perfect for tasks that need a nudge within the next few hours (less than 5 hours away).</p>
              <div className="p-4 bg-muted rounded-lg mb-4">
                <p className="mb-2 text-sm font-semibold">How to use:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>&quot;Remind me to call mom in 2 hours&quot;</li>
                  <li>&quot;Remind me to take medicine in 30 minutes&quot;</li>
                  <li>&quot;Remind me tomorrow at 3pm to submit the report&quot;</li>
                  <li>&quot;Alert me in 15 minutes to check the oven&quot;</li>
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg mb-4">
                <p className="mb-2 text-sm font-semibold">Time formats that work best:</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs font-semibold text-green-700 dark:text-green-400">✅ Supported formats:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>&quot;in 30 minutes&quot;, &quot;in 2 hours&quot;</li>
                      <li>&quot;tomorrow at 9am&quot;, &quot;today at 3pm&quot;</li>
                      <li>&quot;tomorrow 9am&quot;, &quot;next Monday 2pm&quot;</li>
                      <li>&quot;3pm&quot;, &quot;9:30am&quot;, &quot;15:00&quot;</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong>Important:</strong> Reminders work best for tasks less than 5 hours away. For events more than 5 hours away, the assistant will automatically create a calendar event instead (so you don&apos;t forget!). You&apos;ll get a reminder notification 15 minutes before scheduled
                  events.
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Find Your Reminders</h3>
              <p className="mb-3 text-muted-foreground">Search for reminders by date, time, or message:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>&quot;Show me my reminders for tomorrow&quot;</li>
                <li>&quot;Find my reminder to call mom&quot;</li>
                <li>&quot;What reminders do I have this week?&quot;</li>
                <li>&quot;Search for reminders on Friday at 2pm&quot;</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Update Reminders</h3>
              <p className="mb-3 text-muted-foreground">Change the time or message of an existing reminder:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>&quot;Change my reminder to call mom to 4pm instead&quot;</li>
                <li>&quot;Update my reminder - change the time to tomorrow at 2pm&quot;</li>
                <li>&quot;Reschedule my reminder to next week&quot;</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Delete Reminders</h3>
              <p className="mb-3 text-muted-foreground">Remove reminders you no longer need:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>&quot;Delete my reminder to take medicine&quot;</li>
                <li>&quot;Cancel my reminder&quot;</li>
                <li>&quot;Remove my reminder to call mom&quot;</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Events */}
        <Card className="mb-8 py-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Calendar Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Schedule Events</h3>
              <p className="mb-3 text-muted-foreground">Perfect for meetings, appointments, social events, and anything with a specific time window.</p>
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold">What counts as an event:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Meetings and appointments (dentist, doctor, etc.)</li>
                  <li>Social events: weddings, parties, celebrations, dinners</li>
                  <li>Classes, workshops, concerts, shows</li>
                  <li>Any activity you need to attend at a specific time</li>
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg mb-4">
                <p className="mb-2 text-sm font-semibold">How to use:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>&quot;Book a meeting with Jason tomorrow 3pm to 4pm&quot;</li>
                  <li>&quot;I have a dentist appointment on Friday at 10am&quot;</li>
                  <li>&quot;I got a wedding to attend on December 13 at 8pm&quot;</li>
                  <li>&quot;Schedule a party Friday night from 7pm to 11pm&quot;</li>
                </ul>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-4">
                <p className="mb-2 text-sm font-semibold">What happens automatically:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>The assistant creates both a calendar event AND a reminder</li>
                  <li>You&apos;ll get a reminder notification 15 minutes before the event starts</li>
                  <li>If you only provide a start time, the assistant will estimate a reasonable duration (usually 1-2 hours)</li>
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Important:</strong> If you mention attending something at a specific time, it becomes a calendar event (not just a reminder). The assistant will ask for missing details like end time if needed. You&apos;ll get a link to view your calendar in the dashboard.
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Find Events</h3>
              <p className="mb-3 text-muted-foreground">Search your calendar:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>&quot;Show me my meetings tomorrow&quot;</li>
                <li>&quot;What do I have on Friday at 2pm?&quot;</li>
                <li>&quot;Find my dentist appointment&quot;</li>
                <li>&quot;Show me events from next Monday to next Friday&quot;</li>
                <li>&quot;What&apos;s my schedule this week?&quot;</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Update Events</h3>
              <p className="mb-3 text-muted-foreground">Reschedule or modify existing events:</p>
              <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                <li>&quot;Change my meeting with Jason to 4pm&quot;</li>
                <li>&quot;Update my dentist appointment to next week&quot;</li>
                <li>&quot;Reschedule my event to Friday at 3pm&quot;</li>
                <li>&quot;Change the title of my meeting to &apos;Project Discussion&apos;&quot;</li>
              </ul>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong>What happens:</strong> The event gets updated. If you change the time, the reminder automatically reschedules too (still 15 minutes before).
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Delete Events</h3>
              <p className="mb-3 text-muted-foreground">Cancel or remove events:</p>
              <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                <li>&quot;Delete my meeting with Jason&quot;</li>
                <li>&quot;Cancel my dentist appointment&quot;</li>
                <li>&quot;Remove my event on Friday&quot;</li>
              </ul>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong>What happens:</strong> The event is deleted. The associated reminder is also automatically deleted.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forwarded Messages & Images */}
        <Card className="mb-8 py-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Forwarded Messages & Images</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">If you forward a message or share an image (like a wedding invitation or event flyer):</p>
            <div>
              <p className="mb-2 text-sm font-semibold">What the assistant does:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Acknowledges what you shared: &quot;I see you&apos;ve shared a wedding invitation for [date]&quot;</li>
                <li>Asks if you want to add it to your calendar: &quot;Would you like me to add this to your calendar?&quot;</li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">What the assistant doesn&apos;t do:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Automatically create events or reminders without your permission</li>
                <li>Assume you want to schedule something just because you shared it</li>
              </ul>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="mb-2 text-sm font-semibold">You need to explicitly say:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>&quot;Yes, add it&quot;</li>
                <li>&quot;Schedule it&quot;</li>
                <li>&quot;Remind me about this&quot;</li>
                <li>Or similar confirmation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Voice Messages & Images */}
        <Card className="mb-8 py-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mic className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Voice Messages & Images</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Send Voice Messages</h3>
              <p className="mb-3 text-muted-foreground">You don&apos;t have to type everything! The assistant can understand voice messages just like text:</p>
              <div className="p-4 bg-muted rounded-lg mb-4">
                <p className="mb-2 text-sm font-semibold">How to use:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Record a voice message saying &quot;Remind me to call mom in 2 hours&quot;</li>
                  <li>Send a voice note: &quot;I have a dentist appointment tomorrow at 10am&quot;</li>
                  <li>Speak naturally: &quot;Remember that my favorite coffee is a double shot latte&quot;</li>
                </ul>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-4">
                <p className="mb-2 text-sm font-semibold">What the assistant does:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Transcribes your voice message automatically</li>
                  <li>Understands your request just like typed text</li>
                  <li>Responds in the same way as if you had typed it</li>
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Perfect for:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>When you&apos;re on the go and can&apos;t type</li>
                  <li>Quick reminders while driving (hands-free!)</li>
                  <li>Natural conversation flow</li>
                </ul>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Send Images</h3>
              <p className="mb-3 text-muted-foreground">The assistant can see and understand images you send:</p>
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold">What the assistant can do:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Read text in images (OCR - Optical Character Recognition)</li>
                  <li>Understand event flyers, invitations, and posters</li>
                  <li>Extract dates, times, and event details from images</li>
                  <li>Recognize what&apos;s in the image and help you act on it</li>
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg mb-4">
                <p className="mb-2 text-sm font-semibold">How to use:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Send a photo of a wedding invitation → Assistant can extract the date and ask if you want to add it to your calendar</li>
                  <li>Share a screenshot of an event poster → Assistant can read the details and help you schedule it</li>
                  <li>Send an image with text → Assistant can read and understand the content</li>
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="mb-2 text-sm font-semibold">Examples:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Send a wedding invitation image → &quot;I see a wedding invitation for December 13th at 8pm. Would you like me to add this to your calendar?&quot;</li>
                  <li>Share a meeting flyer → Assistant reads the details and can create the event for you</li>
                  <li>Send a screenshot with event info → Assistant extracts the information and offers to schedule it</li>
                </ul>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Just like with forwarded messages, the assistant will ask for your confirmation before creating events or reminders from images.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="mb-8 py-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Quick Tips</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Time Formatting</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Use natural language: &quot;in 2 hours&quot;, &quot;tomorrow at 3pm&quot;, &quot;next Monday 9am&quot;</li>
                <li>Don&apos;t worry about exact formats - the assistant understands most ways of saying time</li>
                <li>If something is unclear, the assistant will ask for clarification</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Reminders vs Events</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="mb-2 font-semibold">Reminders</p>
                  <p className="text-sm text-muted-foreground">Quick tasks less than 5 hours away (e.g., &quot;remind me in 30 minutes&quot;)</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="mb-2 font-semibold">Events</p>
                  <p className="text-sm text-muted-foreground">Scheduled activities with specific times (e.g., &quot;meeting tomorrow 3pm&quot;)</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">The assistant automatically converts reminders to events if they&apos;re more than 5 hours away.</p>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Missing Information</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>If you forget to include details (like end time for an event), the assistant will ask</li>
                <li>You might get quick buttons to choose from (like &quot;In 1 hour&quot;, &quot;In 2 hours&quot;, &quot;Custom&quot;)</li>
                <li>Or lists if there are multiple options</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Viewing Everything</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Ask &quot;show me all my reminders&quot; or &quot;give me all my events&quot; to get a link to the dashboard</li>
                <li>The dashboard shows everything in one place</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Need Help? */}
        <Card className="mb-8 py-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Need Help?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">If you&apos;re not sure how to phrase something:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Just ask naturally - the assistant is smart about understanding intent</li>
              <li>Be specific about what you want (time, date, details)</li>
              <li>The assistant will ask if something is unclear</li>
            </ul>
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Examples of clear requests:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>&quot;Remind me to call mom tomorrow at 3pm&quot;</li>
                  <li>&quot;Schedule a meeting with Sarah on Friday from 2pm to 3pm&quot;</li>
                  <li>&quot;Remember that my favorite pizza place is Pizza Hut&quot;</li>
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-orange-600" />
                  Examples that might need clarification:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>&quot;Remind me later&quot; (when is later?)</li>
                  <li>&quot;I have a meeting&quot; (when? with whom?)</li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">The assistant will ask for the missing details!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Workflows */}
        <Card className="mb-8 py-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Common Workflows</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Creating an Event with Reminder</h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Say: &quot;I have a meeting with Jason tomorrow 3pm to 4pm&quot;</li>
                <li>
                  Assistant creates:
                  <ul className="mt-2 ml-6 space-y-1 list-disc">
                    <li>A reminder for tomorrow at 2:45pm (15 minutes before)</li>
                    <li>A calendar event for tomorrow 3pm-4pm</li>
                  </ul>
                </li>
                <li>You get confirmation and a link to view in dashboard</li>
              </ol>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Updating an Event</h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Say: &quot;Change my meeting with Jason to 4pm&quot;</li>
                <li>
                  Assistant:
                  <ul className="mt-2 ml-6 space-y-1 list-disc">
                    <li>Finds the existing meeting</li>
                    <li>Updates the time to 4pm</li>
                    <li>Reschedules the reminder to 3:45pm</li>
                  </ul>
                </li>
                <li>You get confirmation</li>
              </ol>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Deleting an Event</h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Say: &quot;Delete my meeting with Jason&quot;</li>
                <li>
                  Assistant:
                  <ul className="mt-2 ml-6 space-y-1 list-disc">
                    <li>Finds the meeting</li>
                    <li>Deletes the event</li>
                    <li>Deletes the associated reminder</li>
                  </ul>
                </li>
                <li>You get confirmation</li>
              </ol>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Storing and Recalling Information</h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Say: &quot;Remember that my car plate is VBP1234&quot;</li>
                <li>Assistant saves it</li>
                <li>Later, say: &quot;What&apos;s my car plate?&quot;</li>
                <li>Assistant retrieves and tells you: &quot;VBP1234&quot;</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="mb-8 py-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Rocket className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Getting Started</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Try these to get familiar:</p>
            <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
              <li>
                <strong>Save something:</strong> &quot;Remember that I love chocolate ice cream&quot;
              </li>
              <li>
                <strong>Create a reminder:</strong> &quot;Remind me in 1 hour to check my email&quot;
              </li>
              <li>
                <strong>Schedule an event:</strong> &quot;I have a doctor appointment tomorrow at 2pm&quot;
              </li>
              <li>
                <strong>Find something:</strong> &quot;Show me my reminders for tomorrow&quot;
              </li>
              <li>
                <strong>Recall memory:</strong> &quot;What did I tell you about ice cream?&quot;
              </li>
            </ol>
          </CardContent>
        </Card>
      </TracingBeam>
    </div>
  );
}
