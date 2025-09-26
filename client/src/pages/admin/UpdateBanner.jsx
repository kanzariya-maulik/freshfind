import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  message,
  Form,
  InputNumber,
  Select,
  Button,
  Upload,
  Card,
  Typography,
} from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const UpdateBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/banners/${id}`);
        const banner = res.data;

        form.setFieldsValue({
          bannerOrder: banner.viewOrder,
          bannerStatus: banner.activeStatus ? "1" : "0",
        });
        setPreviewImage(banner.bannerImage);
      } catch (err) {
        message.error("Failed to load banner details.");
        console.error(err);
      }
    };

    fetchBanner();
  }, [id, form]);

  const handleImageChange = (file) => {
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      message.error("Only JPG, JPEG, and PNG images are allowed.");
      return Upload.LIST_IGNORE;
    }
    setPreviewImage(URL.createObjectURL(file));
    return false; // prevent auto upload
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("viewOrder", values.bannerOrder);
      data.append("activeStatus", values.bannerStatus === "1");
      if (values.bannerImage?.file) {
        data.append("bannerImage", values.bannerImage.file);
      }

      await axios.put(`http://localhost:8000/banners/${id}`, data);
      message.success("Banner updated successfully!");
      navigate("/admin/banners");
    } catch (err) {
      console.error(err);
      message.error("Failed to update banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2} className="mt-4">
        Update Banner
      </Title>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/banners">Banners</Link>
        </li>
        <li className="breadcrumb-item active">Update Banner</li>
      </ol>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ bannerStatus: "1" }}
        >
          <Form.Item
            label="Status"
            name="bannerStatus"
            rules={[{ required: true, message: "Status is required!" }]}
          >
            <Select>
              <Option value="1">Active</Option>
              <Option value="0">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="View Order"
            name="bannerOrder"
            rules={[
              { required: true, message: "View order is required!" },
              {
                pattern: /^[1-9]\d*$/,
                message: "View order must be a positive number!",
              },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Banner Image"
            name="bannerImage"
            valuePropName="file"
          >
            <Upload
              beforeUpload={handleImageChange}
              showUploadList={false}
              accept=".jpg,.jpeg,.png"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {previewImage && (
              <img src={previewImage} alt="Preview" className="w-25 mt-2" />
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Updating..." : "Update Banner"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateBanner;
