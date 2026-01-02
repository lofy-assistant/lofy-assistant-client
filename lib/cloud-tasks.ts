interface TaskData {
  reminder_id: number;
  message: string;
  phone_number?: string;
}

const projectId = process.env.GCP_PROJECT_ID || "";
const location = process.env.GCP_LOCATION || "us-central1";
const serviceUrl = process.env.GCP_SERVICE_URL || "";

// Lazy load CloudTasksClient to avoid bundling issues in serverless
let clientPromise: any = null;

async function getClient() {
  if (!clientPromise) {
    clientPromise = (async () => {
      const { CloudTasksClient } = await import("@google-cloud/tasks");
      return new CloudTasksClient();
    })();
  }
  return clientPromise;
}

/**
 * Delete a cloud task by task ID
 * @param queueId - The queue ID (e.g., "reminder-queue")
 * @param taskId - The unique task ID
 */
export async function deleteCloudTask(
  queueId: string,
  taskId: string
): Promise<void> {
  try {
    const client = await getClient();
    const queuePath = client.queuePath(projectId, location, queueId);
    const taskName = `${queuePath}/tasks/${taskId}`;

    await client.deleteTask({ name: taskName });
    console.log(`Deleted cloud task: ${taskId}`);
  } catch (error: any) {
    // If task doesn't exist (404), ignore the error
    if (error.code === 5) {
      // NOT_FOUND
      console.log(`Task ${taskId} not found, skipping deletion`);
      return;
    }
    console.error(`Error deleting cloud task ${taskId}:`, error);
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
export async function enqueueCloudTask(
  endpointPath: string,
  queueId: string,
  taskId: string,
  bodyData: TaskData,
  scheduleTime: Date
): Promise<void> {
  try {
    const client = await getClient();
    const queuePath = client.queuePath(projectId, location, queueId);

    const url = `${serviceUrl}${endpointPath}`;
    const payload = JSON.stringify(bodyData);

    const task: any = {
      name: `${queuePath}/tasks/${taskId}`,
      httpRequest: {
        httpMethod: "POST",
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

    await client.createTask({ parent: queuePath, task });
    console.log(`Enqueued cloud task: ${taskId} scheduled for ${scheduleTime.toISOString()}`);
  } catch (error) {
    console.error(`Error enqueuing cloud task ${taskId}:`, error);
    throw error;
  }
}
