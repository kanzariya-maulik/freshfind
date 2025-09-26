import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message, Row, Col, Card } from "antd";

const { Title, Text } = Typography;

const EmailVerification = () => {
  const oldEmail = "old@example.com";
  const newEmail = "new@example.com";
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (timeLeft <= 0) {
      setResendEnabled(true);
      return;
    }
    const countdown = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timeLeft]);

  const handleResendOtp = () => {
    setTimeLeft(60);
    setResendEnabled(false);
    message.info("OTP resent successfully!");
  };

  const handleSubmit = (values) => {
    navigate("/account", { state: { message: "Email updated successfully!" } });
    message.success("Email updated successfully!");
    form.resetFields();
  };

  const otpRules = [
    { required: true, message: "OTP is required" },
    {
      len: 6,
      message: "OTP must be exactly 6 digits",
    },
    {
      pattern: /^\d{6}$/,
      message: "OTP must be numeric",
    },
  ];

  return (
    <Row justify="center" className="mt-5">
      <Col xs={24} sm={20} md={12} lg={8}>
        <Card>
          <Title level={3} className="text-center mb-4">
            Enter OTPs
          </Title>
          <Text className="mb-3 d-block text-center">
            Enter OTPs for your old and new email addresses
          </Text>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label={`Old Email: ${oldEmail}`}
              name="oldOtp"
              rules={otpRules}
            >
              <Input placeholder="OTP for Old Email" />
            </Form.Item>

            <Form.Item
              label={`New Email: ${newEmail}`}
              name="newOtp"
              rules={otpRules}
            >
              <Input placeholder="OTP for New Email" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Verify OTPs
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-3">
            {timeLeft > 0 ? (
              <Text type="danger">Resend OTP in {timeLeft} seconds</Text>
            ) : (
              <Button type="link" onClick={handleResendOtp}>
                Resend OTP
              </Button>
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default EmailVerification;
