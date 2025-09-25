const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const upload = require("../middlewares/multer.middleware");

router.post("/", upload.single("productImage"), productController.createProduct);

router.get("/", productController.getAllProducts);
router.get("/trending", productController.getTrendingProducts);
router.get("/latest", productController.getLatestProducts);

router.get("/:id", productController.getProductById);

router.get('/category/:categoryId', productController.getProductsByCategoryId);

router.put("/:id", upload.single("productImage"), productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

module.exports = router;
