let {
  MAILGUN_API_KEY,
  MAILGUN_API_URL,
  MAILGUN_DOMAIN,
  TO_EMAIL_ADDRESS,
  FROM_EMAIL_ADDRESS,
} = Deno.env.toObject();

export default async (request, context) => {
  if (
      !MAILGUN_API_KEY ||
      !TO_EMAIL_ADDRESS ||
      !MAILGUN_DOMAIN ||
      !MAILGUN_API_URL ||
      !FROM_EMAIL_ADDRESS
  )
    return Response.json({
      error: "Missing MailGun configuration, please check your .env file.",
    });

  const {email, name, message, subject, topicEmail} = await request.json();

  if (!email || email === "") return Response.json({error: "Missing email"});

  const formData = new URLSearchParams();
  formData.append('from', FROM_EMAIL_ADDRESS);
  formData.append('to', TO_EMAIL_ADDRESS);
  formData.append('subject', subject);
  formData.append('text', `name: ${name}\n\nmessage: ${message}`);
  formData.append('html', `<p>name ${name}</p><p>message: ${message}</p>`);

  const url = `${MAILGUN_API_URL}/${MAILGUN_DOMAIN}/messages`;

  const headers = new Headers();
  headers.append('Authorization', 'Basic ' + btoa('api:' + MAILGUN_API_KEY));
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    })

    const data = await response.json();

    if (!response.ok) {
      console.log(JSON.stringify(response)) // logs error response data
      return Response.json({
        statusCode: 400,
        status: "error",
        error: JSON.stringify(response),
      });
    }

    return Response.json({
      statusCode: 200,
      status: "ok",
      data: "Send mail success",
    });
  } catch (e) {
    console.log("ERROR[]", e);
    return Response.json({
      error: " error",
    });
  }
};
