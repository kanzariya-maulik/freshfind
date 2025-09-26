import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Form, Select, InputNumber, Button } from "antd";

const AddToCart = () => {
  const { userId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products.");
      }
    };
    fetchProducts();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/cart", {
        userId,
        productId: values.productId,
        quantity: values.quantity,
      });
      toast.success("Product added to cart successfully!");
      form.resetFields();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Add Product to Cart</h1>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <Link to="/admin">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/users">Users</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/admin/cart/${userId}`}>Cart</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Add Product to Cart
          </li>
        </ol>
      </nav>
      <h5>User ID: {userId}</h5>

      <div className="card mb-4">
        <div className="card-body">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ quantity: 1 }}
          >
            <Form.Item
              label="Product"
              name="productId"
              rules={[{ required: true, message: "Please select a product" }]}
            >
              <Select placeholder="Select Product">
                {products.map((prod) => (
                  <Select.Option key={prod._id} value={prod._id}>
                    {prod.productName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                { required: true, message: "Please enter quantity" },
                {
                  type: "number",
                  min: 1,
                  message: "Quantity must be at least 1",
                },
              ]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add to Cart
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
