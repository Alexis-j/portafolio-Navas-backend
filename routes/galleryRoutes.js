import { GalleryController } from "../controllers/galleryController.js";
import express from "express";
import { uploadDisk } from "../utils/upload.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/* ===== PÚBLICO ===== */

// GET /api/gallery/categories
router.get("/categories", GalleryController.getCategories);

// GET /api/gallery/categories/:slug/photos
router.get(
  "/categories/:slug/photos",
  GalleryController.getPhotosByCategorySlug
);

/* ===== ADMIN ===== */

// GET fotos de una categoría
router.get(
  "/categories/:id/photos",
  verifyToken,
  GalleryController.getCategoryPhotosAdmin
);

// Elegir portada
router.patch(
  "/categories/:id/cover",
  verifyToken,
  GalleryController.setCategoryCover
);

// Subir foto
router.post(
  "/photos",
  verifyToken,
  uploadDisk.single("image"),
  GalleryController.uploadPhoto
);

// Asignar foto a categoría
router.post(
  "/categories/:categoryId/photos",
  verifyToken,
  GalleryController.assignPhotoToCategory
);

// Eliminar foto
router.delete(
  "/photos/:id",
  verifyToken,
  GalleryController.deletePhoto
);
// Desasignar foto de categoría
router.delete(
  "/categories/:categoryId/photos/:photoId",
  verifyToken,
  GalleryController.removePhotoFromCategory
);
// Dashboard
router.get(
  "/dashboard/photos",
  verifyToken,
  GalleryController.getAllPhotosForDashboard
);

// Toggle active
router.patch(
  "/photos/:id/toggle",
  verifyToken,
  GalleryController.togglePhotoActive
);

// Ordenar fotos de una categoría
router.patch(
  "/categories/:categoryId/photos/order",
  GalleryController.updatePhotoOrder
);

router.get(
  "/categories/:id/editor",
  verifyToken,
  GalleryController.getCategoryEditor
);

export default router;
