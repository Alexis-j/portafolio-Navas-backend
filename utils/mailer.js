// utils/mailer.js
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.EMAIL_TO,  // debe ser tu email registrado
      subject: "Prueba de email ✅",
      html: "<p>Hola, esto funciona localmente 😎</p>",
    });
    console.log("✅ Email enviado:", result);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

testEmail();
