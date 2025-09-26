import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Form, Input, Button, Upload, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    categoryName: "",
    color: "#000000",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateField = (name, value) => {
    let error = null;

    if (name === "categoryName") {
      if (!value.trim()) {
        error = "Category name is required.";
      } else if (value.length < 3) {
        error = "Category name must be at least 3 characters.";
      } else if (value.length > 50) {
        error = "Category name cannot exceed 50 characters.";
      }
    }

    if (name === "color") {
      if (!value.trim()) {
        error = "Color is required.";
      }
    }

    if (name === "image") {
      if (!value) {
        error = "Image is required.";
      }
    }

    return error;
  };

  const handleSubmit = async () => {
    const formErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) formErrors[field] = error;
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const categoryData = new FormData();
    categoryData.append("name", formData.categoryName);
    categoryData.append("color", formData.color);
    categoryData.append("image", formData.image);

    try {
      await axios.post("http://localhost:8000/categories", categoryData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Category added successfully");
      navigate("/admin/categories");
      setFormData({ categoryName: "", color: "#000000", image: null });
    } catch (error) {
      toast.error("Failed to add category");
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mt-4">Add Category</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/categories">Categories</Link>
        </li>
        <li className="breadcrumb-item active">Add Category</li>
      </ol>

      <div className="card mb-4">
        <div className="card-body">
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Category Name" required>
              <Input
                value={formData.categoryName}
                onChange={(e) => handleChange("categoryName", e.target.value)}
              />
              {errors.categoryName && <p className="text-danger">{errors.categoryName}</p>}
            </Form.Item>

            <Form.Item label="Color" required>
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange("color", e.target.value)}
              />
              {errors.color && <p className="text-danger">{errors.color}</p>}
            </Form.Item>

            <Form.Item label="Category Image" required>
              <Upload
                beforeUpload={(file) => {
                  handleChange("image", file);
                  return false; // prevent auto-upload
                }}
                accept=".png,.jpeg,.jpg"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
              {errors.image && <p className="text-danger">{errors.image}</p>}
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={loading}>
                {loading ? <Spin size="small" /> : "Add Category"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
