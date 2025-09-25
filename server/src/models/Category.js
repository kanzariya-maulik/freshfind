const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  image: { type: String, required: true },
  isDeleted: { type: Boolean, default: false } // status field for soft deletion
});

module.exports = mongoose.model("Category", CategorySchema);
