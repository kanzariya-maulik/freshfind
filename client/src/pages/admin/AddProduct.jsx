import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Form, Input, InputNumber, Select, Button, Upload, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const AddProduct = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/categories");
        setCategories(res.data);
      } catch {
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleUploadChange = (info) => {
    if (info.file.status !== "uploading") {
      setUploadFile(info.file.originFileObj);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("productName", values.productName);
      data.append("description", values.productDescription);
      data.append("discount", values.productDiscount);
      data.append("costPrice", values.costPrice);
      data.append("salePrice", values.salePrice);
      data.append("stock", values.productStock);
      data.append("categoryId", values.productCategory);
      if (uploadFile) data.append("productImage", uploadFile);

      await axios.post("http://localhost:8000/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Product submit error:", err);
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mt-4">Add Product</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/products">Products</Link>
        </li>
        <li className="breadcrumb-item active">Add Product</li>
      </ol>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          productDiscount: 0,
          costPrice: 0,
          salePrice: 0,
          productStock: 0,
        }}
      >
        <Form.Item
          label="Product Name"
          name="productName"
          rules={[
            { required: true, message: "Please enter product name" },
            {
              min: 3,
              message: "Product name must be at least 3 characters",
            },
            {
              pattern: /[^\d]/,
              message: "Product name cannot be only numbers",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Discount (%)"
          name="productDiscount"
          rules={[
            { required: true, message: "Please enter discount" },
            {
              type: "number",
              min: 1,
              max: 100,
              message: "Discount must be between 1% and 100%",
            },
          ]}
        >
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Cost Price"
          name="costPrice"
          rules={[{ required: true, message: "Please enter cost price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Sale Price"
          name="salePrice"
          rules={[
            { required: true, message: "Please enter sale price" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value >= getFieldValue("costPrice")) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Sale price cannot be less than cost price")
                );
              },
            }),
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Stock Quantity"
          name="productStock"
          rules={[
            { required: true, message: "Please enter stock quantity" },
            {
              type: "number",
              min: 0,
              message: "Stock must be a positive number",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="productCategory"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select placeholder="Select a category">
            {categories.map((cat) => (
              <Select.Option key={cat._id} value={cat._id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="productDescription"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Product Image"
          name="productImage"
          rules={[{ required: true, message: "Please upload product image" }]}
        >
          <Upload
            beforeUpload={() => false} // prevent automatic upload
            onChange={handleUploadChange}
            accept=".png,.jpg,.jpeg,.gif"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            {loading ? <Spin /> : "Add Product"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
