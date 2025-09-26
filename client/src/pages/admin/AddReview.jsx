import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Form, Input, Select, Button } from "antd";

const { TextArea } = Input;

const AddReview = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, userRes] = await Promise.all([
          axios.get("http://localhost:8000/products"),
          axios.get("http://localhost:8000/users"),
        ]);
        setProducts(productRes.data);
        setUsers(userRes.data);
      } catch (err) {
        toast.error("Failed to load products or users.");
      }
    };

    fetchData();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/reviews", values);
      toast.success("Review submitted successfully!");
      navigate("/admin/reviews");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mt-4">Add Review</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/reviews">Reviews</Link>
        </li>
        <li className="breadcrumb-item active">Add Review</li>
      </ol>

      <div className="card">
        <div className="card-body">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Product"
              name="productId"
              rules={[{ required: true, message: "Please select a product" }]}
            >
              <Select placeholder="Select a product">
                {products.map((product) => (
                  <Select.Option key={product._id} value={product._id}>
                    {product.productName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="User"
              name="userId"
              rules={[{ required: true, message: "Please select a user" }]}
            >
              <Select placeholder="Select a user">
                {users.map((user) => (
                  <Select.Option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: "Please select a rating" }]}
            >
              <Select placeholder="Select a rating">
                {[1, 2, 3, 4, 5].map((val) => (
                  <Select.Option key={val} value={val}>
                    {val} Star{val > 1 ? "s" : ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Review"
              name="review"
              rules={[
                { required: true, message: "Please write a review" },
                { min: 10, message: "Review must be at least 10 characters" },
                { max: 500, message: "Review cannot exceed 500 characters" },
              ]}
            >
              <TextArea rows={4} placeholder="Write your review" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit Review
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
