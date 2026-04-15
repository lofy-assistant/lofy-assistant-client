import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/database";
import { DomainEvent } from "@/lib/models";
import { verifySession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ActivityEntity = "event" | "reminder" | "memory";
type ActivityAction = "created" | "updated" | "deleted";

type HistoryItem = {
	id: string;
	entity: ActivityEntity;
	action: ActivityAction;
	label: string;
	detail: string;
	at: string;
};

type EventDocument = {
	event_id: string;
	event_type: string;
	user_id: string;
	data?: Record<string, unknown>;
	event_metadata?: Record<string, unknown>;
	created_at: Date;
};

const SUPPORTED_EVENT_TYPES = [
	"event.created",
	"event.updated",
	"event.deleted",
	"reminder.created",
	"reminder.updated",
	"reminder.deleted",
	"memory.created",
	"memory.updated",
	"memory.deleted",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toCleanText(value: unknown): string | null {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : null;
	}

	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}

	if (value instanceof Date) {
		return value.toISOString();
	}

	if (isRecord(value) && typeof value.$date === "string") {
		return value.$date;
	}

	return null;
}

function sentenceCase(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

function excerpt(value: unknown, fallback: string): string {
	const text = toCleanText(value);
	if (!text) return fallback;
	return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}

function toBoolean(value: unknown): boolean | null {
	if (typeof value === "boolean") {
		return value;
	}

	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		if (normalized === "true") return true;
		if (normalized === "false") return false;
	}

	return null;
}

function parseDateValue(value: unknown): Date | null {
	const text = toCleanText(value);
	if (!text) {
		return null;
	}

	const parsed = new Date(text);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatEventDurationHours(start: Date | null, end: Date | null): string | null {
	if (!start || !end) {
		return null;
	}

	const durationMs = end.getTime() - start.getTime();
	if (durationMs <= 0) {
		return null;
	}

	const durationHours = durationMs / (1000 * 60 * 60);
	const roundedDuration = Number.isInteger(durationHours)
		? durationHours.toString()
		: durationHours.toFixed(1).replace(/\.0$/, "");

	return `Total: ${roundedDuration} hour${roundedDuration === "1" ? "" : "s"}.`;
}

function normalizeRecurrence(value: unknown): string | null {
	const recurrence = toCleanText(value);
	if (!recurrence) {
		return null;
	}

	const normalized = recurrence.replace(/^RRULE:/i, "");
	const frequencyMatch = normalized.match(/(?:^|;)FREQ=([A-Za-z]+)/i);

	if (!frequencyMatch) {
		return recurrence.replaceAll("_", " ");
	}

	const frequency = frequencyMatch[1].toUpperCase();
	const labels: Record<string, string> = {
		DAILY: "Daily",
		WEEKLY: "Weekly",
		MONTHLY: "Monthly",
		YEARLY: "Yearly",
	};

	return labels[frequency] ?? sentenceCase(frequency.toLowerCase());
}

function buildFieldSummary(fields: Record<string, unknown>): string {
	const entries = Object.entries(fields)
		.map(([key, value]) => {
			const text = toCleanText(value);
			if (!text) return null;
			return `${key.replaceAll("_", " ")}: ${text}`;
		})
		.filter((value): value is string => value !== null);

	if (entries.length === 0) {
		return "Lofy updated this item.";
	}

	return entries.join(". ");
}

function omitFields(
	fields: Record<string, unknown>,
	keysToOmit: string[]
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(fields).filter(([key]) => !keysToOmit.includes(key))
	);
}

function buildEventDetailLines(fields: Record<string, unknown>): string[] {
	const start = toCleanText(fields.start_time);
	const end = toCleanText(fields.end_time);
	const description = toCleanText(fields.description);
	const isAllDay = toBoolean(fields.is_all_day) ?? false;
	const totalHours = formatEventDurationHours(parseDateValue(fields.start_time), parseDateValue(fields.end_time));

	return [
		isAllDay ? "All Day Event." : null,
		start ? `Start: ${start}.` : null,
		end ? `End: ${end}.` : null,
		!isAllDay ? totalHours : null,
		description ? `Notes: ${excerpt(description, "")}.` : null,
	].filter((value): value is string => value !== null);
}

function buildReminderDetailLines(fields: Record<string, unknown>): string[] {
	const reminderTime = toCleanText(fields.reminder_time);
	const recurrence = normalizeRecurrence(fields.recurrence);
	const message = toCleanText(fields.message);
	const status = toCleanText(fields.status);

	return [
		message ? `Message: ${excerpt(message, "")}.` : null,
		reminderTime ? `Reminder time: ${reminderTime}.` : null,
		recurrence ? `Recurrence: ${recurrence}.` : null,
		status ? `Status: ${status}.` : null,
	].filter((value): value is string => value !== null);
}

function normalizeEventType(eventType: string): { entity: ActivityEntity; action: ActivityAction } | null {
	const [entity, action] = eventType.split(".");
	if (
		(entity === "event" || entity === "reminder" || entity === "memory") &&
		(action === "created" || action === "updated" || action === "deleted")
	) {
		return { entity, action };
	}

	return null;
}

