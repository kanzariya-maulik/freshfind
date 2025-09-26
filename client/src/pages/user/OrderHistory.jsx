import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Typography, Tag, Spin } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

const { Text } = Typography;

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/orders"); // adjust endpoint
        setOrders(res.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "orderId",
      render: (id) => <Link to={`/order-details/${id}`}>{id}</Link>,
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Pending") color = "orange";
        else if (status === "Delivered") color = "green";
        else if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `₹${parseFloat(total["$numberDecimal"]).toFixed(2)}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link to={`/order-details/${record._id}`}>View Details</Link>
      ),
    },
  ];

  if (loading) return <Spin size="large" className="my-5" />;

  return (
    <Table
      dataSource={orders}
      columns={columns}
      rowKey={(record) => record._id}
      bordered
      pagination={{ pageSize: 5 }}
    />
  );
};

const OrderHistory = () => {
  return (
    <div className="container my-4">
      <Text>
        <Link to="/" className="text-decoration-none dim link">
          Home /
        </Link>{" "}
        Order History
      </Text>
      <OrdersTable />
    </div>
  );
};

export default OrderHistory;
