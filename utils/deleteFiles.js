import fs from "fs";
import path from "path";

export const deleteFile = (imageUrl) => {
  if (!imageUrl) return;

  const filename = path.basename(imageUrl); // 👈 saca SOLO el nombre
  const filePath = path.join(process.cwd(), "uploads", filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
    }
  } catch (err) {
    console.error("❌ Error al eliminar archivo:", err);
  }
};
