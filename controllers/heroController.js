import {
  createHeroDB,
  deleteHeroDB,
  getAllHeroDB,
  getHeroByIdDB,
  toggleHeroTextDB,
  updateHeroDB,
} from "../models/hero.js";

import cloudinary from "../utils/cloudinary.js";

/* ================= GET ================= */
export const getHero = async (req, res) => {
  try {
    const heroes = await getAllHeroDB();
    res.json(heroes);
  } catch (err) {
    console.error("Error in getHero:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= POST ================= */
export const postHero = async (req, res) => {
  try {
    console.log("POST /hero req.body:", req.body);
    console.log("POST /hero req.files:", req.files);

    const uploadFile = async (file, folder = "hero_images") => {
      if (!file) return null;
      const result = await cloudinary.uploader.upload(file.path, { folder });
      return result.secure_url;
    };

    const image_light = await uploadFile(req.files?.image_light?.[0]);
    const image_dark = await uploadFile(req.files?.image_dark?.[0]);
    const image_mobile_light = await uploadFile(req.files?.image_mobile_light?.[0]);
    const image_mobile_dark = await uploadFile(req.files?.image_mobile_dark?.[0]);
    const logo_light = await uploadFile(req.files?.logo_light?.[0]);
    const logo_dark = await uploadFile(req.files?.logo_dark?.[0]);

    const show_text =
      req.body?.show_text === "true" || req.body?.show_text === true;

    const hero = await createHeroDB(
      req.body.title,
      req.body.subtitle,
      image_light,
      image_dark,
      image_mobile_light,
      image_mobile_dark,
      logo_light,
      logo_dark,
      show_text
    );

    console.log("Hero creado:", hero);
    res.json(hero);
  } catch (err) {
    console.error("Error in postHero:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= PUT ================= */
export const updateHero = async (req, res) => {
  const { id } = req.params;
  try {

    const existing = await getHeroByIdDB(id);
    if (!existing) return res.status(404).json({ error: "Hero not found" });


    const uploadAndReplace = async (field) => {
  if (!req.files?.[field]?.[0]) return existing[field]; // nada que subir

  // Borrar imagen previa si existe
  if (existing[field]) {
    try {
      const publicId = existing[field].split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`hero_images/${publicId}`);
    } catch (err) {
      console.warn(`No se pudo borrar ${field} de Cloudinary:`, err.message);
    }
  }

  // Subir nueva imagen desde buffer
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "hero_images" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(req.files[field][0].buffer);
  });
};


    const image_light = await uploadAndReplace("image_light");
    const image_dark = await uploadAndReplace("image_dark");
    const image_mobile_light = await uploadAndReplace("image_mobile_light");
    const image_mobile_dark = await uploadAndReplace("image_mobile_dark");
    const logo_light = await uploadAndReplace("logo_light");
    const logo_dark = await uploadAndReplace("logo_dark");

    const title = req.body?.title ?? existing.title;
    const subtitle = req.body?.subtitle ?? existing.subtitle;
    const show_text =
      req.body?.show_text !== undefined
        ? req.body.show_text === "true" || req.body.show_text === true
        : existing.show_text;

    const updated = await updateHeroDB(
      id,
      title,
      subtitle,
      image_light,
      image_dark,
      image_mobile_light,
      image_mobile_dark,
      logo_light,
      logo_dark,
      show_text
    );

    console.log("Hero actualizado:", updated);
    res.json(updated);
  } catch (err) {
    console.error("Error in updateHero:", err);
    res.status(500).json({ error: "Error updating hero" });
  }
};

/* ================= DELETE ================= */
export const deleteHero = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("DELETE /hero/:id req.params:", req.params);

    const existing = await getHeroByIdDB(id);
    if (!existing) return res.status(404).json({ error: "Hero not found" });

    const deleteFromCloud = async (field) => {
      if (!existing[field]) return;
      try {
        const publicId = existing[field].split("/").pop().split(".")[0];
        console.log(`Borrando ${field} en Cloudinary: hero_images/${publicId}`);
        await cloudinary.uploader.destroy(`hero_images/${publicId}`);
      } catch (err) {
        console.warn(`No se pudo borrar ${field} de Cloudinary:`, err.message);
      }
    };

    await Promise.all([
      "image_light",
      "image_dark",
      "image_mobile_light",
      "image_mobile_dark",
      "logo_light",
      "logo_dark",
    ].map(deleteFromCloud));

    await deleteHeroDB(id);
    console.log("Hero eliminado:", id);
    res.json({ message: "Hero deleted successfully ✅" });
  } catch (err) {
    console.error("Error in deleteHero:", err);
    res.status(500).json({ error: "Server error" });
  }
};

console.log("Cloudinary cloud_name:", process.env.CLOUDINARY_CLOUD_NAME);

/* ================= PATCH ================= */
export const toggleHeroText = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await toggleHeroTextDB(id);
    console.log("toggleHeroText:", updated);
    res.json(updated);
  } catch (err) {
    console.error("Error in toggleHeroText:", err);
    res.status(500).json({ error: "Server error" });
  }
};
