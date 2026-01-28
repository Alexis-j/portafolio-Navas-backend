import { Resend } from "resend";
import { sendEmail } from "../utils/mailer.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = async (req, res) => {
  const { name, email, phone, sessionType, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Por favor completa los campos obligatorios" });
  }

  try {

    await sendEmail({
      from: `Portafolio Web <${process.env.RESEND_FROM}>`, // Tu dominio verificado
      to: process.env.EMAIL_TO,
      reply_to: email, // Para que el reply vaya al usuario
      subject: `Nueva consulta — ${sessionType || "General"}`,
      html: `
        <h3>¡Nueva consulta recibida!</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || "-"}</p>
        <p><strong>Tipo de sesión:</strong> ${sessionType || "No especificado"}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
        <hr />
        <p>Enviado desde el formulario de contacto de navasphotography.com</p>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    res.status(500).json({ error: "Error enviando correo" });
  }
};
