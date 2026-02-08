import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const {
      name,
      email,
      request_type,
      message,
      captcha_answer,
      captcha_correct,
    } = await request.json();

    // Simple captcha verification
    if (parseInt(captcha_answer) !== parseInt(captcha_correct)) {
      return Response.json({ error: "Invalid captcha" }, { status: 400 });
    }

    if (!name || !email || !request_type || !message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await sql`
      INSERT INTO contact_requests (name, email, request_type, message)
      VALUES (${name}, ${email}, ${request_type}, ${message})
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error creating contact request:", error);
    return Response.json(
      { error: "Failed to submit request" },
      { status: 500 },
    );
  }
}
