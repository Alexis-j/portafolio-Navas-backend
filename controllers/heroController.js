import {
  createHeroDB,
  deleteHeroDB,
  getAllHeroDB,
  getHeroByIdDB,
  toggleHeroTextDB,
  updateHeroDB,
} from "../models/hero.js";

import { deleteFile } from "../utils/deleteFiles.js";

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
    const { title, subtitle } = req.body;

    const image_light = req.files?.image_light?.[0]?.filename || null;
    const image_dark = req.files?.image_dark?.[0]?.filename || null;
    const image_mobile_light = req.files?.image_mobile_light?.[0]?.filename || null;
    const image_mobile_dark = req.files?.image_mobile_dark?.[0]?.filename || null;
    const logo_light = req.files?.logo_light?.[0]?.filename || null;
    const logo_dark = req.files?.logo_dark?.[0]?.filename || null;

    const show_text =
      req.body?.show_text === "true" || req.body?.show_text === true;

    const hero = await createHeroDB(
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

    let image_light = existing.image_light;
    let image_dark = existing.image_dark;
    let image_mobile_light = existing.image_mobile_light;
    let image_mobile_dark = existing.image_mobile_dark;
    let logo_light = existing.logo_light;
    let logo_dark = existing.logo_dark;

    if (req.files?.image_light) {
      deleteFile(existing.image_light);
      image_light = req.files.image_light[0].filename;
    }

    if (req.files?.image_dark) {
      deleteFile(existing.image_dark);
      image_dark = req.files.image_dark[0].filename;
    }

    if (req.files?.image_mobile_light) {
      deleteFile(existing.image_mobile_light);
      image_mobile_light = req.files.image_mobile_light[0].filename;
    }

    if (req.files?.image_mobile_dark) {
      deleteFile(existing.image_mobile_dark);
      image_mobile_dark = req.files.image_mobile_dark[0].filename;
    }

    if (req.files?.logo_light) {
      deleteFile(existing.logo_light);
      logo_light = req.files.logo_light[0].filename;
    }

    if (req.files?.logo_dark) {
      deleteFile(existing.logo_dark);
      logo_dark = req.files.logo_dark[0].filename;
    }

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
    const existing = await getHeroByIdDB(id);
    if (!existing) return res.status(404).json({ error: "Hero not found" });

    [
      "image_light",
      "image_dark",
      "image_mobile_light",
      "image_mobile_dark",
      "logo_light",
      "logo_dark",
    ].forEach((field) => {
      if (existing[field]) deleteFile(existing[field]);
    });

    await deleteHeroDB(id);

    res.json({ message: "Hero deleted successfully" });
  } catch (err) {
    console.error("Error in deleteHero:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= PATCH ================= */

export const toggleHeroText = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await toggleHeroTextDB(id);
    res.json(updated);
  } catch (err) {
    console.error("Error in toggleHeroText:", err);
    res.status(500).json({ error: "Server error" });
  }
};
