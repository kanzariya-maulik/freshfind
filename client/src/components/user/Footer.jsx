import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Input, Button, Typography, Space } from "antd";

const { Text, Title } = Typography;

const Footer = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!value.trim()) {
      setError("Email is required");
    } else if (!validateEmail(value)) {
      setError("Please enter a valid email address");
    } else {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      toast.error("Email is required!");
    } else if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      toast.error("Invalid email address!");
    } else {
      setError("");
      toast.success("Subscribed successfully!");
      setEmail("");
    }
  };

  return (
    <div className="footer container mt-5 d-flex flex-column border-top">
      <div className="row d-flex justify-content-around align-items-center gap-5 my-4">
        <div className="col-6 col-md-2 d-flex justify-content-center align-items-center">
          <div className="logo">
            <Link
              to="/"
              style={{ color: "orange" }}
              className="nav-link p-0 text-body-secondary fw-bolder fs-1 text"
            >
              FRESH FIND
            </Link>
            <h1>Taste the Goodness</h1>
          </div>
        </div>

        <div className="col-6 col-md-2 d-flex flex-column justify-content-center align-items-center">
          <Title level={5}>Quick Links</Title>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link
                to="/"
                style={{ color: "#FFA500" }}
                className="nav-link p-0 text-body-secondary"
              >
                Home
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/shop"
                style={{ color: "#FFA500" }}
                className="nav-link p-0 text-body-secondary"
              >
                Shop
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/contact"
                style={{ color: "#FFA500" }}
                className="nav-link p-0"
              >
                Contact
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/order-history"
                style={{ color: "#FFA500" }}
                className="nav-link p-0 text-body-secondary"
              >
                Your Orders
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/cart"
                style={{ color: "#FFA500" }}
                className="nav-link p-0 text-body-secondary"
              >
                Cart
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-md-5 offset-md-1 mb-3 d-flex flex-column justify-content-center align-items-center">
          <form onSubmit={handleSubmit}>
            <Title level={5}>Subscribe to our newsletter</Title>
            <Text>Monthly digest of whats new and exciting from us.</Text>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  placeholder="Email address"
                  value={email}
                  onChange={handleChange}
                />
                <Button type="primary" htmlType="submit">
                  Subscribe
                </Button>
              </Space.Compact>
              {error && <Text type="danger">{error}</Text>}
            </Space>
          </form>
        </div>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-center border-top">
        <Text className="my-4">© 2025 Company, Inc. All rights reserved.</Text>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Footer;
