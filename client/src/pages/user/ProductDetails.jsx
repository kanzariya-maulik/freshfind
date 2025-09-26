import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Rate, InputNumber, Button, Typography, message } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 0, review: "" });
  const [errors, setErrors] = useState({});
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?._id) setUserId(storedUser._id);
  }, []);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    checkPurchaseAndReview();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Failed to fetch product", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/reviews?productId=${id}`
      );
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const checkPurchaseAndReview = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const res = await axios.get(
        `http://localhost:8000/orders/has-purchased/${user._id}/${id}`
      );
      setHasPurchased(res.data.purchased);

      const reviewRes = await axios.get(
        `http://localhost:8000/reviews?productId=${id}&userId=${user._id}`
      );
      setHasReviewed(reviewRes.data.length > 0);
    } catch (err) {
      console.error("Error checking purchase/review", err);
    }
  };

  const finalPrice = product
    ? (
        product.salePrice -
        (product.salePrice * product.discount) / 100
      ).toFixed(2)
    : "0.00";

  const handleQuantityChange = (value) => {
    setSelectedQuantity(value);
    setErrors((prev) => ({ ...prev, quantity: "" }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateField = (name, value) => {
    if (name === "rating" && !value) return "Rating is required";
    if (name === "review" && !value.trim()) return "Review cannot be empty";
    if (name === "quantity" && !value) return "Please select a quantity";
    return null;
  };

  const validateReview = () => {
    const newErrors = {
      rating: validateField("rating", review.rating),
      review: validateField("review", review.review),
    };
    Object.keys(newErrors).forEach(
      (key) => !newErrors[key] && delete newErrors[key]
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuantity = () => {
    if (!selectedQuantity) {
      setErrors({ quantity: "Please select a quantity" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleCartSubmit = async () => {
    if (!validateQuantity()) return;
    if (!userId) {
      message.error("Please log in to add to cart.");
      return;
    }

    setAddingToCart(true);
    try {
      const response = await axios.post(`http://localhost:8000/cart`, {
        userId,
        productId: product._id,
        quantity: selectedQuantity,
      });
      message.success("Product added to cart successfully!");
      setSelectedQuantity(1);
      if (response.data?.items?.length) {
        // optional: update cart count
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to add to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!validateReview()) return;
    if (!userId) {
      message.error("You must be logged in to submit a review.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/reviews", {
        productId: id,
        userId,
        rating: review.rating,
        review: review.review,
      });
      message.success("Review submitted!");
      setHasReviewed(true);
      setReview({ rating: 0, review: "" });
      fetchReviews();
    } catch (err) {
      console.error(err);
      message.error("Failed to submit review");
    }
  };

  if (!product) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <p>
        <Link to="/" className="text-decoration-none">
          Home /{" "}
        </Link>
        <Link to="/shop" className="text-decoration-none">
          Shop /{" "}
        </Link>
        {product.productName}
      </p>

      <div className="row">
        <div className="col-md-5">
          <Card
            cover={<img src={product.productImage} alt={product.productName} />}
          ></Card>
        </div>
        <div className="col-md-7">
          <Title level={4}>{product.productName}</Title>
          <div className="mb-2">
            <Rate disabled defaultValue={product.averageRating} />
            <Text className="ms-2">({product.totalReviews || 0})</Text>
          </div>
          <Text>{product.description}</Text>
          <div className="mt-3">
            <Text strong>Price: </Text>
            <Text type="danger">₹{finalPrice}</Text>
          </div>

          <div className="mt-3">
            <Text strong>Quantity: </Text>
            <InputNumber
              min={1}
              max={5}
              value={selectedQuantity}
              onChange={handleQuantityChange}
            />
            {errors.quantity && (
              <Text type="danger" className="d-block">
                {errors.quantity}
              </Text>
            )}
          </div>

          <Button
            type="primary"
            className="mt-3"
            block
            loading={addingToCart}
            onClick={handleCartSubmit}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <Title level={4} className="text-center">
          Customer Reviews
        </Title>
        {hasPurchased ? (
          hasReviewed ? (
            <Text type="secondary">
              You have already reviewed this product.
            </Text>
          ) : (
            <form onSubmit={submitReview} className="mt-3">
              <Text strong>Rating: </Text>
              <Rate
                name="rating"
                value={review.rating}
                onChange={(value) => setReview({ ...review, rating: value })}
              />
              {errors.rating && (
                <Text type="danger" className="d-block">
                  {errors.rating}
                </Text>
              )}

              <div className="mt-2">
                <Text strong>Review: </Text>
                <textarea
                  name="review"
                  className="form-control"
                  rows="3"
                  placeholder="Please add your review"
                  value={review.review}
                  onChange={handleReviewChange}
                />
                {errors.review && <Text type="danger">{errors.review}</Text>}
              </div>

              <Button type="primary" htmlType="submit" className="mt-2">
                Submit Review
              </Button>
            </form>
          )
        ) : (
          <Text type="secondary">
            Only customers who purchased this product can write a review.
          </Text>
        )}

        <div className="mt-4 row">
          {reviews.map((r) => (
            <div key={r._id} className="col-md-6 mb-3">
              <Card title={`${r.userId?.firstName} ${r.userId?.lastName}`}>
                <Rate disabled defaultValue={r.rating} />
                <p>{r.review}</p>
                <small className="text-muted">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : ""}
                </small>
                {r.reply && (
                  <Card
                    type="inner"
                    title={r.replier || "Seller"}
                    className="mt-2"
                  >
                    <p>{r.reply}</p>
                    <small className="text-muted">
                      {r.replyDate
                        ? new Date(r.replyDate).toLocaleDateString()
                        : ""}
                    </small>
                  </Card>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
