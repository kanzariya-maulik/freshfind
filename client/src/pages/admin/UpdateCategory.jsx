import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [oldImage, setOldImage] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/categories/${id}`);
        const data = res.data;
        form.setFieldsValue({
          categoryName: data.name,
          color: data.color,
        });
        setOldImage(data.image);
      } catch (err) {
        console.error(err);
        message.error("Failed to fetch category details");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.categoryName);
      formData.append("color", values.color);
      if (values.image && values.image.file) {
        formData.append("image", values.image.file);
      }

      await axios.put(`http://localhost:8000/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Category updated successfully!");
      navigate("/admin/categories");
    } catch (err) {
      console.error(err);
      message.error("Failed to update category.");
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  return (
    <div>
      <Title level={2} className="mt-4">
        Update Category
      </Title>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/categories">Categories</Link>
        </li>
        <li className="breadcrumb-item active">Update Category</li>
      </ol>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Category Name"
                name="categoryName"
                rules={[
                  { required: true, message: "Category name is required" },
                  {
                    min: 3,
                    message: "Category name must be at least 3 characters",
                  },
                  {
                    max: 50,
                    message: "Category name cannot exceed 50 characters",
                  },
                ]}
              >
                <Input placeholder="Enter category name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Category Color"
                name="color"
                rules={[{ required: true, message: "Color is required" }]}
              >
                <Input type="color" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Category Image" name="image">
                <Upload
                  maxCount={1}
                  beforeUpload={beforeUpload}
                  listType="picture"
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
                {oldImage && (
                  <div className="mt-2">
                    <img
                      src={oldImage}
                      alt="Old Category"
                      style={{ maxWidth: "150px" }}
                    />
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Updating..." : "Update Category"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateCategory;
