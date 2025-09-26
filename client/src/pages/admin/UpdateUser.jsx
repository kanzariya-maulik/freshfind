import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const UpdateUser = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userImage, setUserImage] = useState(null); // For preview

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/users/${id}`);
        const user = res.data;

        form.setFieldsValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.mobile,
          password: user.password,
        });

        setUserImage(user.profilePicture); // string URL
      } catch (err) {
        message.error("Failed to load user data.");
        console.error(err);
      }
    };

    fetchUser();
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("mobile", values.phone);
      formData.append("password", values.password);

      if (values.userImage && values.userImage.file) {
        formData.append("profilePicture", values.userImage.file);
      }

      await axios.put(`http://localhost:8000/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("User updated successfully!");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      message.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList[0];
  };

  return (
    <div>
      <h1 className="mt-4">Update User</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/users">Users</Link>
        </li>
        <li className="breadcrumb-item active">Update User</li>
      </ol>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
          }}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "First name is required" },
              { min: 2, message: "First name must be at least 2 characters" },
              { max: 50, message: "Cannot exceed 50 characters" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              { required: true, message: "Last name is required" },
              { min: 2, message: "Last name must be at least 2 characters" },
              { max: 50, message: "Cannot exceed 50 characters" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Phone is required" },
              { pattern: /^\d{10}$/, message: "Phone must be 10 digits" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="userImage"
            label="User Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              beforeUpload={() => false} // prevent auto upload
              listType="picture"
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {userImage && typeof userImage === "string" && (
              <img src={userImage} alt="User" height="150" className="mt-2" />
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update User
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateUser;
