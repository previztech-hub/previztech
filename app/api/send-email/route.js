import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, phone, email, message } = data;

    // Load SMTP credentials from environment variables for security.
    // DO NOT commit real credentials into source control.
    const user = process.env.SMTP_USER;
    const pass = "yice waix nqdf feli";

    if (!user || !pass) {
      return new Response(
        JSON.stringify({
          error:
            'SMTP credentials are not set. Please set SMTP_USER and SMTP_PASS as environment variables (or .env.local)'
        }),
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const recipients = [
        "anandanathurelangovan94@gmail.com","vigneshwaran151@gmail.com"
    //   'previz2013@gmail.com',
    //   'previzprivatelimited2022@gmail.com',
    //   'previzsysadm@gmail.com'
    ];

    const mailOptions = {
      from: `Previz Website <${user}>`,
      to: recipients.join(", "),
      subject: `New enquiry from ${name || "website visitor"}`,
      html: `
        <p><strong>Name:</strong> ${name || ""}</p>
        <p><strong>Phone:</strong> ${phone || ""}</p>
        <p><strong>Email:</strong> ${email || ""}</p>
        <p><strong>Message:</strong><br/>${(message || "").replace(
          /\n/g,
          "<br/>"
        )}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("send-email error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
