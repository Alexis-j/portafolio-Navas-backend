import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("📩 Contact form:", req.body);

    await resend.emails.send({
      from: "contact@andreynavasphotography.com <onboarding@resend.dev>", // funciona sin dominio
      to: process.env.EMAIL_TO,
      subject: `Nuevo mensaje de ${name}`,
      html: `
        <h3>Nuevo mensaje</h3>
        <p><b>Nombre:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p>${message}</p>
      `,
    });

    console.log("✅ Email enviado");
    res.json({ ok: true });
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    res.status(500).json({ error: "No se pudo enviar el email" });
  }
};
