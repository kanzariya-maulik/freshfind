import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Form, Input, Button, Select, message, Card } from "antd";
import axios from "axios";

const { TextArea } = Input;

const UpdateReview = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/reviews/${id}`);
        const review = res.data;

        setProductName(review.productId.productName);
        setUserName(`${review.userId.firstName} ${review.userId.lastName}`);

        form.setFieldsValue({
          rating: review.rating,
          review: review.review,
        });
      } catch (err) {
        console.error(err);
        message.error("Failed to load review.");
      }
    };

    fetchReview();
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/reviews/${id}`, values);
      message.success("Review updated successfully!");
      navigate("/admin/reviews");
    } catch (err) {
      console.error(err);
      message.error("Failed to update review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mt-4">Update Review</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/reviews">Reviews</Link>
        </li>
        <li className="breadcrumb-item active">Update Review</li>
      </ol>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ rating: "", review: "" }}
        >
          <Form.Item label="Product">
            <Input value={productName} disabled />
          </Form.Item>

          <Form.Item label="User">
            <Input value={userName} disabled />
          </Form.Item>

          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please select a rating." }]}
          >
            <Select placeholder="Select a rating">
              {[1, 2, 3, 4, 5].map((num) => (
                <Select.Option key={num} value={num}>
                  {num} Star{num > 1 ? "s" : ""}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="review"
            label="Review"
            rules={[
              { required: true, message: "Review is required." },
              { min: 10, message: "Review must be at least 10 characters." },
              { max: 500, message: "Review cannot exceed 500 characters." },
            ]}
          >
            <TextArea rows={4} placeholder="Enter your review" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Review
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateReview;
