import { useState } from "react";
import { Link } from "react-router-dom";
import { message, Form, InputNumber, Button, Card, Typography } from "antd";

const { Title } = Typography;

const UpdateCart = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      message.success("Cart record updated successfully");
      setLoading(false);
    }, 500); // simulate API call
  };

  return (
    <div>
      <Title level={2} className="mt-4">
        Update Cart
      </Title>

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <Link to="/admin">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/users">Users</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/cart">Cart</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Update Cart
          </li>
        </ol>
      </nav>

      <h5>User: John Doe</h5>

      <Card>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ quantity: 2 }}
        >
          <Form.Item label="Product">
            <input
              type="text"
              className="form-control"
              value="Product A"
              disabled
            />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              { required: true, message: "Quantity is required" },
              {
                type: "number",
                min: 1,
                message: "Quantity must be at least 1",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Cart
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateCart;
