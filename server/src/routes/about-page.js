const express = require("express");
const router = express.Router();
const aboutPageController = require("../controllers/about-page.controller");

router.get("/", aboutPageController.getAboutPage);
router.put("/", aboutPageController.updateAboutPage);

module.exports = router;
