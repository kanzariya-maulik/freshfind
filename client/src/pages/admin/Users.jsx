import React, { useEffect, useState } from "react";
import { Table, Avatar, Button, Popconfirm, message, Space } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/users");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/users/${userId}`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    }
  };

  const columns = [
    {
      title: "User Image",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (src, record) => (
        <Avatar
          src={
            src ||
            "https://res.cloudinary.com/dnrbe1dpn/image/upload/v1745225977/profile_pictures/ej9p210i4urssawnhk6u.jpg"
          }
          size={50}
        />
      ),
    },
    {
      title: "User Name",
      dataIndex: "firstName",
      key: "name",
      render: (_, record) =>
        !record.firstName && !record.lastName
          ? "Firebase User"
          : `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => (a.firstName || "").localeCompare(b.firstName || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      key: "mobile",
      render: (mobile) => mobile || "Firebase User",
      sorter: (a, b) => (a.mobile || "").localeCompare(b.mobile || ""),
    },
    {
      title: "Account Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === 1 ? (
          <span style={{ color: "green" }}>Active</span>
        ) : (
          <span style={{ color: "red" }}>Inactive</span>
        ),
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin/update-user/${record._id}`}>
            <Button type="default" size="small">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" size="small">
              Delete
            </Button>
          </Popconfirm>
          <Link to={`/admin/cart/${record._id}`}>
            <Button type="primary" size="small">
              Cart
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1>User Management</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Users</li>
          </ol>
        </div>
        <Link to="/admin/add-user">
          <Button type="primary">Add User</Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={users.map((user) => ({ ...user, key: user._id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        rowKey="_id"
      />
    </div>
  );
};

export default Users;
