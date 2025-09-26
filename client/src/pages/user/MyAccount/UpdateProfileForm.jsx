import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Avatar } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const UpdateProfileForm = ({ userData, onUpdate }) => {
  const { setUserData } = useAuth();
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(
    "/img/users/default-img.png"
  );
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobile: userData.mobile,
      });
      if (userData.profilePicture) setPreviewImage(userData.profilePicture);
    }
  }, [userData]);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Only JPG/PNG files are allowed!");
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error("Image must be smaller than 1MB!");
    }
    return isJpgOrPng && isLt1M;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      setPreviewImage(URL.createObjectURL(newFileList[0].originFileObj));
    } else {
      setPreviewImage(userData.profilePicture || "/img/users/default-img.png");
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("firstName", values.firstName);
      submitData.append("lastName", values.lastName);
      submitData.append("mobile", values.mobile);
      submitData.append("status", "active");
      if (fileList.length > 0) {
        submitData.append("profilePicture", fileList[0].originFileObj);
      }

      const response = await axios.put(
        `http://localhost:8000/users/${userData._id}`,
        submitData
      );
      if (response.data) {
        message.success("Profile updated successfully!");
        setUserData(response.data);
        onUpdate && onUpdate();
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 500 }}
    >
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[
          { required: true, message: "First name is required" },
          { min: 2, message: "Must be at least 2 characters" },
          { max: 30, message: "Cannot exceed 30 characters" },
          { pattern: /^[A-Za-z\s]+$/, message: "Only letters allowed" },
        ]}
      >
        <Input placeholder="Your First Name" />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[
          { required: true, message: "Last name is required" },
          { min: 2, message: "Must be at least 2 characters" },
          { max: 30, message: "Cannot exceed 30 characters" },
          { pattern: /^[A-Za-z\s]+$/, message: "Only letters allowed" },
        ]}
      >
        <Input placeholder="Your Last Name" />
      </Form.Item>

      <Form.Item
        label="Mobile"
        name="mobile"
        rules={[
          { required: true, message: "Mobile number is required" },
          {
            pattern: /^[0-9]{10}$/,
            message: "Mobile number must be 10 digits",
          },
        ]}
      >
        <Input placeholder="Your Mobile" maxLength={10} />
      </Form.Item>

      <Form.Item label="Profile Picture">
        <Upload
          listType="picture"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          fileList={fileList}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Select Image</Button>
        </Upload>
        <div style={{ marginTop: 10 }}>
          <Avatar src={previewImage} size={100} />
        </div>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Profile
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProfileForm;
