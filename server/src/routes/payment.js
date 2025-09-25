const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/payment.controller.js");

router.post("/create-order", createOrder);

module.exports = router;
