import React, { useState } from "react";
import { Card, Row, Col, Button, Table, Tag, Popconfirm, message } from "antd";
import { Link } from "react-router-dom";

const UserDetails = () => {
  const user = {
    First_Name: "John",
    Last_Name: "Doe",
    Email: "john.doe@example.com",
    Mobile_No: "1234567890",
    Active_Status: 1,
  };

  const [status, setStatus] = useState(user.Active_Status);

  const orders = [
    {
      key: "1001",
      Order_Id: "1001",
      Order_Date: "2025-03-10",
      Total_Quantity: 3,
      Total_Price: 150,
      Order_Status: "Delivered",
    },
    {
      key: "1002",
      Order_Id: "1002",
      Order_Date: "2025-03-11",
      Total_Quantity: 2,
      Total_Price: 200,
      Order_Status: "Pending",
    },
  ];

  const handleStatusChange = (newStatus) => {
    const action = newStatus ? "Activate" : "Deactivate";
    Popconfirm.confirm({
      title: `${action} Account?`,
      description: `Are you sure you want to ${action.toLowerCase()} this account?`,
      onConfirm: () => {
        setStatus(newStatus);
        message.success(
          `Account ${newStatus ? "activated" : "deactivated"} successfully!`
        );
      },
    });
  };

  const handleDelete = (orderId) => {
    message.warning(`Deleted order ${orderId} successfully!`);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "Order_Id",
      key: "Order_Id",
    },
    {
      title: "Order Date",
      dataIndex: "Order_Date",
      key: "Order_Date",
    },
    {
      title: "Quantity",
      dataIndex: "Total_Quantity",
      key: "Total_Quantity",
    },
    {
      title: "Total Price",
      dataIndex: "Total_Price",
      key: "Total_Price",
      render: (price) => `₹${price.toFixed(2)}`,
    },
    {
      title: "Order Status",
      dataIndex: "Order_Status",
      key: "Order_Status",
      render: (status) => {
        let color = "blue";
        if (status === "Delivered") color = "green";
        else if (status === "Pending") color = "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Link to={`/admin/view-order/${record.Order_Id}`}>
            <Button type="primary" size="small" style={{ marginRight: 8 }}>
              View
            </Button>
          </Link>
          <Link to={`/admin/update-order/${record.Order_Id}`}>
            <Button type="default" size="small" style={{ marginRight: 8 }}>
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this order?"
            onConfirm={() => handleDelete(record.Order_Id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" size="small">
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mt-4">User Details</h1>

      <Card title="User Information" className="mb-4">
        <Row gutter={16}>
          <Col span={12}>
            <p>
              <strong>Username:</strong> {user.First_Name} {user.Last_Name}
            </p>
            <p>
              <strong>Email:</strong> {user.Email}
            </p>
          </Col>
          <Col span={12}>
            <p>
              <strong>Phone Number:</strong> {user.Mobile_No}
            </p>
            <p>
              <strong>Status:</strong> {status === 1 ? "Active" : "Inactive"}
            </p>
          </Col>
        </Row>
        <Link to="/admin/update-user">
          <Button type="primary" style={{ marginRight: 8 }}>
            Edit User Info
          </Button>
        </Link>
        {status === 1 ? (
          <Popconfirm
            title="Deactivate Account?"
            onConfirm={() => setStatus(0)}
            okText="Deactivate"
            cancelText="Cancel"
          >
            <Button type="danger">Deactivate Account</Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            title="Activate Account?"
            onConfirm={() => setStatus(1)}
            okText="Activate"
            cancelText="Cancel"
          >
            <Button type="success">Activate Account</Button>
          </Popconfirm>
        )}
      </Card>

      <Card title="User Orders">
        <Table
          columns={columns}
          dataSource={orders}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default UserDetails;
