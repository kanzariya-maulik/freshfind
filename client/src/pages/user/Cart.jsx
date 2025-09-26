import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  InputNumber,
  Badge,
  Alert,
  Card,
  Row,
  Col,
  Spin,
  message,
} from "antd";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const Cart = () => {
  const shippingCharge = 50;
  const { cartCount, updateCartCount } = useAuth();
  const [cart, setCart] = useState([]);
  const [offers, setOffers] = useState([]);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch cart and offers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?._id) throw new Error("User not found");

        const [cartRes, offersRes] = await Promise.all([
          axios.get(`http://localhost:8000/cart/${user._id}`),
          axios.get("http://localhost:8000/offers"),
        ]);

        setCart(cartRes.data.items);
        updateCartCount(cartRes.data.items.length);

        const activeOffers = offersRes.data.filter((o) => o.activeStatus);
        setOffers(activeOffers);

        const storedOffer = sessionStorage.getItem("appliedOffer");
        if (storedOffer)
          checkOffer(JSON.parse(storedOffer), cartRes.data.items);
      } catch (err) {
        message.error(err.message || "Failed to fetch cart or offers");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [updateCartCount]);

  const subtotal = cart.reduce((total, item) => {
    const price = parseFloat(item.productId.salePrice || 0);
    const discount = parseFloat(item.productId.discount || 0);
    const discountedPrice = price - (price * discount) / 100;
    return total + discountedPrice * item.quantity;
  }, 0);

  const total = subtotal - discountAmount + shippingCharge;

  const checkOffer = (offer, cartItems = cart) => {
    const sub = cartItems.reduce((total, item) => {
      const price = parseFloat(item.productId.salePrice || 0);
      const discount = parseFloat(item.productId.discount || 0);
      const discountedPrice = price - (price * discount) / 100;
      return total + discountedPrice * item.quantity;
    }, 0);

    if (sub >= offer.minimumOrder) {
      setAppliedOffer(offer);
      const offerDiscount = Math.min(
        sub * (offer.discount / 100),
        offer.maxDiscount
      );
      setDiscountAmount(offerDiscount);
      sessionStorage.setItem("appliedOffer", JSON.stringify(offer));
    } else {
      setAppliedOffer(null);
      setDiscountAmount(0);
    }
  };

  const applyOffer = (offer) => {
    if (subtotal >= offer.minimumOrder) {
      setAppliedOffer(offer);
      const offerDiscount = Math.min(
        subtotal * (offer.discount / 100),
        offer.maxDiscount
      );
      setDiscountAmount(offerDiscount);
      sessionStorage.setItem("appliedOffer", JSON.stringify(offer));
      message.success("Offer applied successfully!");
    } else {
      message.error(
        `This offer requires a minimum purchase of ₹${offer.minimumOrder}`
      );
    }
  };

  const handleQuantityChange = async (id, value) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const item = cart.find((i) => i.productId._id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + value);
    try {
      await axios.put(`http://localhost:8000/cart/${user._id}`, {
        productId: id,
        quantity: newQuantity,
      });

      setCart((prev) =>
        prev.map((i) =>
          i.productId._id === id ? { ...i, quantity: newQuantity } : i
        )
      );
      updateCartCount(cart.length);
      message.success("Cart updated successfully");
    } catch {
      message.error("Failed to update cart");
    }
  };

  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await axios.delete(`http://localhost:8000/cart/${user._id}`, {
        data: { productId: id },
      });
      setCart((prev) => prev.filter((i) => i.productId._id !== id));
      updateCartCount(cart.length - 1);
      message.success("Product removed from cart!");
    } catch {
      message.error("Failed to remove product");
    }
  };

  if (loading) return <Spin tip="Loading..." className="d-block mt-5" />;

  if (!cart.length)
    return (
      <Alert
        message={
          <span>
            Your cart is empty. <Link to="/shop">Continue Shopping</Link>
          </span>
        }
        type="info"
        className="mt-5"
      />
    );

  const columns = [
    {
      title: "Product",
      dataIndex: "productId",
      key: "product",
      render: (product) => (
        <div className="d-flex align-items-center">
          <img
            src={product.productImage}
            alt={product.productName}
            style={{ width: 60, marginRight: 10 }}
          />
          {product.productName}
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "productId",
      key: "price",
      render: (product) => {
        const price = parseFloat(product.salePrice || 0);
        const discount = parseFloat(product.discount || 0);
        const discountedPrice = price - (price * discount) / 100;
        return `₹${discountedPrice.toFixed(2)}`;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) =>
            handleQuantityChange(record.productId._id, value - quantity)
          }
        />
      ),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      render: (_, record) => {
        const price = parseFloat(record.productId.salePrice || 0);
        const discount = parseFloat(record.productId.discount || 0);
        const discountedPrice = price - (price * discount) / 100;
        return `₹${(discountedPrice * record.quantity).toFixed(2)}`;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.productId._id)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      <Table
        columns={columns}
        dataSource={cart}
        rowKey={(record) => record.productId._id}
        pagination={false}
      />

      <Card title="Available Offers" className="mt-4">
        {offers.length === 0 ? (
          <Alert message="No active offers available." type="warning" />
        ) : (
          offers.map((offer) => {
            const isApplied =
              appliedOffer && appliedOffer.offerCode === offer.offerCode;
            return (
              <Row
                key={offer._id}
                justify="space-between"
                align="middle"
                className="mb-2"
              >
                <Col>
                  <Badge
                    count={offer.offerCode}
                    style={{ backgroundColor: "#52c41a" }}
                  />
                  <span className="ms-2">
                    {offer.discount}% off on orders over ₹{offer.minimumOrder}
                  </span>
                </Col>
                <Col>
                  {isApplied ? (
                    <Badge status="success" text="Applied" />
                  ) : (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => applyOffer(offer)}
                    >
                      Apply
                    </Button>
                  )}
                </Col>
              </Row>
            );
          })
        )}
      </Card>

      <Card
        title="Cart Summary"
        className="mt-4"
        style={{ maxWidth: 400, marginLeft: "auto" }}
      >
        <Row justify="space-between" className="mb-2">
          <Col>Subtotal:</Col>
          <Col>₹{subtotal.toFixed(2)}</Col>
        </Row>
        {appliedOffer && (
          <Row justify="space-between" className="mb-2 text-success">
            <Col>Offer ({appliedOffer.offerCode}) Applied:</Col>
            <Col>-₹{discountAmount.toFixed(2)}</Col>
          </Row>
        )}
        <Row justify="space-between" className="mb-2">
          <Col>Shipping:</Col>
          <Col>₹{shippingCharge}</Col>
        </Row>
        <hr />
        <Row justify="space-between" className="fw-bold">
          <Col>Total:</Col>
          <Col>₹{total.toFixed(2)}</Col>
        </Row>
        <Link to="/checkout">
          <Button type="primary" block className="mt-3">
            Proceed to Checkout
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default Cart;
