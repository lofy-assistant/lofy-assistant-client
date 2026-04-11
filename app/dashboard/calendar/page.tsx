import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";

const HISTORY_PATH = "/dashboard/history";

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ phone?: string }> }) {
  const { phone } = await searchParams;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (sessionToken && phone) {
    const session = await verifySession(sessionToken);
    if (session) {
      redirect(HISTORY_PATH);
    }
  }

  if (!sessionToken && phone) {
    redirect(`/login?redirect=${encodeURIComponent(HISTORY_PATH)}&phone=${phone}`);
  }

  redirect(HISTORY_PATH);
}
