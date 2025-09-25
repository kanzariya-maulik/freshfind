const express = require('express');
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlist.controller');

// Route to add a product to the wishlist
router.post('/:userId/add', addToWishlist);

// Route to remove a product from the wishlist
router.delete('/:userId/remove', removeFromWishlist);

// Route to get the user's wishlist
router.get('/:userId', getWishlist);

module.exports = router;
