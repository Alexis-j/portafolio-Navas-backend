import { createAbout, getAbout, updateAbout } from "../controllers/aboutController.js";

import express from "express";
import { uploadDisk } from "../utils/upload.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// GET /api/about
router.get("/", getAbout);

// POST /api/about
router.post(
  "/",
  verifyToken,
  uploadDisk.fields([
    { name: "imagen_light", maxCount: 1 },
    { name: "imagen_dark", maxCount: 1 },
  ]),
  createAbout
);

// PUT /api/about
router.put(
  "/",
  verifyToken,
  uploadDisk.fields([
    { name: "imagen_light", maxCount: 1 },
    { name: "imagen_dark", maxCount: 1 },
  ]),
  updateAbout
);

export default router;
