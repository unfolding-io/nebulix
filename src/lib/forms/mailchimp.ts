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

  if (/^X+$/i.test(apiKey.replace(/-.+$/, "")) || listId.includes("XXXX")) {
    throw new Error(
      "Mailchimp is still using placeholder credentials. Set MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID in .env (and on your host).",
    );
  }

  // Mailchimp expects HTTP Basic: any username + API key as password.
  const auth = btoa(`anystring:${apiKey}`);

  const response = await fetch(
    `https://${prefix}.api.mailchimp.com/3.0/lists/${listId}/members/`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
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
