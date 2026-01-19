import {
  deleteHero,
  getHero,
  postHero,
  toggleHeroText,
  updateHero,
} from "../controllers/heroController.js";
import { resizeImages, uploadMemory } from "../utils/upload.js";

import express from "express";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Configuración de campos y tamaños
const fieldsConfig = [
  { name: "logo_light", width: 400, height: 400, fit: "inside" },
  { name: "logo_dark", width: 400, height: 400, fit: "inside" },

  { name: "image_light", width: 1920, height: 1080, fit: "cover" },
  { name: "image_dark", width: 1920, height: 1080, fit: "cover" },

  // 👇 NUEVO – mobile vertical
  { name: "image_mobile_light", width: 1080, height: 1920, fit: "cover" },
  { name: "image_mobile_dark", width: 1080, height: 1920, fit: "cover" },
];


const uploadFields = uploadMemory.fields(
  fieldsConfig.map((f) => ({ name: f.name, maxCount: 1 }))
);

// Routes
router.get("/", getHero);
router.post("/", verifyToken, uploadFields, resizeImages(fieldsConfig), postHero);
router.put("/:id", verifyToken, uploadFields, resizeImages(fieldsConfig), updateHero);
router.delete("/:id", verifyToken, deleteHero);
router.patch("/:id/toggle-text", verifyToken, toggleHeroText);

export default router;
