// import { Resend } from "resend";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { name, email, message } = body;

//     const resend = new Resend(process.env.RESEND_API_KEY);
//     const userMail = await resend.emails.send({
//       from: "Muhammad Abdullah <onboarding@resend.dev>", // must be verified sender
//       to: email, // the user's email from the form
//       subject: "✅ We received your message",
//       text: `Hi ${name},\n\nThank you for contacting us. We received your message:\n\n"${message}"\n\nWe will get back to you soon.\n\n- Muhammad Abdullah`,
//     });

//     return new Response(
//       JSON.stringify({
//         success: true,
//         userMail,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return new Response(
//       JSON.stringify({ success: false, error }),
//       { status: 500 }
//     );
//   }
// }





import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });



console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

    // Verify SMTP connection first
    // await transporter.verify();
    await transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP Verify Failed:", err);
  } else {
    console.log("SMTP Server Ready:", success);
  }
});
    const info = await transporter.sendMail({
      from: `"Muhammad Abdullah" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ We received your message",
      text: `Hi ${name},\n\nThank you for contacting us. We received your message:\n\n"${message}"\n\nWe will get back to you soon.\n\n- Muhammad Abdullah`,
    });

    return new Response(JSON.stringify({ success: true, info }), { status: 200 });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
