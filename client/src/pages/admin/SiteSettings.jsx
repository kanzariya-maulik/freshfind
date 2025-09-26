import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Input, Button, message, Typography } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

const SiteSettings = () => {
  const [aboutContent, setAboutContent] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "http://localhost:8000"; // Replace with your backend URL

  useEffect(() => {
    fetchAboutPage();
    fetchContactPage();
  }, []);

  const fetchAboutPage = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/about-page`);
      if (!res.ok) throw new Error("Failed to fetch about page");
      const data = await res.json();
      setAboutContent(data?.data?.content || "");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchContactPage = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/contact`);
      if (!res.ok) throw new Error("Failed to fetch contact info");
      const data = await res.json();
      setContactEmail(data.contactEmail || "");
      setContactNumber(data.contactNumber || "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAboutSubmit = async () => {
    if (!aboutContent.trim()) {
      message.error("About page content cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/about-page`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: aboutContent }),
      });
      if (!res.ok) throw new Error("Failed to update about page");
      message.success("About page content updated successfully!");
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async () => {
    if (
      !contactEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)
    ) {
      message.error("Invalid email!");
      return;
    }
    if (!contactNumber.trim() || !/^\d{10}$/.test(contactNumber)) {
      message.error("Contact number must be 10 digits!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/contact`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactEmail, contactNumber }),
      });
      if (!res.ok) throw new Error("Failed to update contact info");
      message.success("Contact info updated successfully!");
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
        <div>
          <Title level={2}>Site Settings</Title>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Site Settings</li>
          </ol>
        </div>
      </div>

      <Card title="Update About Page Content" className="mb-4">
        <Form layout="vertical" onFinish={handleAboutSubmit}>
          <Form.Item label="About Page Content" required>
            <TextArea
              rows={5}
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update About Page
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Update Contact Page Info">
        <Form layout="vertical" onFinish={handleContactSubmit}>
          <Form.Item label="Contact Email" required>
            <Input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Contact Number" required>
            <Input
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Contact Info
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SiteSettings;
