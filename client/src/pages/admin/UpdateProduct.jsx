import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Form, Input, InputNumber, Select, Button, Upload, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [oldImageUrl, setOldImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/products/${id}`);
        const product = res.data;

        form.setFieldsValue({
          productName: product.productName,
          productDiscount: product.discount,
          costPrice: product.costPrice,
          salePrice: product.salePrice,
          productStock: product.stock,
          productCategory: product.categoryId?._id,
          productDescription: product.description,
        });

        setOldImageUrl(product.productImage || null);
      } catch (err) {
        message.error("Failed to load product");
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/categories");
        setCategories(res.data);
      } catch (err) {
        message.error("Failed to load categories");
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id, form]);

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("discount", values.productDiscount);
      formData.append("costPrice", values.costPrice);
      formData.append("salePrice", values.salePrice);
      formData.append("stock", values.productStock);
      formData.append("categoryId", values.productCategory);
      formData.append("description", values.productDescription);

      if (values.productImage && values.productImage[0]?.originFileObj) {
        formData.append("productImage", values.productImage[0].originFileObj);
      }

      await axios.put(`http://localhost:8000/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      message.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mt-4">Update Product</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
        <li className="breadcrumb-item"><Link to="/admin/products">Products</Link></li>
        <li className="breadcrumb-item active">Update Product</li>
      </ol>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          encType="multipart/form-data"
        >
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[
              { required: true, message: "Product name is required" },
              { min: 3, message: "Product name must be at least 3 characters" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Discount (%)"
            name="productDiscount"
            rules={[
              { required: true, message: "Discount is required" },
              { type: "number", min: 1, max: 100, message: "Discount must be 1-100%" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} max={100} />
          </Form.Item>

          <Form.Item
            label="Cost Price"
            name="costPrice"
            rules={[{ required: true, message: "Cost price is required" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Sale Price"
            name="salePrice"
            rules={[
              { required: true, message: "Sale price is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value >= getFieldValue("costPrice")) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Sale price cannot be less than cost price"));
                },
              }),
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Stock Quantity"
            name="productStock"
            rules={[
              { required: true, message: "Stock is required" },
              { type: "number", min: 0, message: "Stock must be non-negative" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="productCategory"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Select placeholder="Select category">
              {categories.map(cat => (
                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Description"
            name="productDescription"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Product Image"
            name="productImage"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              beforeUpload={() => false} // Prevent auto upload
              listType="picture"
              maxCount={1}
              onRemove={() => setFileList([])}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {oldImageUrl && (
              <div className="mt-2">
                <small>Current Image:</small>
                <br />
                <img src={oldImageUrl} alt="Current" height="150px" />
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Update Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateProduct;
