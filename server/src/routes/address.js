const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");

router.post("/", addressController.addAddress);
router.get("/:addressId", addressController.getAddressById);
router.get("/user/:userId", addressController.getAddressesByUserId);
router.put("/:addressId", addressController.updateAddress);

module.exports = router;
