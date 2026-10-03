import { requireEnv } from "./env";

export type ContactProvider = "mailgun" | "postmark" | "slack";

export interface ContactInput {
  provider: ContactProvider;
  email: string;
  name: string;
  phone?: string;
  message: string;
  topic: string;
  topicEmail?: string;
  topicChannel?: string;
}

export interface ContactResult {
  ok: true;
  message: string;
}

function buildBody(input: ContactInput): string {
  return [
    `Topic: ${input.topic}`,
    `Name: ${input.name}`,
    `Phone: ${input.phone || "—"}`,
    `Email: ${input.email}`,
    "",
    "Message:",
    input.message,
  ].join("\n");
}

async function sendMailgun(input: ContactInput): Promise<ContactResult> {
  const apiKey = requireEnv("MAILGUN_API_KEY");
  const domain = requireEnv("MAILGUN_DOMAIN");
  const apiUrl = requireEnv("MAILGUN_API_URL").replace(/\/$/, "");
  const from = requireEnv("FROM_EMAIL_ADDRESS");
  const toDefault = requireEnv("TO_EMAIL_ADDRESS");
  const to = input.topicEmail || toDefault;

  const auth = btoa(`api:${apiKey}`);
  const payload = new URLSearchParams({
    from,
    to,
    "h:Reply-To": input.email,
    subject: `Contact Form: ${input.name} ${input.email}`,
    text: buildBody(input),
  });

  const response = await fetch(`${apiUrl}/v3/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Mailgun error (${response.status}): ${detail}`);
  }

  return {
    ok: true,
    message: "Your message was sent successfully! We'll be in touch.",
  };
}

async function sendPostmark(input: ContactInput): Promise<ContactResult> {
  const token = requireEnv("POSTMARK_SERVER_TOKEN");
  const from = requireEnv("FROM_EMAIL_ADDRESS");
  const toDefault = requireEnv("TO_EMAIL_ADDRESS");
  const to = input.topicEmail || toDefault;

  const response = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": token,
    },
    body: JSON.stringify({
      From: from,
      To: to,
      ReplyTo: input.email,
      Subject: `Contact Form: ${input.name} ${input.email}`,
      TextBody: buildBody(input),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Postmark error (${response.status}): ${detail}`);
  }

  return {
    ok: true,
    message: "Your message was sent successfully! We'll be in touch.",
  };
}

async function sendSlack(input: ContactInput): Promise<ContactResult> {
  const token = requireEnv("SLACK_TOKEN");
  const channel = input.topicChannel || requireEnv("SLACK_CHANNEL_ID");

  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel,
      text: `*Contact form*\n${buildBody(input)}`,
      icon_emoji: ":envelope:",
    }),
  });

  const data = (await response.json()) as { ok?: boolean; error?: string };
  if (!response.ok || !data.ok) {
    throw new Error(`Slack error: ${data.error || response.statusText}`);
  }

  return {
    ok: true,
    message: "Your message was sent successfully! We'll be in touch.",
  };
}

export async function sendContact(
  input: ContactInput,
): Promise<ContactResult> {
  switch (input.provider) {
    case "mailgun":
      return sendMailgun(input);
    case "postmark":
      return sendPostmark(input);
    case "slack":
      return sendSlack(input);
    default: {
      const _exhaustive: never = input.provider;
      throw new Error(`Unsupported contact provider: ${_exhaustive}`);
    }
  }
}
