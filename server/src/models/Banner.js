const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  bannerImage: { type: String, required: true },
  viewOrder: { type: Number, required: true },
  activeStatus: { type: Boolean, required: true },
  type: { type: String, required: true, default: "slider", } // Add type field, e.g., "promotion", "announcement"
});


module.exports = mongoose.model("Banner", BannerSchema);