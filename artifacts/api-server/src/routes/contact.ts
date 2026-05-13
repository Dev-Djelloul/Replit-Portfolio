import { Router } from "express";
import nodemailer from "nodemailer";
import { z } from "zod";

const router = Router();

const ContactSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Adresse email invalide"),
  subject: z.string().optional().nullable(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL_USER ou GMAIL_APP_PASSWORD non configuré");
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

// POST /api/contact
router.post("/contact", async (req, res) => {
  const log = req.log;

  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
    return;
  }

  const { name, email, subject, message } = parsed.data;
  const subjectLine = subject || `Nouveau message de ${name} via le portfolio`;

  try {
    const transporter = getTransporter();
    const from = process.env.GMAIL_USER as string;

    await transporter.sendMail({
      from: `"Portfolio Djelloul" <${from}>`,
      to: "digitalblueskye@gmail.com",
      replyTo: `${name} <${email}>`,
      subject: subjectLine,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:24px;background:#0d1117;color:#e6edf3;border-radius:8px;">
          <h2 style="color:#00b5a0;margin-bottom:8px;">Nouveau message — Portfolio Djelloul</h2>
          <hr style="border-color:#30363d;margin-bottom:24px;"/>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="color:#8b949e;padding:8px 0;width:80px;">De</td><td>${name}</td></tr>
            <tr><td style="color:#8b949e;padding:8px 0;">Email</td><td><a href="mailto:${email}" style="color:#00b5a0;">${email}</a></td></tr>
            ${subject ? `<tr><td style="color:#8b949e;padding:8px 0;">Objet</td><td>${subject}</td></tr>` : ""}
          </table>
          <hr style="border-color:#30363d;margin:24px 0;"/>
          <p style="color:#8b949e;margin-bottom:8px;">Message :</p>
          <p style="color:#e6edf3;line-height:1.8;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        </div>
      `,
      text: `De : ${name} <${email}>\n\n${message}`,
    });

    log.info({ from: email, name }, "Contact message sent");
    res.json({ success: true, message: "Votre message a bien été envoyé !" });
  } catch (err) {
    log.error({ err }, "Failed to send contact email");
    res.status(500).json({ error: "Impossible d'envoyer le message. Veuillez réessayer." });
  }
});

export default router;
