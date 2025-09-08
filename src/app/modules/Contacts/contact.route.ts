import  nodemailer  from 'nodemailer';
import { Router, Request, Response } from "express";

import { envVars } from "../../config/env";


export const ContactRoutes = Router();

ContactRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: envVars.EMAIL_SENDER.SMTP_HOST,
      port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
      secure: Number(envVars.EMAIL_SENDER.SMTP_PORT) === 465,
      auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: envVars.SUPER_ADMIN_EMAIL, // Your admin email
      subject: `Contact Form Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    res.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});
