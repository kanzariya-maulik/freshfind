const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.post("/", cartController.addToCart);
router.get("/:userId", cartController.getCartByUserId);
router.put("/:userId", cartController.updateCartItem);
router.delete("/:userId", cartController.removeCartItem);
router.delete("/clear/:userId", cartController.clearCart);

module.exports = router;
