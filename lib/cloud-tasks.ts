interface TaskData {
  reminder_id: number;
  message: string;
  phone_number?: string;
}

const projectId = process.env.GCP_PROJECT_ID || "";
const location = process.env.GCP_LOCATION || "asia-southeast1";
const serviceUrl = process.env.GCP_SERVICE_URL || "";

// Lazy load CloudTasksClient to avoid bundling issues in serverless
let clientPromise: Promise<import("@google-cloud/tasks").CloudTasksClient> | null = null;

async function getClient(): Promise<import("@google-cloud/tasks").CloudTasksClient> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const { CloudTasksClient } = await import("@google-cloud/tasks");

      // Get credentials from environment variable
      // GCP_SERVICE_ACCOUNT_KEY should be a JSON string of the service account key
      const serviceAccountKey = process.env.GCP_SERVICE_ACCOUNT_KEY;

      // Define type for clientConfig instead of using 'any'
      type ClientConfig = {
        projectId?: string;
        credentials?: object;
      };

      const clientConfig: ClientConfig = {
        projectId: projectId || undefined,
      };

      if (serviceAccountKey) {
        try {
          // Parse the JSON credentials
          const credentials = JSON.parse(serviceAccountKey);
          Object.assign(clientConfig, { credentials });
        } catch (error) {
          console.error("Failed to parse GCP_SERVICE_ACCOUNT_KEY:", error);
          // If parsing fails, try to use it as-is (might be base64 encoded)
          try {
            const decoded = Buffer.from(serviceAccountKey, "base64").toString("utf-8");
            Object.assign(clientConfig, { credentials: JSON.parse(decoded) });
          } catch (decodeError) {
            console.error("Failed to decode GCP_SERVICE_ACCOUNT_KEY:", decodeError);
            throw new Error("Invalid GCP_SERVICE_ACCOUNT_KEY format. Expected JSON string or base64-encoded JSON.");
          }
        }
      }

      return new CloudTasksClient(clientConfig);
    })();
  }
  return clientPromise;
}

/**
 * Delete cloud tasks associated with a reminder ID
 * Since we let GCP auto-generate task names, we need to list tasks and find by reminder_id
 * @param queueId - The queue ID (e.g., "reminder-queue")
 * @param reminderId - The reminder ID to search for
 */
export async function deleteCloudTask(queueId: string, reminderId: string): Promise<void> {
  try {
    const client = await getClient();
    const queuePath = client.queuePath(projectId, location, queueId);

    // List all tasks in the queue
    const [tasks] = await client.listTasks({ parent: queuePath });

    // Find tasks that match this reminder_id
    const tasksToDelete = [];
    for (const task of tasks) {
      if (task.httpRequest?.body) {
        try {
          // Decode the base64 body
          const bodyString = Buffer.from(task.httpRequest.body as string, "base64").toString("utf-8");
          const bodyData = JSON.parse(bodyString);

          // Check if this task is for our reminder
          if (bodyData.reminder_id === parseInt(reminderId)) {
            tasksToDelete.push(task.name);
          }
        } catch {
          // Skip tasks we can't parse
          continue;
        }
      }
    }

    // Delete all matching tasks
    for (const taskName of tasksToDelete) {
      try {
        await client.deleteTask({ name: taskName });
        console.log(`Deleted cloud task: ${taskName} for reminder ${reminderId}`);
      } catch (deleteError: unknown) {
        if (deleteError && typeof deleteError === "object" && "code" in deleteError && deleteError.code === 5) {
          // NOT_FOUND - task already deleted
          console.log(`Task ${taskName} not found, skipping`);
        } else {
          throw deleteError;
        }
      }
    }

    if (tasksToDelete.length === 0) {
      console.log(`No cloud tasks found for reminder ${reminderId}`);
    }
  } catch (error: unknown) {
    console.error(`Error deleting cloud tasks for reminder ${reminderId}:`, error);
    throw error;
  }
}

/**
 * Enqueue a cloud task with scheduled execution time
 * @param endpointPath - The API endpoint path (e.g., "/worker/send-reminder")
 * @param queueId - The queue ID (e.g., "reminder-queue")
 * @param taskId - The unique task ID
 * @param bodyData - The data to send in the task payload
 * @param scheduleTime - The UTC time to schedule the task
 */
export async function enqueueCloudTask(endpointPath: string, queueId: string, taskId: string, bodyData: TaskData, scheduleTime: Date): Promise<void> {
  try {
    const client = await getClient();
    const queuePath = client.queuePath(projectId, location, queueId);

    const url = `${serviceUrl}${endpointPath}`;
    const payload = JSON.stringify(bodyData);

    // Don't specify the name - let GCP generate a unique name
    // We track by reminder_id in the payload instead
    const task = {
      httpRequest: {
        httpMethod: "POST" as const,
        url,
        headers: {
          "Content-Type": "application/json",
        },
        body: Buffer.from(payload).toString("base64"),
      },
      scheduleTime: {
        seconds: Math.floor(scheduleTime.getTime() / 1000),
      },
    };

    const [response] = await client.createTask({ parent: queuePath, task });
    console.log(`Enqueued cloud task: ${response.name} (reminder ${taskId}) scheduled for ${scheduleTime.toISOString()}`);
  } catch (error) {
    console.error(`Error enqueuing cloud task ${taskId}:`, error);
    throw error;
  }
}
