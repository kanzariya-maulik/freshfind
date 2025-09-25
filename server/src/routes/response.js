const express = require("express");
const router = express.Router();
const responseController = require("../controllers/response.controller");

router.post("/", responseController.createResponse);
router.get("/", responseController.getAllResponses);
router.get("/:id", responseController.getResponseById);
router.put("/:id/reply", responseController.updateReply);
router.delete("/:id", responseController.deleteResponse);

module.exports = router;
