import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  Button,
  Image,
  Typography,
  Row,
  Col,
  message,
  Breadcrumb,
  Space,
  Popconfirm,
} from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const Cart = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({ firstName: "", lastName: "" });
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:8000/cart/${userId}`);
      const cartItems = data.items.map((item) => ({
        id: item.productId._id,
        name: item.productId.productName,
        quantity: item.quantity,
        price: item.productId.salePrice,
        image: item.productId.productImage,
        itemId: item._id,
      }));
      setCart(cartItems);
      calculateTotal(cartItems);
      if (data.user)
        setUser({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        });
    } catch (err) {
      console.error("Failed to fetch cart", err);
      message.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/cart/${userId}`, {
        data: { productId },
      });
      const updated = cart.filter((item) => item.id !== productId);
      setCart(updated);
      calculateTotal(updated);
      message.success("Product removed from cart!");
    } catch {
      message.error("Failed to remove product!");
    }
  };

  const updateQuantity = async (id, amount) => {
    const updatedItem = cart.find((item) => item.id === id);
    if (!updatedItem) return;

    const newQuantity = updatedItem.quantity + amount;
    if (newQuantity < 1) return;

    try {
      await axios.put(`http://localhost:8000/cart/${userId}`, {
        productId: id,
        quantity: newQuantity,
      });
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      calculateTotal(updatedCart);
      message.success("Cart updated successfully");
    } catch {
      message.error("Failed to update cart");
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <Space>
          <Image width={50} height={50} src={record.image} />
          <Link to="/admin/view-product">{record.name}</Link>
        </Space>
      ),
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => updateQuantity(record.id, -1)}
          />
          {record.quantity}
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => updateQuantity(record.id, 1)}
          />
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => `₹${record.price * record.quantity}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to remove this item?"
          onConfirm={() => handleRemove(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />}>
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            Cart of {user.firstName} {user.lastName}
          </Title>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/admin">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/admin/users">Users</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Cart</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col>
          <Link to={`/admin/add-to-cart/${userId}`}>
            <Button type="primary">Add Items</Button>
          </Link>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={cart}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{ emptyText: "No items in the cart." }}
      />

      {cart.length > 0 && (
        <Row justify="end" style={{ marginTop: 16 }}>
          <Col>
            <Title level={5}>Total Amount: ₹{totalAmount}</Title>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Cart;
