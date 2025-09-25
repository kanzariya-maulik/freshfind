const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const { uploadImage, deleteImage } = require("../utils/cloudinary");
const JWT_SECRET = process.env.JWT_SECRET;
const Otp = require("../models/Otp");

// Email transporter for sending verification emails

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register a new user with email verification link
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password, authType } = req.body;

    if (!firstName || !lastName || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      authType: authType || "Email",
      status: "Inactive",
    });

    await newUser.save();

    // Generate a verification token (JWT or UUID)
    const verificationToken = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: "1d" });

    // Construct verification link
    const verificationLink = `https://grocery-store-mern.onrender.com/verify-email/${verificationToken}`;

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Verify Your Email",
      text: `Hi ${firstName},\n\nThank you for registering. Please verify your email by clicking the following link:\n${verificationLink}\n\nThis link will expire in 24 hours.`
    });

    res.status(201).json({ message: "User registered successfully. Verification email sent." });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.authType === "Google") {
      return res.status(400).json({
        message: "This account is connected with Google. Please log in using Google Sign-In.",
      });
    }
    if (user.authType === "Email") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
      if (user.status === "Inactive") {
            return res.status(404).json({ message: "User account is inactive" });
        }
          if (user.status === "Deleted") {
            return res.status(404).json({ message: "User account is deleted, if want to recover contact admin" });
        }

    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Send OTP
const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email not registered" });

        await Otp.deleteMany({ email });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.create({ email, otp: otpCode });

        await transporter.sendMail({
            to: email,
            subject: "Your OTP Code",
            html: `<h3>Your OTP is: ${otpCode}</h3><p>This code will expire in 5 minutes.</p>`,
        });

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("OTP Send Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

        // You can now proceed to password reset
        await Otp.deleteMany({ email }); // Remove all OTPs after verification
        res.status(200).json({ message: "OTP verified" });
    } catch (error) {
        console.error("OTP Verify Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "Active") {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.status = "Active";
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ error: "Invalid or expired token" });
  }
};

//update password
const updatePassword = async (req, res) => {
    try {
      const { email, currentPassword, newPassword } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
  
      const hashed = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate({ email }, { password: hashed });
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// Create User (Admin use case)
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password, authType, firebaseUid } = req.body;

    let profilePictureUrl = null;
    if (req.file) {
      profilePictureUrl = await uploadImage(req.file.path, "profile_pictures");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      authType,
      firebaseUid,
      status: "Active",
      profilePicture: profilePictureUrl,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ status: { $ne: "Deleted" } , role:"User"});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single User
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, mobile, status, password } = req.body;
    let { profilePicture } = req.body;

    if (req.file) {
      if (profilePicture) {
        const publicId = profilePicture.split("/").pop().split(".")[0];
        await deleteImage(publicId);
      }
      profilePicture = await uploadImage(req.file.path, "profile_pictures");
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const updateFields = { firstName, lastName, mobile, profilePicture, status, password: hashedPassword };
      const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
      return res.json(user);
    }

    const updateFieldsWithoutPassword = { firstName, lastName, mobile, profilePicture, status };
    const user = await User.findByIdAndUpdate(req.params.id, updateFieldsWithoutPassword, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Deleted" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User marked as deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/google-login
const googleLogin = async (req, res) => {
    try {
      const { email, authType } = req.body;
  
      if (!email || !authType) {
        return res.status(400).json({ message: "Email and authType are required" });
      }
  
      // Check if user already exists
      let user = await User.findOne({ email });
  
      if (!user) {
        // New user → register
        user = await User.create({
          email,
          authType, // Should be 'google'
          status: "Active",
        });
  
        return res.status(201).json({
          message: "User registered successfully",
          userId: user._id,
          email: user.email,
          isNewUser: true,
        });
        }
      else{
        // Existing user → login
        return res.status(200).json({
            message: "Login successful",
            userId: user._id,
            email: user.email,
            isNewUser: false,
        });
      }
     
  
    } catch (error) {
      console.error("Google login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  const checkEmail = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      const user = await User.findOne({ email,authType:"Email" });
  
      if (user) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (err) {
      console.error("Check email error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
module.exports = {
  register,
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser, 
  verifyEmail,
  updatePassword,
  googleLogin,
  checkEmail
};
