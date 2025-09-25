const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const bannerController = require("../controllers/banner.controller");

router.post("/", upload.single("bannerImage"), bannerController.addBanner);
router.get("/", bannerController.getAllBanners);
router.get("/:bannerId", bannerController.getBannerById);
router.put("/:bannerId", upload.single("bannerImage"), bannerController.updateBanner);
router.delete("/:bannerId", bannerController.deleteBanner);
router.patch("/:bannerId/status", bannerController.toggleBannerStatus);

module.exports = router;
