import React, { useEffect } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import axios from "axios";

const BillingAddressForm = ({ userId, fetchAddresses }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const payload = {
      userId,
      fullName: `${values.billingFirstName} ${values.billingLastName}`,
      address:
        values.billingAddress +
        (values.billingApartment ? `, ${values.billingApartment}` : ""),
      city: values.billingCity,
      state: values.billingState,
      pincode: Number(values.billingPinCode),
      phone: values.billingPhone,
    };

    try {
      await axios.post("http://localhost:8000/addresses/", payload);
      message.success("Billing address saved successfully!");
      form.resetFields();
      fetchAddresses(userId);
    } catch (err) {
      console.error(err);
      message.error("Failed to save address. Please try again.");
    }
  };

  const validatePhone = (_, value) => {
    if (!value) return Promise.reject(new Error("Phone number is required"));
    if (!/^\d{10}$/.test(value))
      return Promise.reject(new Error("Phone number must be 10 digits"));
    return Promise.resolve();
  };

  const validatePinCode = (_, value) => {
    if (!value) return Promise.reject(new Error("Pin Code is required"));
    if (!/^\d{6}$/.test(value))
      return Promise.reject(new Error("Pin Code must be 6 digits"));
    return Promise.resolve();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      <h2>Billing Details</h2>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="First Name"
            name="billingFirstName"
            rules={[
              { required: true, message: "First Name is required" },
              {
                min: 3,
                max: 50,
                message: "Must be between 3 and 50 characters",
              },
              { pattern: /^[A-Za-z\s]+$/, message: "Only letters allowed" },
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="Last Name"
            name="billingLastName"
            rules={[
              { required: true, message: "Last Name is required" },
              {
                min: 3,
                max: 50,
                message: "Must be between 3 and 50 characters",
              },
              { pattern: /^[A-Za-z\s]+$/, message: "Only letters allowed" },
            ]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="City"
            name="billingCity"
            rules={[
              { required: true, message: "City is required" },
              { pattern: /^[A-Za-z\s]+$/, message: "Only letters allowed" },
            ]}
          >
            <Input placeholder="City" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="State"
            name="billingState"
            rules={[
              { required: true, message: "State is required" },
              { pattern: /^[A-Za-z\s]+$/, message: "Only letters allowed" },
            ]}
          >
            <Input placeholder="State" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Street Address"
            name="billingAddress"
            rules={[
              { required: true, message: "Street Address is required" },
              {
                min: 5,
                max: 100,
                message: "Must be between 5 and 100 characters",
              },
            ]}
          >
            <Input.TextArea placeholder="Street Address" rows={2} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item label="Apartment, Floor, etc." name="billingApartment">
            <Input.TextArea placeholder="Apartment, Floor, etc." rows={2} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="Pin Code"
            name="billingPinCode"
            rules={[{ validator: validatePinCode }]}
          >
            <Input placeholder="Pin Code" maxLength={6} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="Phone Number"
            name="billingPhone"
            rules={[{ validator: validatePhone }]}
          >
            <Input placeholder="Phone Number" maxLength={10} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Address
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BillingAddressForm;
