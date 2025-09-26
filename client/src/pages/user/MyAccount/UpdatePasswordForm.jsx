import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const UpdatePasswordForm = ({ email }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:8000/users/update-password",
        {
          email,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }
      );

      if (response.data.message === "Password updated successfully") {
        message.success("Password updated successfully!");
        form.resetFields();
      } else {
        message.error(response.data.message || "Failed to update password.");
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const validateNewPassword = (_, value) => {
    if (!value) return Promise.reject("New password is required");
    if (value.length < 6)
      return Promise.reject("Password must be at least 6 characters");
    if (value.length > 20)
      return Promise.reject("Password must not exceed 20 characters");
    if (value === form.getFieldValue("currentPassword"))
      return Promise.reject("New password cannot be same as current password");
    return Promise.resolve();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: 400 }}
    >
      <Form.Item
        label="Current Password"
        name="currentPassword"
        rules={[
          { required: true, message: "Current password is required" },
          { min: 6, message: "Password must be at least 6 characters" },
          { max: 20, message: "Password must not exceed 20 characters" },
        ]}
      >
        <Input.Password placeholder="Current password" />
      </Form.Item>

      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[{ validator: validateNewPassword }]}
      >
        <Input.Password placeholder="New password" />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={["newPassword"]}
        rules={[
          { required: true, message: "Confirm password is required" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value) return Promise.reject("Confirm password is required");
              if (value !== getFieldValue("newPassword")) {
                return Promise.reject("Passwords do not match");
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Change Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdatePasswordForm;
