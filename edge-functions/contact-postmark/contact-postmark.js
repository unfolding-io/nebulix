let { POSTMARK_SERVER_TOKEN, FROM_EMAIL_ADDRESS, TO_EMAIL_ADDRESS } =
  Deno.env.toObject();

export default async (request, context) => {
  if (!POSTMARK_SERVER_TOKEN || !FROM_EMAIL_ADDRESS || !TO_EMAIL_ADDRESS)
    return Response.json({
      error: "Missing Postmark configuration, please check your .env file.",
    });

  const { email, name, message, topicEmail } = await request.json();

  if (!email || email === "") return Response.json({ error: "Missing email" });

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "X-Postmark-Server-Token": POSTMARK_SERVER_TOKEN,
  };

  const emailObject = {
    From: FROM_EMAIL_ADDRESS,
    To: topicEmail ? topicEmail : TO_EMAIL_ADDRESS,
    Subject: `Contact Form: ${name} ${email}`,
    TextBody: message,
  };
  try {
    const resp = await fetch(`https://api.postmarkapp.com/email`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(emailObject),
    });

    let response = await resp.json();

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
      error: "Postmark error",
    });
  }
};
