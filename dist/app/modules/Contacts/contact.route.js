"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRoutes = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_1 = require("express");
const env_1 = require("../../config/env");
exports.ContactRoutes = (0, express_1.Router)();
exports.ContactRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }
        // Create transporter
        const transporter = nodemailer_1.default.createTransport({
            host: env_1.envVars.EMAIL_SENDER.SMTP_HOST,
            port: Number(env_1.envVars.EMAIL_SENDER.SMTP_PORT),
            secure: Number(env_1.envVars.EMAIL_SENDER.SMTP_PORT) === 465,
            auth: {
                user: env_1.envVars.EMAIL_SENDER.SMTP_USER,
                pass: env_1.envVars.EMAIL_SENDER.SMTP_PASS,
            },
        });
        // Send email
        yield transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: env_1.envVars.SUPER_ADMIN_EMAIL, // Your admin email
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
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
}));
