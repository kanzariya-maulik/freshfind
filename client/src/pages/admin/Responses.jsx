import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Input, Button, Space, Modal, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";

const Responses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [reply, setReply] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/responses");
      setResponses(res.data);
    } catch (err) {
      message.error("Failed to fetch responses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/responses/${id}`);
      message.success("Response deleted successfully");
      setResponses(responses.filter((res) => res._id !== id));
    } catch (err) {
      message.error("Failed to delete response");
    }
  };

  const handleReplySubmit = async () => {
    if (!reply.trim()) {
      message.error("Reply cannot be empty!");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:8000/responses/${selectedResponse._id}/reply`,
        { reply }
      );
      setResponses((prev) =>
        prev.map((r) => (r._id === selectedResponse._id ? res.data : r))
      );
      message.success("Reply sent successfully!");
      setIsModalVisible(false);
      setReply("");
    } catch (err) {
      message.error("Failed to send reply");
    }
  };

  const filteredResponses = responses.filter((r) =>
    r.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "No.",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Message",
      dataIndex: "message",
      ellipsis: true,
    },
    {
      title: "Reply",
      dataIndex: "reply",
      render: (text) =>
        text ? (
          <Tag color="green">Replied</Tag>
        ) : (
          <Tag color="volcano">Pending</Tag>
        ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<MailOutlined />}
            disabled={record.reply}
            onClick={() => {
              setSelectedResponse(record);
              setReply(record.reply || "");
              setIsModalVisible(true);
            }}
          >
            {record.reply ? "Replied" : "Reply"}
          </Button>
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
          <h1>Responses</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Responses</li>
          </ol>
        </div>
      </div>

      <Input
        placeholder="Search responses..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-3"
      />

      <Table
        columns={columns}
        dataSource={filteredResponses}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Reply to Message"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleReplySubmit}
        okText="Send Reply"
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

export default Responses;
