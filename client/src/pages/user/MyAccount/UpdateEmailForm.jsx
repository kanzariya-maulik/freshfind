import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const UpdateEmailForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    // Here you can call your API to update email if needed
    console.log("Email submitted:", values.email);
    message.success("Email updated successfully!");
    navigate("/verify-email");
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            {
              type: "email",
              message: "Please enter a valid email address",
            },
          ]}
        >
          <Input placeholder="Your Email*" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Email
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateEmailForm;
