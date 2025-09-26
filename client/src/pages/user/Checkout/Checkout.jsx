import React, { useEffect, useState } from "react";
import { Row, Col, Card, Radio, List, Divider, Button, message } from "antd";
import BillingAddressForm from "./BillingAddressForm";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserId(user._id);
      fetchAddresses(user._id);
      fetchCart(user._id);
    }
  }, []);

  const fetchAddresses = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/addresses/user/${userId}`
      );
      setAddresses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCart = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8000/cart/${userId}`);
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBillingForm = () => setShowBillingForm(!showBillingForm);

  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      item.productId.salePrice * (1 - item.productId.discount / 100);
    return sum + price * item.quantity;
  }, 0);
  const shippingCharge = 50;
  const total = subtotal + shippingCharge - discountAmount;

  const handleSubmit = async () => {
    if (!selectedAddress) {
      return message.error("Please select an address.");
    }

    // Razorpay logic here...
  };

  return (
    <div className="container">
      <p className="mt-3">
        <Link to="/">Home / </Link>
        <Link to="/cart">Cart / </Link>
        Checkout
      </p>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          {showBillingForm && (
            <BillingAddressForm
              userId={userId}
              fetchAddresses={fetchAddresses}
            />
          )}

          <Card
            title={
              <div className="d-flex justify-content-between align-items-center">
                Select Shipping Address
                <Button type="primary" onClick={toggleBillingForm}>
                  Add New Address
                </Button>
              </div>
            }
            style={{ marginTop: 20 }}
          >
            <Radio.Group
              onChange={(e) => setSelectedAddress(e.target.value)}
              value={selectedAddress}
              style={{ width: "100%" }}
            >
              <Row gutter={[16, 16]}>
                {addresses.map((addr) => (
                  <Col xs={24} key={addr._id}>
                    <Card
                      type="inner"
                      hoverable
                      style={{
                        border:
                          selectedAddress === addr._id
                            ? "2px solid #52c41a"
                            : "",
                      }}
                    >
                      <Radio value={addr._id}>
                        <div style={{ whiteSpace: "pre-line" }}>
                          {`${addr.fullName}, ${addr.phone},\n${addr.address},\n${addr.city}, ${addr.state} - ${addr.pincode}`}
                        </div>
                      </Radio>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Radio.Group>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Order Summary">
            <List
              itemLayout="horizontal"
              dataSource={cartItems}
              renderItem={(item) => {
                const price =
                  item.productId.salePrice *
                  (1 - item.productId.discount / 100);
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          src={item.productId.productImage}
                          alt={item.productId.productName}
                          style={{ width: 60 }}
                        />
                      }
                      title={`${item.productId.productName} x ${item.quantity}`}
                    />
                    <div>₹{(price * item.quantity).toFixed(2)}</div>
                  </List.Item>
                );
              }}
            />

            <Divider />
            <div className="d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Shipping:</span>
              <span>₹{shippingCharge.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="d-flex justify-content-between text-danger">
                <span>Discount:</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <Divider />
            <div className="d-flex justify-content-between font-weight-bold">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <Button
              type="primary"
              block
              style={{ marginTop: 16 }}
              onClick={handleSubmit}
            >
              Place Order
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
