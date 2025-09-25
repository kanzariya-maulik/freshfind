const Category = require("../models/Category");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

const createCategory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = await uploadImage(req.file.path, "categories");

    const category = new Category({
      name: req.body.name,
      color: req.body.color,
      image: imageUrl,
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category", error });
  }
};
const updateCategory = async (req, res) => {
  try {
    const { name, color } = req.body;

    // Find the existing category
    const category = await Category.findById(req.params.id);
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    let imageUrl = category.image;

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (category.image) {
        await deleteImage(category.image);
      }

      // Upload new image
      imageUrl = await uploadImage(req.file.path, "categories");
    }

    // Update fields
    category.name = name || category.name;
    category.color = color || category.color;
    category.image = imageUrl;

    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category", error: error.message });
  }
};

// Soft delete a category (mark as deleted without removing from database)
const softDeleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ message: "Category not found" });

    // Delete the image from Cloudinary if it exists
    if (category.image) {
      await deleteImage(category.image);
    }

    // Soft delete category
    category.isDeleted = true;
    await category.save();

    res.status(200).json({ message: "Category soft deleted", data: category });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  softDeleteCategory,
};
