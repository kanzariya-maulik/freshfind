import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Card, Row, Col, Table, Typography, Divider, Button } from "antd";

const { Title, Text } = Typography;

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/orders/${orderId}`);
        const data = res.data;
        setOrder(data.order);
        setProducts(data.orderItems || []);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (!order) return <div className="text-center my-5">Order not found.</div>;

  const customer = order.userId;
  const address = order.delAddressId;

  const subtotalFromProducts = products.reduce((acc, product) => {
    const price = parseFloat(product.price["$numberDecimal"]);
    return acc + price * product.quantity;
  }, 0);
  const orderTotal = parseFloat(order.total["$numberDecimal"]);
  const shippingCharge = parseFloat(order.shippingCharge["$numberDecimal"]);
  const actualSubtotal = orderTotal - shippingCharge;
  const discount = subtotalFromProducts - actualSubtotal;

  const columns = [
    {
      title: "Product",
      dataIndex: "productId",
      key: "product",
      render: (product) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={product.productImage}
            alt={product.productName}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              marginRight: 8,
            }}
          />
          <span>{product.productName}</span>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${parseFloat(price["$numberDecimal"]).toFixed(2)}`,
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) =>
        `₹${(
          parseFloat(record.price["$numberDecimal"]) * record.quantity
        ).toFixed(2)}`,
      align: "center",
    },
  ];

  return (
    <div className="container my-4">
      <Row justify="space-between" align="middle" className="mb-3">
        <Col>
          <Text>
            <Link to="/">Home</Link> / <Link to="/order-history">Orders</Link> /
            Order# {order._id}
          </Text>
        </Col>
        <Col>
          <Text strong>Status: {order.orderStatus}</Text>
        </Col>
      </Row>

      <Row gutter={16} className="mb-4">
        <Col xs={24} md={12}>
          <Card title="Customer & Order">
            <p>
              <Text strong>Name:</Text> {customer.firstName} {customer.lastName}
            </p>
            <p>
              <Text strong>Phone:</Text> +91 {customer.mobile}
            </p>
            <p>
              <Text strong>Email:</Text> {customer.email}
            </p>
            <p>
              <Text strong>Payment:</Text> {order.paymentMode}
            </p>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Shipping Address">
            <p>{address.fullName}</p>
            <p>
              {address.address}, {address.city}
            </p>
            <p>
              {address.state} - {address.pincode}
            </p>
            <p>Phone: +91 {address.phone}</p>
          </Card>
        </Col>
      </Row>

      <Card title="Items Ordered">
        <Table
          dataSource={products}
          columns={columns}
          rowKey={(record, index) => index}
          pagination={false}
          bordered
          summary={() => (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3} align="right">
                  Subtotal
                </Table.Summary.Cell>
                <Table.Summary.Cell align="center">
                  ₹{subtotalFromProducts.toFixed(2)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3} align="right">
                  Shipping Charge
                </Table.Summary.Cell>
                <Table.Summary.Cell align="center">
                  ₹{shippingCharge.toFixed(2)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
              {discount > 0 && (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={3} align="right">
                    Discount
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="center" style={{ color: "red" }}>
                    -₹{discount.toFixed(2)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3} align="right">
                  <Text strong>Total</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="center">
                  <Text strong>₹{orderTotal.toFixed(2)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )}
        />
      </Card>

      <div className="mt-4 text-center">
        <Button
          type="primary"
          onClick={() => toast.success("Re-order placed!")}
        >
          Reorder
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
