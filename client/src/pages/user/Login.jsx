import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Form, Input, Button, Typography, Spin } from "antd";
import { useAuth } from "../../contexts/AuthContext";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/users/login", values);

      toast.success("Login successful!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      login(res.data.token, res.data.user);

      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please try again.";

      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="col-md-6">
          <div className="login-form p-4 shadow-sm rounded">
            <Title level={2} className="text-center mb-4">
              Log in to Fresh Find
            </Title>
            <Text className="text-center mb-4 d-block">
              Enter your details below
            </Text>

            <Form
              name="loginForm"
              layout="vertical"
              onFinish={handleFinish}
              disabled={loading}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <div className="d-flex justify-content-between align-items-center">
                  <Button type="primary" htmlType="submit" disabled={loading}>
                    {loading ? <Spin size="small" /> : "Log in"}
                  </Button>
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
