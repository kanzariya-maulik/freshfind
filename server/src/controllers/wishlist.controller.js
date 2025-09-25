const UserWishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Add product to the user's wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body; // Expecting the productId in the request body
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user's wishlist already exists
    let wishlist = await UserWishlist.findOne({ userId });

    if (!wishlist) {
      // If no wishlist exists, create one with the productId
      wishlist = new UserWishlist({
        userId,
        productIds: [productId],
      });
    } else {
      // If wishlist exists, add productId to the wishlist if it's not already there
      if (!wishlist.productIds.includes(productId)) {
        wishlist.productIds.push(productId);
      } else {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
    }

    // Save the wishlist to the database
    await wishlist.save();
    return res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Remove product from the user's wishlist
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.body; // Expecting the productId in the request body
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    // Find the user's wishlist
    const wishlist = await UserWishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Remove the productId from the wishlist
    const productIndex = wishlist.productIds.indexOf(productId);
    if (productIndex > -1) {
      wishlist.productIds.splice(productIndex, 1); // Remove the productId
      await wishlist.save();
      return res.status(200).json({ message: "Product removed from wishlist", wishlist });
    } else {
      return res.status(400).json({ message: "Product not in wishlist" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get the user's wishlist
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user's wishlist
    const wishlist = await UserWishlist.findOne({ userId }).populate('productIds');

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    return res.status(200).json({ wishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
