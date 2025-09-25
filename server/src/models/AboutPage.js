const mongoose = require("mongoose");

const AboutPageSchema = new mongoose.Schema({
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("AboutPage", AboutPageSchema);
