const mongoose = require("mongoose");

const ContactPageSchema = new mongoose.Schema({
  contactEmail: { type: String, required: true },
  contactNumber: { type: String, required: true }
});

module.exports = mongoose.model("ContactPage", ContactPageSchema);
