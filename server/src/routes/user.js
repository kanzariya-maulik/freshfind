// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware"); 

// Registration & Login
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/google-login", userController.googleLogin);
router.post("/check-email", userController.checkEmail);

// OTP & Password Reset
router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.verifyOtp);
router.post("/reset-password", userController.resetPassword);
router.put("/update-password", userController.updatePassword);
router.get("/verify-email", userController.verifyEmail);

// User CRUD
router.post("/", upload.single("profilePicture"), userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", upload.single("profilePicture"),  userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
