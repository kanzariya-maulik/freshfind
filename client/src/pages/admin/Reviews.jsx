import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Input, Button, Space, Modal, message, Rate } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [reply, setReply] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/reviews");
      setReviews(res.data);
    } catch {
      message.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/reviews/${id}`);
      message.success("Review deleted successfully");
      setReviews(reviews.filter((r) => r._id !== id));
    } catch {
      message.error("Failed to delete review");
    }
  };

  const handleReplySubmit = async () => {
    if (!reply.trim()) {
      message.error("Reply cannot be empty!");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/reviews/${selectedReview._id}/reply`,
        { reply }
      );

      setReviews((prev) =>
        prev.map((r) => (r._id === selectedReview._id ? res.data : r))
      );
      message.success(selectedReview.reply ? "Reply updated!" : "Reply added!");
      setIsModalVisible(false);
      setReply("");
      setSelectedReview(null);
    } catch {
      message.error("Failed to update reply");
    }
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.productId?.productName
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      r.userId?.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
      r.review?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Product",
      dataIndex: ["productId", "productName"],
      render: (_, record) => (
        <Space>
          <img
            src={
              record.productId?.productImage || "https://via.placeholder.com/50"
            }
            alt={record.productId?.productName}
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
          {record.productId?.productName}
        </Space>
      ),
      sorter: (a, b) =>
        a.productId?.productName?.localeCompare(b.productId?.productName),
    },
    {
      title: "Username",
      render: (_, record) =>
        `${record.userId?.firstName || ""} ${record.userId?.lastName || ""}`,
      sorter: (a, b) =>
        `${a.userId?.firstName} ${a.userId?.lastName}`.localeCompare(
          `${b.userId?.firstName} ${b.userId?.lastName}`
        ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Review",
      dataIndex: "review",
    },
    {
      title: "Reply",
      dataIndex: "reply",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CommentOutlined />}
            disabled={record.reply}
            onClick={() => {
              setSelectedReview(record);
              setReply(record.reply || "");
              setIsModalVisible(true);
            }}
          >
            {record.reply ? "Replied" : "Reply"}
          </Button>
          <Link to={`/admin/update-review/${record._id}`}>
            <Button type="default" icon={<EditOutlined />}>
              Update
            </Button>
          </Link>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <div>
          <h1>Review Management</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Reviews</li>
          </ol>
        </div>
        <Link to="/admin/add-review">
          <Button type="primary">Add Review</Button>
        </Link>
      </div>

      <Input
        placeholder="Search reviews..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-3"
      />

      <Table
        columns={columns}
        dataSource={filteredReviews}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={selectedReview?.reply ? "Update Reply" : "Reply to Review"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleReplySubmit}
        okText={selectedReview?.reply ? "Update Reply" : "Add Reply"}
      >
        <Input.TextArea
          rows={4}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply here"
        />
      </Modal>
    </div>
  );
};

export default Reviews;
