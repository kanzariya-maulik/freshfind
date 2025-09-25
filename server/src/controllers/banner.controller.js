const Banner = require("../models/Banner");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

const addBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const imageUrl = await uploadImage(req.file.path, "banners");

    const banner = new Banner({
      bannerImage: imageUrl,
      viewOrder: req.body.viewOrder,
      activeStatus: req.body.activeStatus,
    });

    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    console.error("Error adding banner:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch banners", error });
  }
};

const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.bannerId);
    if (!banner || banner.isDeleted) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch banner", error });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { viewOrder, activeStatus, type } = req.body;

    const banner = await Banner.findById(req.params.bannerId);
    if (!banner || banner.isDeleted) {
      return res.status(404).json({ message: "Banner not found" });
    }

    let imageUrl = banner.bannerImage;

    if (req.file) {
      if (banner.bannerImage) {
        await deleteImage(banner.bannerImage);
      }
      imageUrl = await uploadImage(req.file.path, "banners");
    }

    banner.viewOrder = viewOrder || banner.viewOrder;
    banner.activeStatus = activeStatus || banner.activeStatus;
    banner.bannerImage = imageUrl;
    banner.type = type || banner.type; // Update type field

    const updatedBanner = await banner.save();
    res.status(200).json(updatedBanner);
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Failed to update banner", error: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.bannerId);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    if (banner.bannerImage) {
      await deleteImage(banner.bannerImage);
    }

    await Banner.findByIdAndDelete(req.params.bannerId);
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete banner", error });
  }
};

const toggleBannerStatus = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ message: "Status must be a boolean" });
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      bannerId,
      { activeStatus: status },
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json({ message: `Banner ${status ? 'activated' : 'deactivated'} successfully`, banner: updatedBanner });
  } catch (error) {
    res.status(500).json({ message: "Failed to update banner status", error });
  }
};

module.exports = {
  addBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
};
