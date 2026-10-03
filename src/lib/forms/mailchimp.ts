import { requireEnv } from "./env";

export type SubscribeStatus = "pending" | "exists" | "subscribed";

export interface SubscribeResult {
  status: SubscribeStatus;
  email: string;
}

export async function subscribeMailchimp(email: string): Promise<SubscribeResult> {
  const apiKey = requireEnv("MAILCHIMP_API_KEY");
  const prefix = requireEnv("MAILCHIMP_SERVER_PREFIX");
  const listId = requireEnv("MAILCHIMP_LIST_ID");

  const response = await fetch(
    `https://${prefix}.api.mailchimp.com/3.0/lists/${listId}/members/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "pending",
      }),
    },
  );

  const data = (await response.json()) as {
    title?: string;
    status?: string | number;
    email_address?: string;
    detail?: string;
  };

  if (data.title === "Member Exists") {
    return { status: "exists", email };
  }

  if (!response.ok) {
    throw new Error(
      `Mailchimp error (${response.status}): ${data.detail || data.title || "unknown"}`,
    );
  }

  const status =
    data.status === "subscribed"
      ? "subscribed"
      : data.status === "pending"
        ? "pending"
        : "pending";

  return {
    status,
    email: data.email_address || email,
  };
}
