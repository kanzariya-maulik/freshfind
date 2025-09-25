const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });

    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.log(error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok') {
      console.log(`Image with public ID ${publicId} deleted successfully.`);
      return true;
    } else {
      console.log(`Failed to delete image with public ID ${publicId}.`);
      return false;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

module.exports = { uploadImage, deleteImage };
