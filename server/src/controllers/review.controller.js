const Review = require("../models/Review");

// CREATE a new review
exports.createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ all reviews or by filters (optional: productId/userId)
exports.getReviews = async (req, res) => {
  try {
    const { productId, userId } = req.query;
    const filter = {};
    if (productId) filter.productId = productId;
    if (userId) filter.userId = userId;

    const reviews = await Review.find(filter)
        .populate("productId", "productName productImage")
      .populate("userId", "firstName lastName email profilePicture");

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("productId", "productName productImage")
      .populate("userId", "firstName lastName email");

    if (!review) return res.status(404).json({ error: "Review not found" });

    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a review (admin can reply or update fields)
exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
        ...(req.body.reply && { replyDate: new Date() })
      },
      { new: true }
    );

    if (!updatedReview) return res.status(404).json({ error: "Review not found" });

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE a review
exports.deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Review not found" });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {a
    res.status(500).json({ error: err.message });
  }
};
// REPLY to a review (Admin only)
exports.replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || reply.trim() === "") {
      return res.status(400).json({ error: "Reply cannot be empty" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        $set: { reply, replyDate: new Date() },
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
