const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  offerCode: { type: String, required: true },
  offerDescription: { type: String, required: true },
  discount: { type: Number, required: true },
  maxDiscount: { type: Number, required: true },
  minimumOrder: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

module.exports = mongoose.model("Offer", OfferSchema);
