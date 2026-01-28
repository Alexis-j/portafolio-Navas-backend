import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = async (req, res) => {
  const { name, email, phone, sessionType, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Por favor completa los campos obligatorios" });
  }

  try {
    console.log("📩 Enviando email con Resend:", req.body);

    await resend.emails.send({
      from: "Portafolio Web <onboarding@resend.dev>",
      to: process.env.EMAIL_TO,
      subject: `Nueva consulta — ${sessionType || "General"}`,
      html: `
        <h3>¡Nueva consulta recibida!</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || "-"}</p>
        <p><strong>Tipo de sesión:</strong> ${sessionType || "No especificado"}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("✅ Email enviado correctamente");
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    res.status(500).json({ error: "Error enviando correo" });
  }
};