function buildLabel(entity: ActivityEntity, action: ActivityAction, data: Record<string, unknown>): string {
	const changes = isRecord(data.changes) ? data.changes : null;
	const primary =
		toCleanText(data.title) ??
		toCleanText(data.message) ??
		toCleanText(data.content) ??
		toCleanText(changes?.title) ??
		toCleanText(changes?.message);

	if (primary) {
		return primary.length > 90 ? `${primary.slice(0, 87)}...` : primary;
	}

	const identifier =
		toCleanText(data.event_id) ?? toCleanText(data.reminder_id) ?? toCleanText(data.memory_id);

	if (identifier) {
		return `${sentenceCase(entity)} #${identifier}`;
	}

	return `${sentenceCase(entity)} ${action}`;
}

function buildDetail(
	entity: ActivityEntity,
	action: ActivityAction,
	data: Record<string, unknown>,
	metadata: Record<string, unknown>
): string {
	const changes = isRecord(data.changes) ? data.changes : null;
	const source = toCleanText(metadata.source);
	const sourceText = source ? ` Source: ${source.replaceAll("_", " ")}.` : "";

	if (entity === "event") {
		if (action === "created") {
			const parts = buildEventDetailLines(data);

			return parts.join("\n") || "Lofy created this calendar event.";
		}

		if (action === "updated") {
			const eventLines = buildEventDetailLines(changes ?? {});
			const remainingChanges = buildFieldSummary(
				omitFields(changes ?? {}, ["start_time", "end_time", "is_all_day", "description"])
			);
			const parts = [
				...eventLines,
				remainingChanges !== "Lofy updated this item." ? remainingChanges : null,
			].filter((value): value is string => value !== null);

			return parts.join("\n") || "Lofy updated this calendar event.";
		}

		const eventLines = buildEventDetailLines(data);
		const identifier = toCleanText(data.event_id);
		const summary = identifier ? `Removed event #${identifier}.` : "Lofy deleted this calendar event.";
		return [summary, ...eventLines].join("\n");
	}

	if (entity === "reminder") {
		if (action === "created") {
			const parts = buildReminderDetailLines(data);

			return parts.join("\n") || "Lofy created this reminder.";
		}

		if (action === "updated") {
			const reminderLines = buildReminderDetailLines(changes ?? {});
			const remainingChanges = buildFieldSummary(
				omitFields(changes ?? {}, ["message", "reminder_time", "recurrence", "status"])
			);
			const parts = [
				...reminderLines,
				remainingChanges !== "Lofy updated this item." ? remainingChanges : null,
			].filter((value): value is string => value !== null);

			return parts.join("\n") || "Lofy updated this reminder.";
		}

		const reminderLines = buildReminderDetailLines(data);
		const identifier = toCleanText(data.reminder_id);
		const summary = identifier ? `Removed reminder #${identifier}.` : "Lofy deleted this reminder.";
		return [summary, ...reminderLines].join("\n");
	}

	if (action === "created") {
		return `${excerpt(data.content, "Lofy saved this memory.")}${sourceText}`.trim();
	}

	if (action === "updated") {
		return `${buildFieldSummary(changes ?? {})}${sourceText}`.trim();
	}

	const identifier = toCleanText(data.memory_id);
	const title = toCleanText(data.title);
	const summary = `${identifier ? `Removed memory #${identifier}.` : "Lofy deleted this memory."}${sourceText}`.trim();
	return title ? `${summary}\nTitle: ${excerpt(title, "")}.` : summary;
}

function normalizeHistoryItem(event: EventDocument): HistoryItem | null {
	const normalizedType = normalizeEventType(event.event_type);
	if (!normalizedType) {
		return null;
	}

	const data = isRecord(event.data) ? event.data : {};
	const metadata = isRecord(event.event_metadata) ? event.event_metadata : {};

	return {
		id: event.event_id,
		entity: normalizedType.entity,
		action: normalizedType.action,
		label: buildLabel(normalizedType.entity, normalizedType.action, data),
		detail: buildDetail(normalizedType.entity, normalizedType.action, data, metadata),
		at: event.created_at.toISOString(),
	};
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const token = request.cookies.get("session")?.value;

		if (!token) {
			return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
		}

		const session = await verifySession(token);

		if (!session?.userId) {
			return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
		}

		if (id !== "me" && id !== session.userId) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { searchParams } = new URL(request.url);
		const limitParam = Number.parseInt(searchParams.get("limit") ?? "50", 10);
		const limit = Number.isFinite(limitParam)
			? Math.min(Math.max(limitParam, 1), 100)
			: 50;

		await connectMongo();

		const events = await DomainEvent.find({
			user_id: session.userId,
			event_type: { $in: SUPPORTED_EVENT_TYPES },
		})
			.sort({ created_at: -1 })
			.limit(limit)
			.select({
				event_id: 1,
				event_type: 1,
				user_id: 1,
				data: 1,
				event_metadata: 1,
				created_at: 1,
			})
			.lean<EventDocument[]>()
			.exec();

		const items = events
			.map(normalizeHistoryItem)
			.filter((item: HistoryItem | null): item is HistoryItem => item !== null);

		return NextResponse.json({ items, count: items.length }, { status: 200 });
	} catch (error) {
		console.error("History API Error:", error);

		return NextResponse.json(
			{
				error: "Failed to fetch history",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
