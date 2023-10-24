import { encode } from "https://deno.land/std/encoding/base64.ts";

let {
  MAILGUN_API_KEY,
  MAILGUN_API_URL,
  MAILGUN_DOMAIN,
  FROM_EMAIL_ADDRESS,
  TO_EMAIL_ADDRESS,
} = Deno.env.toObject();

export default async (request, context) => {
  if (
    !MAILGUN_API_KEY ||
    !FROM_EMAIL_ADDRESS ||
    !TO_EMAIL_ADDRESS ||
    !MAILGUN_API_URL
  )
    return Response.json({
      error: "Missing MailGun configuration, please check your .env file.",
    });

  const { email, name, message, topicEmail } = await request.json();

  if (!email || email === "") return Response.json({ error: "Missing email" });
  const authHeader = "Basic " + encode(`api:${MAILGUN_API_KEY}`);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    Authorization: authHeader,
  };

  let payload = new URLSearchParams();

  payload.append("from", FROM_EMAIL_ADDRESS);
  payload.append("to", topicEmail ? topicEmail : TO_EMAIL_ADDRESS);
  payload.append("h:Reply-To", email);
  payload.append("subject", `Contact Form: ${name} ${email}`);
  payload.append("text", message);
  console.log("payload", MAILGUN_DOMAIN, payload, MAILGUN_API_KEY);
  try {
    const resp = await fetch(
      `${MAILGUN_API_URL}/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: headers,
        body: payload,
      },
    );

    /*    let response = await resp.json(); */

    return Response.json({
      statusCode: 200,
      status: resp?.ok ? "ok" : "error",
      body: "Your message was sent successfully! We'll be in touch.",
    });
  } catch (e) {
    console.log("ERROR[]", e);
    return Response.json({
      statusCode: 400,
      status: "error",
      error: "Mailgun  error",
    });
  }
};
