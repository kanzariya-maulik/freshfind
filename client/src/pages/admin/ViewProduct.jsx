import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ViewProduct = () => {
  const product = {
    productId: 101,
    productName: "Chocolate Cake",
    rating: 4.5,
    description: "Delicious chocolate cake with rich frosting.",
    stock: 25,
    costPrice: 300,
    salePrice: 400,
    discount: 10,
    priceAfterDiscount: 360,
    category: "Bakery > Desserts",
    soldQuantity: 150,
    image: "cookiecake.webp",
  };

  const reviews = [
    {
      reviewId: 1,
      username: "John Doe",
      rating: 4,
      review: "Great product!",
      reply: "Thank you for your feedback!",
    },
    {
      reviewId: 2,
      username: "Jane Smith",
      rating: 5,
      review: "Loved it! Highly recommended.",
      reply: "",
    },
  ];

  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);

  // Handle reply submission
  const handleReplySubmit = () => {
    if (!replyText.trim()) {
      setReplyError("Reply cannot be empty.");
      return;
    }

    // Static reply logic - no state update
    setReplyError(""); // Clear error
    setReplyText(""); // Clear input
    setSelectedReview(null); // Close modal

    Swal.fire("Success!", "Reply updated successfully.", "success");
  };

  // Handle delete confirmation
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "The review has been deleted.", "success");
      }
    });
  };
  const handleProductDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "The product has been deleted.", "success");
      }
    });
  };

  return (
    <div>
      <h1 className="mt-4">View Product</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
        <li className="breadcrumb-item"><Link to="/admin/products">Products</Link></li>
        <li className="breadcrumb-item active">View Product</li>
      </ol>

      <div className="card mb-4">
        <div className="card-header"><h4>Product Information</h4></div>
        <div className="card-body d-flex">
          <img src={`../img/items/products/${product.image}`} alt="Product" className="me-4" height={200} />
          <div>
            <p><strong>Product Name:</strong> {product.productName}</p>
            <p><strong>Average Rating:</strong> {product.rating}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Stock Quantity:</strong> {product.stock}</p>
            <p><strong>Sale Price:</strong> ₹{product.salePrice}</p>
            <p><strong>Discount:</strong> {product.discount}%</p>
            <p><strong>Price After Discount:</strong> ₹{product.priceAfterDiscount}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Total Sales:</strong> {product.soldQuantity}</p>
            <Link to="/admin/update-product" className="btn btn-success me-2">
                Update Product
            </Link>
            <button className="btn btn-danger" onClick={() => handleProductDelete()}>Delete Product</button>
          </div>
        </div>
      </div>

      {/* Ratings and Reviews Section */}
      <div className="card mb-4">
        <div className="card-header"><h4>Ratings and Reviews</h4></div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Reply</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.reviewId}>
                  <td>{review.username}</td>
                  <td>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className="text-warning">
                        {i < review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </td>
                  <td>{review.review}</td>
                  <td>{review.reply || "-"}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => setSelectedReview(review.reviewId)}
                      data-bs-toggle="modal"
                      data-bs-target="#replyModal"
                    >
                      {review.reply==""?"":"Update"} Reply
                    </button>
                    <Link to="/admin/update-review" className="btn btn-info btn-sm me-2">Update</Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete()}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bootstrap Modal for Reply */}
      <div className="modal fade" id="replyModal" tabIndex="-1" aria-labelledby="replyModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="replyModalLabel">Reply</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <textarea className="form-control" rows="3" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
              {replyError && <p className="text-danger mt-2">{replyError}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" onClick={handleReplySubmit}>Submit Reply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;