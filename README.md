# NordMiller Complete Setup

Welcome to the **NordMiller Complete Setup** project! This repository contains a full-stack contact form application built with React (frontend) and Node.js backend using Nodemailer for sending emails. The project is designed to be easy to set up and customize, with a clean UI and robust email sending functionality.

---

## Project Overview

NordMiller Complete Setup provides a modern contact form with:

- Frontend built with React and Tailwind CSS for styling.
- Backend API route to send emails using Nodemailer and Gmail SMTP.
- Environment variable configuration for secure email credentials.
- User-friendly UI with loading states and success/error feedback.

---

## Features

- Responsive contact form with fields: Name, Email, and Message.
- Real-time form validation and user feedback.
- Secure email sending via Gmail SMTP using Nodemailer.
- Environment variables to keep sensitive data safe.
- Easy to customize and extend.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Lucide React icons
- **Backend:** Node.js, Nodemailer
- **Email Service:** Gmail SMTP
- **Environment Variables:** `.env` file

---

## Getting Started

### Prerequisites

- npm or yarn
- A Gmail account with "App Password" enabled for SMTP (recommended for security)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/CODEMASTER-ABDULLAH-92/nodemailer_complete_setup.git
   ```
   - EMAIL_USER=your-email@gmail.com
- EMAIL_PASS=your-app-password
-RESEND_API_KEY=your-resend-api-key
```bash
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
```

**3. Frontend Code**
```bash
"use client";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("✅ Email sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ Failed to send email.");
      }
    } catch (error) {
      setStatus("❌ Error sending email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-lg border border-white/40 transition-all hover:shadow-blue-100">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 text-center">
          Get in <span className="text-blue-600">Touch</span>
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Have questions? Drop a message and we’ll get back to you.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {["name", "email"].map((field) => (
            <div key={field} className="relative">
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 text-gray-900 bg-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                required
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">
                {field === "name" ? "Your Name" : "Your Email"}
              </label>
            </div>
          ))}

          <div className="relative">
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder=" "
              rows={4}
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 text-gray-900 bg-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
              required
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">
              Your Message
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Sending...
              </>
            ) : (
              <>
                <Send size={18} /> Send Message
              </>
            )}
          </button>
        </form>

        {/* Status Message */}
        {status && (
          <p
            className={`mt-4 text-center text-sm font-medium transition-all ${
              status.includes("✅")
                ? "text-green-600"
                : status.includes("❌")
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
```

