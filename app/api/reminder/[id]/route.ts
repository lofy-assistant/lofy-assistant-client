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
        const { message, reminder_time } = body

        // Validation
        if (message && (typeof message !== 'string' || message.trim().length === 0)) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }
        if (message && message.length > 500) {
            return NextResponse.json({ error: "Message must be 500 characters or less" }, { status: 400 })
        }
        if (reminder_time && new Date(reminder_time) <= new Date()) {
            return NextResponse.json({ error: "Reminder time must be in the future" }, { status: 400 })
        }

        const reminder = await prisma.reminders.findUnique({
            where: { id: reminderId },
        })

        if (!reminder || reminder.user_id !== session.userId) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 })
        }

        // Update the reminder in database first
        const updatedReminder = await prisma.reminders.update({
            where: { id: reminderId },
            data: {
                message,
                reminder_time: reminder_time ? new Date(reminder_time) : undefined,
            },
        })

        // If reminder_time was provided in the update, reschedule the cloud task
        if (reminder_time) {
            console.log(`Starting cloud task rescheduling for reminder ${updatedReminder.id}`)
            
            // Get user's phone number for the task
            const user = await prisma.users.findUnique({
                where: { id: session.userId },
                select: { encrypted_phone: true }
            })

            if (!user?.encrypted_phone) {
                console.warn(`No phone number found for user ${session.userId}, skipping cloud task`)
            } else {
                try {
                    const phoneNumber = decryptContent(user.encrypted_phone)
                    const taskId = String(updatedReminder.id)

                    // Step 1: Delete existing task first to avoid duplicates
                    console.log(`Deleting existing cloud task: ${taskId}`)
                    await deleteCloudTask("reminder-queue", taskId)
                    console.log(`Successfully deleted cloud task: ${taskId}`)

                    // Step 2: Create new task with updated schedule and message
                    const data = {
                        reminder_id: updatedReminder.id,
                        message: updatedReminder.message,
                        phone_number: phoneNumber,
                    }

                    console.log(`Creating new cloud task: ${taskId} for time: ${updatedReminder.reminder_time}`)
                    await enqueueCloudTask(
                        "/worker/send-reminder",
                        "reminder-queue",
                        taskId,
                        data,
                        new Date(updatedReminder.reminder_time)
                    )
                    console.log(`Successfully rescheduled cloud task for reminder ${updatedReminder.id}`)
                } catch (taskError) {
                    console.error(`Error rescheduling cloud task for reminder ${updatedReminder.id}:`, taskError)
                    console.error(`Error details:`, JSON.stringify(taskError, null, 2))
                    // Don't fail the entire request if cloud task update fails
                    // The reminder is still updated in the database
                }
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

        // Delete the reminder from database
        await prisma.reminders.delete({
            where: { id: reminderId },
        })

        // Delete the associated cloud task
        try {
            await deleteCloudTask("reminder-queue", String(reminderId))
            console.log(`Deleted cloud task for reminder ${reminderId}`)
        } catch (taskError) {
            console.error("Error deleting cloud task:", taskError)
            // Don't fail the entire request if cloud task deletion fails
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting reminder:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
