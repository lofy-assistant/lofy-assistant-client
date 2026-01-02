import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/session"
import { deleteCloudTask, enqueueCloudTask } from "@/lib/cloud-tasks"
import { decryptContent } from "@/lib/encryption"

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get("session")?.value
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const session = await verifySession(token)
        if (!session?.userId) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 })
        }

        const reminderId = parseInt(params.id)
        const body = await request.json()
        const { message, reminder_time, status } = body

        const reminder = await prisma.reminders.findUnique({
            where: { id: reminderId },
        })

        if (!reminder || reminder.user_id !== session.userId) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 })
        }

        // Track if reminder_time was updated
        const reminderTimeUpdated = reminder_time && new Date(reminder_time).getTime() !== reminder.reminder_time.getTime()

        const updatedReminder = await prisma.reminders.update({
            where: { id: reminderId },
            data: {
                message,
                reminder_time: reminder_time ? new Date(reminder_time) : undefined,
                status,
            },
        })

        // If reminder_time was updated, reschedule the cloud task
        if (reminderTimeUpdated && process.env.NODE_ENV !== "development") {
            try {
                // Delete existing task first to avoid duplicates
                await deleteCloudTask("reminder-queue", String(reminder.id))

                // Get user's phone number for the task
                const user = await prisma.users.findUnique({
                    where: { id: session.userId },
                    select: { encrypted_phone: true }
                })

                if (user?.encrypted_phone) {
                    const phoneNumber = decryptContent(user.encrypted_phone)

                    // Create new task with updated schedule
                    const data = {
                        reminder_id: updatedReminder.id,
                        message: updatedReminder.message,
                        phone_number: phoneNumber,
                    }

                    await enqueueCloudTask(
                        "/worker/send-reminder",
                        "reminder-queue",
                        String(updatedReminder.id),
                        data,
                        new Date(reminder_time)
                    )

                    console.log(`Rescheduled cloud task for reminder ${updatedReminder.id}`)
                }
            } catch (taskError) {
                console.error("Error rescheduling cloud task:", taskError)
                // Don't fail the entire request if cloud task update fails
                // The reminder is still updated in the database
            }
        }

        return NextResponse.json({ reminder: updatedReminder })
    } catch (error) {
        console.error("Error updating reminder:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get("session")?.value
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const session = await verifySession(token)
        if (!session?.userId) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 })
        }

        const reminderId = parseInt(params.id)

        const reminder = await prisma.reminders.findUnique({
            where: { id: reminderId },
        })

        if (!reminder || reminder.user_id !== session.userId) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 })
        }

        await prisma.reminders.delete({
            where: { id: reminderId },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting reminder:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
