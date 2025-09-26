import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography } from "antd";
import { toast } from "react-toastify";

const { Title } = Typography;

const EmailVerification = () => {
  const navigate = useNavigate();

  // Static emails (replace with dynamic data if needed)
  const oldEmail = "oldEmail@gmail.com";
  const newEmail = "newEmail@gmail.com";

  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    const { oldEmailOTP, newEmailOTP } = values;

    // Simulate OTP verification (replace with actual API call)
    setTimeout(() => {
      setLoading(false);
      toast.success("Email updated successfully!");
      navigate("/admin/my-profile", {
        state: { message: "Email updated successfully!" },
      });
    }, 1000);
  };

  const validateOtp = (_, value) => {
    if (!value) return Promise.reject(new Error("OTP is required"));
    if (!/^\d{6}$/.test(value))
      return Promise.reject(new Error("OTP must be 6 digits"));
    return Promise.resolve();
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Email Verification
      </Title>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="breadcrumb-item active">Email Verification</li>
      </ol>

      <Card title="Verify OTPs" style={{ maxWidth: 600, margin: "0 auto" }}>
        <Form layout="vertical" onFinish={onFinish}>
          {/* Old Email OTP */}
          <Form.Item
            label={`OTP for Old Email: ${oldEmail}`}
            name="oldEmailOTP"
            rules={[{ validator: validateOtp }]}
          >
            <Input placeholder="Enter 6-digit OTP" maxLength={6} />
          </Form.Item>

          {/* New Email OTP */}
          <Form.Item
            label={`OTP for New Email: ${newEmail}`}
            name="newEmailOTP"
            rules={[{ validator: validateOtp }]}
          >
            <Input placeholder="Enter 6-digit OTP" maxLength={6} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Verify OTPs
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EmailVerification;
