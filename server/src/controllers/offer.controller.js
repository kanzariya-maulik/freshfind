const Offer = require("../models/Offer");

// Utility to determine if an offer is active based on dates
const isActive = (startDate, endDate) => {
  const now = new Date();
  return new Date(startDate) <= now && now <= new Date(endDate);
};

// Create a new offer
exports.createOffer = async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    const offerObject = offer.toObject();
    offerObject.activeStatus = isActive(offer.startDate, offer.endDate);
    res.status(201).json(offerObject);
  } catch (err) {
    console.error("Create offer error:", err);
    res.status(400).json({ error: "Failed to create offer", details: err.message });
  }
};

// Get all offers with activeStatus calculated
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    const offersWithStatus = offers.map((offer) => {
      const offerObj = offer.toObject();
      offerObj.activeStatus = isActive(offer.startDate, offer.endDate);
      return offerObj;
    });
    res.status(200).json(offersWithStatus);
  } catch (err) {
    console.error("Fetch all offers error:", err);
    res.status(500).json({ error: "Failed to retrieve offers" });
  }
};

// Get offer by ID
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }
    const offerObj = offer.toObject();
    offerObj.activeStatus = isActive(offer.startDate, offer.endDate);
    res.status(200).json(offerObj);
  } catch (err) {
    console.error("Fetch offer by ID error:", err);
    res.status(400).json({ error: "Invalid offer ID" });
  }
};

// Update an offer
exports.updateOffer = async (req, res) => {
  try {
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedOffer) {
      return res.status(404).json({ error: "Offer not found" });
    }
    const offerObj = updatedOffer.toObject();
    offerObj.activeStatus = isActive(updatedOffer.startDate, updatedOffer.endDate);
    res.status(200).json(offerObj);
  } catch (err) {
    console.error("Update offer error:", err);
    res.status(400).json({ error: "Failed to update offer", details: err.message });
  }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
  try {
    const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
    if (!deletedOffer) {
      return res.status(404).json({ error: "Offer not found" });
    }
    res.status(200).json({ message: "Offer deleted successfully." });
  } catch (err) {
    console.error("Delete offer error:", err);
    res.status(400).json({ error: "Failed to delete offer" });
  }
};
