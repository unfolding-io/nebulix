const { MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, MAILCHIMP_LIST_ID } =
  Deno.env.toObject();

export default async (request, context) => {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID)
    return Response.json({
      error: "Missing MailChimp configuration, please check your .env file.",
    });

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
  };

  const { email } = await request.json();
  if (!email || email === "") return Response.json({ error: "Missing email" });

  const data = JSON.stringify({
    email_address: email,
    status: "pending",
  });

  try {
    const resp = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/`,
      {
        method: "POST",
        headers: headers,
        body: data,
      },
    );
    let response = await resp.json();

    return Response.json({
      statusCode: 200,
      status: response?.title ? response?.title : response?.status,
      email: response?.email_address,
    });
  } catch (e) {
    console.log("ERROR[]", e);
    return Response.json({
      error: "Mailchimp error",
    });
  }
};
