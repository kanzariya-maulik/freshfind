import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Card,
  Typography,
  message,
  Space,
} from "antd";
import axios from "axios";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

const UpdateOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchOrder();
  }, [orderId]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
    } catch (err) {
      message.error("Failed to load users.");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/products");
      setProductsList(res.data);
    } catch (err) {
      message.error("Failed to load products.");
    }
  };

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/orders/${orderId}`);
      const { order, orderItems } = res.data;

      form.setFieldsValue({
        userId: order.userId._id,
        orderDate: moment(order.orderDate),
        firstName: order.delAddressId.fullName.split(" ")[0],
        lastName: order.delAddressId.fullName.split(" ")[1] || "",
        address: order.delAddressId.address,
        city: order.delAddressId.city,
        state: order.delAddressId.state,
        pinCode: order.delAddressId.pincode,
        phone: order.delAddressId.phone,
        shippingCharge: parseFloat(order.shippingCharge.$numberDecimal),
        status: order.orderStatus,
        products: orderItems.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
      });
    } catch (err) {
      message.error("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      // First create/update address
      const addressData = {
        fullName: `${values.firstName} ${values.lastName}`,
        userId: values.userId,
        address: values.address,
        city: values.city,
        state: values.state,
        pincode: values.pinCode,
        phone: values.phone,
      };
      const addressRes = await axios.post(
        "http://localhost:8000/addresses",
        addressData
      );

      if (!addressRes.data._id) {
        message.error("Failed to update address.");
        return;
      }

      const orderData = {
        userId: values.userId,
        orderDate: values.orderDate.format("YYYY-MM-DD"),
        orderStatus: values.status,
        products: values.products,
        shippingCharge: values.shippingCharge,
        delAddressId: addressRes.data._id,
      };

      const orderRes = await axios.put(
        `http://localhost:8000/orders/${orderId}`,
        orderData
      );

      if (orderRes.status === 200) {
        message.success("Order updated successfully!");
        navigate("/admin/orders");
      } else {
        message.error("Failed to update order.");
      }
    } catch (err) {
      console.error(err);
      message.error("An error occurred while updating the order.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Title level={2} className="mt-4">
        Update Order
      </Title>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/orders">Orders</Link>
        </li>
        <li className="breadcrumb-item active">Update Order</li>
      </ol>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ products: [{ productId: "", quantity: 1 }] }}
        >
          <Form.Item
            label="User"
            name="userId"
            rules={[{ required: true, message: "Please select a user." }]}
          >
            <Select placeholder="Select User">
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.firstName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Order Date"
            name="orderDate"
            rules={[{ required: true, message: "Please select order date." }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" className="mb-2">
                    <Form.Item
                      {...field}
                      name={[field.name, "productId"]}
                      fieldKey={[field.fieldKey, "productId"]}
                      rules={[{ required: true, message: "Select product" }]}
                    >
                      <Select
                        placeholder="Select Product"
                        style={{ width: 200 }}
                      >
                        {productsList.map((p) => (
                          <Option key={p._id} value={p._id}>
                            {p.productName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "quantity"]}
                      fieldKey={[field.fieldKey, "quantity"]}
                      rules={[
                        {
                          required: true,
                          type: "number",
                          min: 1,
                          message: "Quantity must be at least 1",
                        },
                      ]}
                    >
                      <InputNumber min={1} placeholder="Quantity" />
                    </Form.Item>

                    <Button type="danger" onClick={() => remove(field.name)}>
                      Delete
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Another Product
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Title level={4}>Shipping Details</Title>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="City" name="city" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="State" name="state" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Pin Code"
            name="pinCode"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Shipping Charge"
            name="shippingCharge"
            rules={[{ required: true, type: "number", min: 0 }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Order Status"
            name="status"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Shipped">Shipped</Option>
              <Option value="Delivered">Delivered</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Order
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateOrder;
