import { GalleryModel } from "../models/galleryModel.js";
import { deleteFile } from "../utils/deleteFiles.js";

/* =========================
  CONTROLLER
========================= */

export const GalleryController = {

  /* ===== PÚBLICO ===== */

    getCategories: async (req, res) => {
    try {
      const categories = await GalleryModel.getCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: "Error fetching categories" });
    }
  },

  getPhotosByCategorySlug: async (req, res) => {
    try {
      const photos = await GalleryModel.getPhotosByCategorySlug(req.params.slug);
      res.json(photos);
    } catch (err) {
      res.status(500).json({ error: "Error fetching photos" });
    }
  },

  /* ===== ADMIN ===== */

  getCategoryPhotosAdmin: async (req, res) => {
    try {
      const data = await GalleryModel.getCategoryWithPhotos(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Error fetching category photos" });
    }
  },

  setCategoryCover: async (req, res) => {
    try {
      const { photoId } = req.body;
      if (!photoId) {
        return res.status(400).json({ error: "photoId required" });
      }

      const category = await GalleryModel.setCategoryCover(
        req.params.id,
        photoId
      );

      res.json(category);
    } catch (err) {
      res.status(500).json({ error: "Error setting cover" });
    }
  },

  uploadPhoto: async (req, res) => {
  try {
    const { categoryIds } = req.body; // <-- traer categorías del form
    if (!req.file) {
      return res.status(400).json({ error: "Image required" });
    }

    // Crear foto
    const photo = await GalleryModel.createPhoto(`/uploads/${req.file.filename}`);

    // Asignar categorías si hay
    if (categoryIds) {
      const categories = JSON.parse(categoryIds);
      for (const categoryId of categories) {
        await GalleryModel.assignPhotoToCategory(photo.id, categoryId);
      }
    }

    res.status(201).json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading photo" });
  }
},

  assignPhotoToCategory: async (req, res) => {
    try {
      const { photoId } = req.body;
      const { categoryId } = req.params;

      const relation = await GalleryModel.assignPhotoToCategory(
        photoId,
        categoryId
      );

      res.status(201).json(relation);
    } catch (err) {
      res.status(500).json({ error: "Error assigning photo" });
    }
  },

  deletePhoto: async (req, res) => {
    try {
      const photo = await GalleryModel.getPhotoById(req.params.id);
      if (!photo) return res.status(404).json({ error: "Not found" });

      await GalleryModel.deletePhoto(req.params.id);

      deleteFile(photo.image_url);
      res.json({ message: "Photo deleted" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting photo" });
    }
  },
  removePhotoFromCategory: async (req, res) => {
  try {
    const { photoId, categoryId } = req.params;

    const removed = await GalleryModel.removePhotoFromCategory(photoId, categoryId);
    if (!removed) return res.status(404).json({ error: "Relation not found" });

    res.json({ message: "Photo removed from category" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error removing photo from category" });
  }
},


  getAllPhotosForDashboard: async (req, res) => {
    try {
      const photos = await GalleryModel.getAllPhotosForDashboard();
      res.json(photos);
    } catch (err) {
      res.status(500).json({ error: "Error fetching photos" });
    }
  },

  togglePhotoActive: async (req, res) => {
    try {
      const photo = await GalleryModel.togglePhotoActive(req.params.id);
      res.json(photo);
    } catch (err) {
      res.status(500).json({ error: "Error toggling photo" });
    }
  },
  getCategoryEditor: async (req, res) => {
  try {
    const data = await GalleryModel.getCategoryEditorData(req.params.id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error loading category editor" });
  }
},
  updatePhotoOrder: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { orders } = req.body;

      if (!orders || !Array.isArray(orders)) {
        return res.status(400).json({ error: "Invalid orders" });
      }

      for (const item of orders) {
        await GalleryModel.updatePhotoOrder(
          categoryId,
          item.photoId,
          item.display_order
        );
      }

      res.json({ success: true });
    } catch (err) {
      console.error("❌ Error updating photo order:", err);
      res.status(500).json({ error: "Error updating photo order" });
    }
  }


};
