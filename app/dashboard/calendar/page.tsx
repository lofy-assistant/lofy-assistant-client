import { redirect } from "next/navigation";

type LegacyDashboardRedirectPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function buildHistoryUrl(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
      continue;
    }

    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `/dashboard/history?${query}` : "/dashboard/history";
}

export default async function CalendarPage({ searchParams }: LegacyDashboardRedirectPageProps) {
  // Temporary backwards-compatibility redirect for legacy dashboard links.
  const resolvedSearchParams = searchParams ? await searchParams : {};

  redirect(buildHistoryUrl(resolvedSearchParams));
}