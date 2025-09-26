import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Input, Button, Card, Upload, Avatar, Typography } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const MyProfile = () => {
  const { user, setUserData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const [profileImage, setProfileImage] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (message) toast.success(message);

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/users/${user._id}`);
        form.setFieldsValue({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          mobile: res.data.mobile || "",
        });
      } catch (err) {
        toast.error("Failed to load profile data");
      }
    };

    fetchUserData();
  }, [message, user._id, form]);

  const handleProfileSubmit = async (values) => {
    setLoadingProfile(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (profileImage) formData.append("profilePicture", profileImage);

    try {
      const res = await axios.put(
        `http://localhost:8000/users/${user._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUserData(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Profile update failed!");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    setLoadingPassword(true);
    try {
      const res = await axios.put(
        "http://localhost:8000/users/update-password",
        {
          email: user.email,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }
      );
      toast.success("Password updated successfully!");
      passwordForm.resetFields();
    } catch (err) {
      toast.error(err.response?.data || "Password update failed");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div>
      <Title level={2} className="mt-4">
        My Profile
      </Title>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item active">My Profile</li>
      </ol>

      {/* Profile Update */}
      <Card title="Update Profile" style={{ maxWidth: 600, marginBottom: 24 }}>
        <Form form={form} layout="vertical" onFinish={handleProfileSubmit}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            label="Mobile Number"
            name="mobile"
            rules={[
              { required: true, message: "Mobile number is required" },
              {
                pattern: /^\d{10}$/,
                message: "Enter valid 10-digit mobile number",
              },
            ]}
          >
            <Input placeholder="Mobile Number" maxLength={10} />
          </Form.Item>

          <Form.Item label="Profile Picture">
            <Upload
              beforeUpload={(file) => {
                const isValid = [
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                ].includes(file.type);
                if (!isValid) toast.error("Only JPG, JPEG, PNG allowed!");
                else setProfileImage(file);
                return false; // Prevent automatic upload
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            <div className="mt-2">
              <Avatar
                size={120}
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : user.profilePicture
                }
                icon={!user.profilePicture && <UserOutlined />}
              />
            </div>
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loadingProfile}>
            Update Profile
          </Button>
        </Form>
      </Card>

      {/* Password Update */}
      <Card title="Update Password" style={{ maxWidth: 600 }}>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              { required: true, message: "Current password is required" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "New password is required" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Confirm password is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loadingPassword}>
            Update Password
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default MyProfile;
