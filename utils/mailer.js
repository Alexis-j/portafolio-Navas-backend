// utils/mailer.js
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RESEND_API_KEY) {
  throw new Error("❌ RESEND_API_KEY no definido en .env");
}

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendEmail - envia un email usando Resend
 * @param {Object} options
 * @param {string} options.from - Email de origen (debe estar verificado en Resend)
 * @param {string} options.to - Email destino
 * @param {string} options.subject - Asunto
 * @param {string} options.html - Contenido HTML
 */
export const sendEmail = async ({ from, to, subject, html }) => {
  try {
    const result = await resend.emails.send({
      from: from || process.env.RESEND_FROM,
      to,
      subject,
      html,
    });
    console.log("✅ Email enviado:", result);
    return result;
  } catch (err) {
    console.error("❌ Error enviando email:", err);
    throw err;
  }
};

// Función de prueba rápida (puedes ejecutar node utils/mailer.js)
if (process.argv[2] === "test") {
  (async () => {
    try {
      await sendEmail({
        from: process.env.RESEND_FROM,
        to: process.env.EMAIL_TO,
        subject: "Prueba de Resend",
        html: "<p>Hola, esto es una prueba ✅</p>",
      });
      console.log("✅ Test email enviado correctamente");
    } catch (err) {
      console.error("❌ Test email falló:", err.message);
    }
  })();
}
