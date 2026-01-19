import { createAdmin, login, requestPasswordReset, resetPassword, } from "../controllers/adminController.js";

import express from "express";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// POST /admin/login
router.post("/login", login);
// ✅ NUEVA RUTA: Crear Admin
router.post("/create", verifyToken, createAdmin);
// POST /api/admin/request-reset -> genera token y envía correo
router.post("/request-reset", requestPasswordReset);
// POST /api/admin/reset-password -> actualiza contraseña usando token
router.post("/reset-password", resetPassword);

// Validar token
router.get("/validate", verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});


export default router;
