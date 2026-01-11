interface TaskData {
  reminder_id: number;
  message: string;
  phone_number?: string;
}

const projectId = process.env.GCP_PROJECT_ID || "";
const location = process.env.GCP_LOCATION || "asia-southeast1";
const serviceUrl = process.env.GCP_SERVICE_URL || "";

/**
 * Get GCP credentials from environment variables
 * Supports Vercel GCP integration (separate env vars) and fallback to JSON key
 * @returns Configuration object with credentials and projectId, or empty object for local development
 */
export const getGCPCredentials = () => {
  // For Vercel, use environment variables from GCP integration
  if (process.env.GCP_PRIVATE_KEY) {
    return {
      credentials: {
        client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replace escaped newlines
      },
      projectId: process.env.GCP_PROJECT_ID,
    };
  }

  // Fallback: Try parsing full JSON service account key (for manual setup)
  const serviceAccountKey = process.env.GCP_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const credentials = JSON.parse(serviceAccountKey);
      return {
        credentials,
        projectId: credentials.project_id || process.env.GCP_PROJECT_ID,
      };
    } catch (error) {
      console.error("Failed to parse GCP_SERVICE_ACCOUNT_KEY:", error);
      // If parsing fails, try base64 decoding
      try {
        const decoded = Buffer.from(serviceAccountKey, "base64").toString("utf-8");
        const credentials = JSON.parse(decoded);
        return {
          credentials,
          projectId: credentials.project_id || process.env.GCP_PROJECT_ID,
        };
      } catch (decodeError) {
        console.error("Failed to decode GCP_SERVICE_ACCOUNT_KEY:", decodeError);
        throw new Error("Invalid GCP_SERVICE_ACCOUNT_KEY format. Expected JSON string or base64-encoded JSON.");
      }
    }
  }

  // For local development, use gcloud CLI (returns empty object)
  return {};
};

// Lazy load CloudTasksClient to avoid bundling issues in serverless
let clientPromise: Promise<import("@google-cloud/tasks").CloudTasksClient> | null = null;

async function getClient(): Promise<import("@google-cloud/tasks").CloudTasksClient> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const { CloudTasksClient } = await import("@google-cloud/tasks");

      // Get credentials using the helper function
      const credentialsConfig = getGCPCredentials();

      // Define type for clientConfig
      type ClientConfig = {
        projectId?: string;
        credentials?:
          | {
              client_email?: string;
              private_key?: string;
            }
          | object;
      };

      const clientConfig: ClientConfig = {
        projectId: credentialsConfig.projectId || projectId || undefined,
        ...(Object.keys(credentialsConfig.credentials || {}).length > 0 && {
          credentials: credentialsConfig.credentials,
        }),
      };

      return new CloudTasksClient(clientConfig);
    })();
  }
  return clientPromise;
}

/**
 * Delete cloud task by reminder ID
 * Since task name is the reminder ID, we can directly delete it
 * @param queueId - The queue ID (e.g., "reminder-queue")
 * @param reminderId - The reminder ID (also the task ID)
 */
export async function deleteCloudTask(queueId: string, reminderId: number): Promise<void> {
  try {
    const client = await getClient();
    const taskName = client.taskPath(projectId, location, queueId, reminderId.toString());

    console.log(`Deleting cloud task for reminder ${reminderId}`);
    await client.deleteTask({ name: taskName });
    console.log(`Deleted cloud task: ${taskName}`);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === 5) {
      // NOT_FOUND - task already deleted or never existed
      console.log(`Task for reminder ${reminderId} not found, skipping`);
    } else {
      console.error(`Error deleting cloud task for reminder ${reminderId}:`, error);
      throw error;
    }
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

    // Use reminder ID as the task name for easier tracking and deletion
    const taskName = client.taskPath(projectId, location, queueId, taskId);
    const task = {
      name: taskName,
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
