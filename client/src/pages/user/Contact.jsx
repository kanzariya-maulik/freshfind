import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Card, Row, Col, message, Spin } from "antd";
import axios from "axios";

const { TextArea } = Input;

const Contact = () => {
  const [form] = Form.useForm();
  const [contactInfo, setContactInfo] = useState({
    contactNumber: "",
    contactEmail: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch contact info from backend
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8000/contact");
        setContactInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch contact info", error);
        message.error("Unable to load contact details.");
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        name: values.contactName,
        email: values.contactEmail,
        phone: values.contactPhone,
        message: values.contactMessage,
      };
      await axios.post("http://localhost:8000/responses", payload);
      message.success("Message sent successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      message.error("Failed to send message. Please try again later.");
    }
  };

  if (loading) return <Spin tip="Loading..." className="d-block mt-5" />;

  return (
    <div className="container mt-5">
      <p>
        <Link to="/" className="text-decoration-none dim link">
          Home /
        </Link>{" "}
        Contact
      </p>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Contact Info" bordered className="shadow-sm">
            <p>
              <strong>Call Us:</strong>{" "}
              {contactInfo.contactNumber || "Loading..."}
            </p>
            <p>We are available 24/7, 7 days a week.</p>
            <p>
              <strong>Email:</strong> {contactInfo.contactEmail || "Loading..."}
            </p>
            <p>Fill out our form and we will contact you within 24 hours.</p>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="Send Us a Message" bordered className="shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                contactName: "",
                contactEmail: "",
                contactPhone: "",
                contactMessage: "",
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Your Name"
                    name="contactName"
                    rules={[
                      { required: true, message: "Please enter your name" },
                    ]}
                  >
                    <Input placeholder="Your Name*" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Your Email"
                    name="contactEmail"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Invalid email format" },
                    ]}
                  >
                    <Input placeholder="Your Email*" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Your Phone"
                    name="contactPhone"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your phone number",
                      },
                      {
                        pattern: /^\d{10}$/,
                        message: "Phone number must be 10 digits",
                      },
                    ]}
                  >
                    <Input placeholder="Your Phone*" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Your Message"
                name="contactMessage"
                rules={[
                  { required: true, message: "Please enter your message" },
                  {
                    min: 10,
                    message: "Message must be at least 10 characters",
                  },
                ]}
              >
                <TextArea rows={7} placeholder="Your Message*" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Contact;
