const Product = require("../models/Product");
const { uploadImage, deleteImage } = require("../utils/cloudinary");
const fs = require("fs");
const Review = require('../models/Review');
const OrderItem = require("../models/OrderItem");

// Get single product by ID with average rating
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId");

    if (!product || !product.isActive) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Calculate average rating for the product
    const ratingAggregation = await Review.aggregate([
      { $match: { productId: product._id } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const avgRating = ratingAggregation[0]?.avgRating || 0;
    const totalReviews = ratingAggregation[0]?.totalReviews || 0;

    res.status(200).json({
      ...product.toObject(),
      averageRating: avgRating.toFixed(1),
      totalReviews,
    });
  } catch (err) {
    console.error("Fetch product by ID error:", err);
    res.status(400).json({ error: "Invalid product ID" });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      discount,
      costPrice,
      salePrice,
      stock,
      categoryId,
    } = req.body;

    let imageUrl = "";

    if (req.file) {
      const localPath = req.file.path;
      imageUrl = await uploadImage(localPath, "products");
    }

    const newProduct = new Product({
      productName,
      description,
      discount,
      costPrice,
      salePrice,
      stock,
      categoryId,
      productImage: imageUrl,
      isActive: true,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(400).json({ error: "Failed to create product", details: err.message });
  }
};

// Get all active products
exports.getAllProducts = async (req, res) => {
    try {
      // Step 1: Get all active products
      const products = await Product.find({ isActive: true }).populate("categoryId");
  
      // Step 2: Aggregate reviews to get avg rating and total count for each product
      const reviewStats = await Review.aggregate([
        { $match: {} },
        {
          $group: {
            _id: "$productId",
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 }
          }
        }
      ]);
  
      // Step 3: Convert stats into a lookup map
      const reviewMap = {};
      reviewStats.forEach(stat => {
        reviewMap[stat._id.toString()] = {
          avgRating: stat.avgRating.toFixed(1),
          totalReviews: stat.totalReviews
        };
      });
  
      // Step 4: Append stats to each product
      const enrichedProducts = products.map(product => {
        const stats = reviewMap[product._id.toString()] || { avgRating: "0.0", totalReviews: 0 };
        return {
          ...product.toObject(),
          averageRating: stats.avgRating,
          totalReviews: stats.totalReviews
        };
      });
  
      res.status(200).json(enrichedProducts);
    } catch (err) {
      console.error("Fetch products error:", err);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  };
  
exports.getTrendingProducts = async (req, res) => {
  try {
    // Step 1: Aggregate sales count from OrderItem
    const salesStats = await OrderItem.aggregate([
      {
        $group: {
          _id: "$productId",
          salesCount: { $sum: "$quantity" }
        }
      },
      { $sort: { salesCount: -1 } },
      { $limit: 8 }
    ]);

    const topProductIds = salesStats.map(item => item._id);

    // Step 2: Get product details
    const products = await Product.find({ _id: { $in: topProductIds }, isActive: true })
      .populate("categoryId");

    // Step 3: Get review stats
    const reviewStats = await Review.aggregate([
      { $match: { productId: { $in: topProductIds } } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const reviewMap = {};
    reviewStats.forEach(stat => {
      reviewMap[stat._id.toString()] = {
        avgRating: stat.avgRating.toFixed(1),
        totalReviews: stat.totalReviews
      };
    });

    // Step 4: Enrich products
    const enriched = products.map(product => {
      const stats = reviewMap[product._id.toString()] || { avgRating: "0.0", totalReviews: 0 };
      return {
        ...product.toObject(),
        averageRating: stats.avgRating,
        totalReviews: stats.totalReviews
      };
    });

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Fetch trending products error:", err);
    res.status(500).json({ error: "Failed to fetch trending products" });
  }
};
exports.getLatestProducts = async (req, res) => {
  try {
    // Step 1: Get latest products
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("categoryId");

    const productIds = products.map(p => p._id);

    // Step 2: Get review stats
    const reviewStats = await Review.aggregate([
      { $match: { productId: { $in: productIds } } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const reviewMap = {};
    reviewStats.forEach(stat => {
      reviewMap[stat._id.toString()] = {
        avgRating: stat.avgRating.toFixed(1),
        totalReviews: stat.totalReviews
      };
    });

    // Step 3: Enrich products
    const enriched = products.map(product => {
      const stats = reviewMap[product._id.toString()] || { avgRating: "0.0", totalReviews: 0 };
      return {
        ...product.toObject(),
        averageRating: stats.avgRating,
        totalReviews: stats.totalReviews
      };
    });

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Fetch latest products error:", err);
    res.status(500).json({ error: "Failed to fetch latest products" });
  }
};


// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      discount,
      costPrice,
      salePrice,
      stock,
      categoryId,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Handle image replacement if a new file is uploaded
    if (req.file) {
      const localPath = req.file.path;

      // Delete old image if it exists
      if (product.productImage) {
        const matches = product.productImage.match(/\/([^/]+)\.(jpg|jpeg|png|gif)$/i);
        if (matches && matches[1]) {
          const publicId = `products/${matches[1]}`;
          await deleteImage(publicId);
        }
      }

      const newImageUrl = await uploadImage(localPath, "products");
      product.productImage = newImageUrl;
    }

    // Update fields
    product.productName = productName;
    product.description = description;
    product.discount = discount;
    product.costPrice = costPrice;
    product.salePrice = salePrice;
    product.stock = stock;
    product.categoryId = categoryId;

    await product.save();
    res.status(200).json(product);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(400).json({ error: "Failed to update product", details: err.message });
  }
};

// Soft delete (mark as inactive)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({ message: "Product marked as inactive successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(400).json({ error: "Failed to delete product" });
  }
};
exports.getProductsByCategoryId = async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      // Step 1: Get all active products for the given category
      const products = await Product.find({ categoryId, isActive: true });
  
      if (products.length === 0) {
        return res.status(404).json({ error: "No products found in this category" });
      }
  
      const productIds = products.map(p => p._id);
  
      // Step 2: Get aggregated review data
      const reviewStats = await Review.aggregate([
        { $match: { productId: { $in: productIds } } },
        {
          $group: {
            _id: "$productId",
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);
  
      const reviewMap = {};
      reviewStats.forEach(stat => {
        reviewMap[stat._id.toString()] = {
          avgRating: stat.avgRating.toFixed(1),
          totalReviews: stat.totalReviews,
        };
      });
  
      // Step 3: Enrich and respond
      const enriched = products.map(product => {
        const stats = reviewMap[product._id.toString()] || { avgRating: "0.0", totalReviews: 0 };
        return {
          ...product.toObject(),
          averageRating: stats.avgRating,
          totalReviews: stats.totalReviews,
        };
      });
  
      res.status(200).json(enriched);
    } catch (err) {
      console.error("Fetch products by category error:", err);
      res.status(500).json({ error: "Failed to fetch products by category" });
    }
  };
  