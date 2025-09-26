import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Typography, message, Card, Row, Col } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const { email } = values;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/users/send-otp",
        { email }
      );

      if (response.data.message === "OTP sent successfully") {
        localStorage.setItem("otpEmail", email);
        message.success("OTP sent successfully!");
        navigate("/verify-otp");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" className="mt-5">
      <Col xs={24} sm={20} md={12} lg={8}>
        <Card>
          <Title level={3} className="text-center mb-4">
            Forgot Password?
          </Title>
          <Text className="d-block mb-4 text-center">
            Enter your email to receive a password reset OTP
          </Text>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Send OTP
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-3">
            <Link to="/login" className="dim link">
              Back to log in
            </Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
