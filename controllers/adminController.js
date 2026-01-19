import {
  createAdminDB,
  findAdminByEmail,
  findAdminByResetToken,
  saveResetTokenDB,
  updatePasswordDB,
} from "../models/admin.js";

import bcrypt from "bcrypt";
import { createTransporter } from "../utils/mailer.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await findAdminByEmail(email);
    if (!admin) return res.status(400).json({ error: "Usuario no encontrado" });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// CREAR ADMIN
export const createAdmin = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password)
    return res.status(400).json({ error: "Todos los campos son requeridos" });

  try {
    const exists = await findAdminByEmail(email);
    if (exists) return res.status(400).json({ error: "Email ya registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await createAdminDB(nombre, email, hashed);

    res.json({ message: "Admin creado ✅", admin });
  } catch (err) {
    console.error("Error en createAdmin:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// SOLICITAR RESET DE CONTRASEÑA
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await findAdminByEmail(email);
    if (!admin) return res.status(404).json({ error: "Admin no encontrado" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await saveResetTokenDB(admin.id, token, expiration);

    const resetUrl = `http://localhost:3000/admin/reset-password/${token}`;

    const transporter = createTransporter(); 

    await transporter.sendMail({
      from: `"Portafolio Fotógrafo" <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: "Recuperación de contraseña",
      html: `
        <p>Hola ${admin.nombre},</p>
        <p>Para cambiar tu contraseña, haz click en el siguiente enlace:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    res.json({ message: "Correo de recuperación enviado ✅" });
  } catch (err) {
    console.error("Error en requestPasswordReset:", err);
    res.status(500).json({ error: "Error al enviar correo" });
  }
};

// RESET DE CONTRASEÑA
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const admin = await findAdminByResetToken(token);
    if (!admin) return res.status(400).json({ error: "Token inválido o expirado" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await updatePasswordDB(admin.id, hashed);

    res.json({ message: "Contraseña actualizada correctamente ✅" });
  } catch (err) {
    console.error("Error en resetPassword:", err);
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
};
