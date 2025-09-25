const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: false },
  password: {
    type: String,
    required: function () {
      return this.authType === "Email";
    },
  },
  profilePicture: { type: String, default: null },
  role: { type: String, enum: ["User", "Admin"], default: "User" },
  status: {
    type: String,
    enum: ["Inactive", "Active", "Deleted"],
    default: "Inactive",
  },
  token: { type: String, default: null, required: false },
  authType: { type: String, enum: ["Email", "Google"], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
