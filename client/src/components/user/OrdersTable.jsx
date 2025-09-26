import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Spin, Button } from "antd";

const OrdersTable = () => {
  const [userId, setUserId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/orders/user/${userId}`
        );
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <span className="text-start">{text}</span>,
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
    },
    {
      title: "Shipping (₹)",
      dataIndex: "shippingCharge",
      key: "shippingCharge",
      render: (charge) => `₹${parseFloat(charge["$numberDecimal"]).toFixed(2)}`,
    },
    {
      title: "Total (₹)",
      dataIndex: "total",
      key: "total",
      render: (total) => `₹${parseFloat(total["$numberDecimal"]).toFixed(2)}`,
    },
    {
      title: "View",
      key: "view",
      render: (_, record) => (
        <Link to={`/order/${record._id}`}>
          <Button type="primary">View Order</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spin size="large" />
        </div>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default OrdersTable;
