import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Table, Button, Rate, Modal, Input, message, Image } from "antd";

const { TextArea } = Input;

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

  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (!replyText.trim()) {
      message.error("Reply cannot be empty.");
      return;
    }
    message.success("Reply submitted successfully!");
    setReplyText("");
    setReplyModalVisible(false);
  };

  const handleDeleteReview = (reviewId) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "You won't be able to revert this!",
      okText: "Yes, delete it!",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        message.success("Review deleted successfully.");
      },
    });
  };

  const handleDeleteProduct = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "You won't be able to revert this!",
      okText: "Yes, delete it!",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        message.success("Product deleted successfully.");
      },
    });
  };

  const reviewColumns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (value) => <Rate disabled allowHalf defaultValue={value} />,
    },
    {
      title: "Review",
      dataIndex: "review",
      key: "review",
    },
    {
      title: "Reply",
      dataIndex: "reply",
      key: "reply",
      render: (reply) => reply || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            onClick={() => {
              setSelectedReview(record.reviewId);
              setReplyText(record.reply || "");
              setReplyModalVisible(true);
            }}
          >
            {record.reply ? "Update Reply" : "Reply"}
          </Button>
          <Link to={`/admin/update-review/${record.reviewId}`}>
            <Button type="default">Update</Button>
          </Link>
          <Button
            type="danger"
            onClick={() => handleDeleteReview(record.reviewId)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mt-4">View Product</h1>

      <Card title="Product Information" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 24 }}>
          <Image
            src={`../img/items/products/${product.image}`}
            alt={product.productName}
            width={200}
          />
          <div>
            <p>
              <strong>Product Name:</strong> {product.productName}
            </p>
            <p>
              <strong>Average Rating:</strong>{" "}
              <Rate disabled allowHalf defaultValue={product.rating} />
            </p>
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <p>
              <strong>Stock Quantity:</strong> {product.stock}
            </p>
            <p>
              <strong>Sale Price:</strong> ₹{product.salePrice}
            </p>
            <p>
              <strong>Discount:</strong> {product.discount}%
            </p>
            <p>
              <strong>Price After Discount:</strong> ₹
              {product.priceAfterDiscount}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Total Sales:</strong> {product.soldQuantity}
            </p>
            <div style={{ marginTop: 16 }}>
              <Link to="/admin/update-product">
                <Button type="primary" style={{ marginRight: 8 }}>
                  Update Product
                </Button>
              </Link>
              <Button type="danger" onClick={handleDeleteProduct}>
                Delete Product
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Ratings and Reviews">
        <Table
          columns={reviewColumns}
          dataSource={reviews}
          rowKey="reviewId"
          pagination={false}
        />
      </Card>

      <Modal
        title="Reply"
        open={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onOk={handleReplySubmit}
      >
        <TextArea
          rows={3}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ViewProduct;
