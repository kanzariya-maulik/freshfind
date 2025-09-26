import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Typography, Spin, notification } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const OtpVerification = () => {
  const email = localStorage.getItem("otpEmail");
  const savedTimeLeft = localStorage.getItem("timeLeft") || 60;

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState("");
  const [timeLeft, setTimeLeft] = useState(parseInt(savedTimeLeft));
  const [resendEnabled, setResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) {
      setResendEnabled(true);
      return;
    }

    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        localStorage.setItem("timeLeft", newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timeLeft]);

  const validateOtp = (value) => {
    if (!value.trim()) return "OTP is required.";
    if (value.length !== 6 || isNaN(value)) return "Enter a valid 6-digit OTP.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateOtp(otp);
    if (error) {
      setErrors(error);
      return;
    }

    setErrors("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/users/verify-otp", {
        email,
        otp,
      });

      if (response.data.message === "OTP verified") {
        notification.success({ message: "OTP verified successfully!" });
        navigate("/reset-password");
      } else {
        setErrors("Invalid OTP, please try again.");
      }
    } catch (err) {
      setErrors(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setTimeLeft(60);
    setResendEnabled(false);
    localStorage.setItem("timeLeft", 60);

    try {
      const response = await axios.post("http://localhost:8000/users/send-otp", { email });
      if (response.data.message === "OTP resent successfully") {
        notification.info({ message: "OTP resent successfully!" });
      }
    } catch (err) {
      notification.error({
        message: err.response?.data?.message || "Something went wrong while resending OTP.",
      });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="login-form d-flex flex-column align-items-center">
            <div className="mb-3 w-100">
              <Title level={3}>Enter OTP</Title>
              <Text>Enter the OTP we sent to your email</Text>
              <Text className="d-block mt-2">OTP sent to: <small>{email}</small></Text>

              <form onSubmit={handleSubmit} className="mt-3">
                <Input
                  type="number"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
                {errors && <Text type="danger">{errors}</Text>}

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="mt-3"
                  disabled={loading}
                >
                  {loading ? <Spin /> : "Verify"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                {timeLeft > 0 ? (
                  <Text type="secondary">Resend OTP in {timeLeft} seconds</Text>
                ) : (
                  <Button type="link" onClick={handleResendOtp} disabled={!resendEnabled}>
                    Resend OTP
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
