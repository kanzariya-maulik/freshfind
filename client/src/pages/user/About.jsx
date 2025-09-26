import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Typography, Spin, Alert, Card } from "antd";

const { Title, Paragraph } = Typography;

const About = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        const response = await axios.get("http://localhost:8000/about-page");
        if (response.data && response.data.data) {
          setContent(response.data.data.content);
        }
      } catch (err) {
        setError("Failed to load about page content.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  if (loading) {
    return (
      <div className="text-center" style={{ padding: "50px 0" }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center" style={{ padding: "50px 0" }}>
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="sitemap mb-3">
        <Link to="/" className="text-decoration-none dim link">
          Home /
        </Link>{" "}
        About
      </div>

      <Card bordered={false} style={{ padding: "30px" }}>
        <Title level={2} className="mb-4">
          About Us
        </Title>
        <Paragraph>
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ lineHeight: "1.8", fontSize: "16px" }}
          />
        </Paragraph>
      </Card>
    </div>
  );
};

export default About;
