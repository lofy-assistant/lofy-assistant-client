import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient();

async function main() {
  const user1 = "4c47f74d-8bcf-4025-b94f-39421ddc784a";

  const now = new Date();

  // Utility functions
  const addHours = (date: Date, hours: number) => {
    const copy = new Date(date);
    copy.setHours(copy.getHours() + hours);
    return copy;
  };

  const addMinutes = (date: Date, minutes: number) => {
    const copy = new Date(date);
    copy.setMinutes(copy.getMinutes() + minutes);
    return copy;
  };

  const addDays = (date: Date, days: number) => {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  };

  // -------------------------------
  // Calendar Events (30 records)
  // -------------------------------
  const eventsUser1 = Array.from({ length: 30 }).map((_, i) => {
    const start = addHours(now, i * 3 + 1);
    const end = addHours(start, 2);

    return {
      user_id: user1,
      title: `User 1 Event ${i + 1}`,
      description: `Sample description for event ${i + 1}`,
      start_time: start,
      end_time: end,
      timezone: "Asia/Kuala_Lumpur",
      is_all_day: i % 10 === 0, // diversify: every 10th event is all-day
      created_at: addDays(now, -i), // stagger creation dates backwards
    };
  });

  await prisma.calendar_events.createMany({ data: eventsUser1 });
  console.log("Calendar events seeded successfully");

  // -------------------------------
  // Reminders (30 records)
  // -------------------------------
  const remindersUser1 = Array.from({ length: 30 }).map((_, i) => ({
    user_id: user1,
    message: `User 1 reminder ${i + 1}`,
    reminder_time: addMinutes(now, (i + 1) * 15),
    status: i % 2 === 0 ? "pending" : "completed",
    created_at: addDays(now, -Math.floor(i / 2)), // diversify creation dates
  }));

  await prisma.reminders.createMany({ data: remindersUser1 });
  console.log("Reminders seeded successfully");

  // -------------------------------
  // Feedbacks (40 records)
  // -------------------------------
  const feedbacksUser1 = Array.from({ length: 40 }).map((_, i) => ({
    user_id: user1,
    title: `Feedback ${i + 1}`,
    description: i % 3 === 0 ? `Detailed feedback for item ${i + 1}` : null,
    tag: i % 2 === 0 ? "feature" : "bug",
    created_at: addDays(now, -i),
  }));

  await prisma.feedbacks.createMany({ data: feedbacksUser1 });
  console.log("Feedbacks seeded successfully");

  // -------------------------------
  // Memories (35 records)
  // -------------------------------
  const memoriesUser1 = Array.from({ length: 35 }).map((_, i) => ({
    user_id: user1,
    title: `Memory ${i + 1}`,
    content: `This is memory content number ${i + 1}`,
    created_at: addDays(now, -i),
  }));

  await prisma.memories.createMany({ data: memoriesUser1 });
  console.log("Memories seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
