import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

cloudinary.v2.api.ping()
  .then(() => console.log("✅ Cloudinary ok"))
  .catch(err => console.error("❌ Cloudinary error:", err));
