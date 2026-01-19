import { createReview, deleteReview, getReviews, updateReview } from "../controllers/reviewsController.js";

import express from "express";
import { uploadDisk } from "../utils/upload.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Public
router.get("/", getReviews);

// Admin
router.post("/", verifyToken, uploadDisk.single("client_photo"), createReview);
router.put("/:id", verifyToken, uploadDisk.single("client_photo"), updateReview);
router.delete("/:id", verifyToken, deleteReview);

export default router;
