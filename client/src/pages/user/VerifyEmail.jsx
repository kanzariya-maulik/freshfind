import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Typography, Button } from "antd";
import { toast } from "react-toastify";
import axios from "axios";

const { Title, Paragraph } = Typography;

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        const msg = "Invalid verification link.";
        toast.error(msg);
        setMessage(msg);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/users/verify-email?token=${token}`
        );
        const successMsg = response.data.message || "Email verified successfully!";
        toast.success(successMsg);
        setMessage(successMsg);

        // Redirect after 2 seconds
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Verification failed.";
        toast.error(errorMsg);
        setMessage(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="container text-center mt-5">
      {loading ? (
        <Spin size="large" tip="Verifying your email..." />
      ) : (
        <div>
          <Title level={3}>{message}</Title>
          <Paragraph>
            {message.includes("success") ? "Redirecting to login..." : "Please try again."}
          </Paragraph>
          {!message.includes("success") && (
            <Button type="primary" onClick={() => navigate("/forgot-password")}>
              Go to Forgot Password
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
