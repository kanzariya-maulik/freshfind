const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

// Import configured multer
const upload = require("../middlewares/multer.middleware"); // adjust the path if needed

router.post("/", upload.single("image"), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", upload.single("image"), categoryController.updateCategory);
router.delete("/:id", categoryController.softDeleteCategory);

module.exports = router;
