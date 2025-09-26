import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  InputNumber,
  Space,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddOrder = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Step 1: Create Address
      const addressData = {
        fullName: values.firstName + " " + values.lastName,
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
      const addressId = addressRes.data._id;

      // Step 2: Create Order
      const orderData = {
        userId: values.userId,
        orderDate: values.orderDate.format("YYYY-MM-DD"),
        orderStatus: values.status,
        shippingCharge: parseFloat(values.shippingCharge),
        delAddressId: addressId,
        products: values.products.map((p) => ({
          productId: p.productId,
          quantity: parseInt(p.quantity),
        })),
      };

      await axios.post("http://localhost:8000/orders", orderData);

      toast.success("Order added successfully!");
      navigate("/admin/orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
        <div>
          <h1>Add New Order</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/orders">Orders</Link>
            </li>
            <li className="breadcrumb-item active">Add Order</li>
          </ol>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          products: [{ productId: "", quantity: 1 }],
          status: "Pending",
          shippingCharge: 0,
        }}
      >
        <Form.Item
          name="userId"
          label="User"
          rules={[{ required: true, message: "Please select a user" }]}
        >
          <Select placeholder="Select User">
            {users.map((u) => (
              <Option key={u._id} value={u._id}>
                {u.firstName} {u.lastName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="orderDate"
          label="Order Date"
          rules={[{ required: true, message: "Please select order date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.List name="products">
          {(fields, { add, remove }) => (
            <div>
              {fields.map((field) => (
                <Space
                  key={field.key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...field}
                    name={[field.name, "productId"]}
                    fieldKey={[field.fieldKey, "productId"]}
                    rules={[{ required: true, message: "Select product" }]}
                  >
                    <Select placeholder="Select Product" style={{ width: 200 }}>
                      {products.map((p) => (
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
                      { required: true, message: "Enter quantity" },
                      {
                        type: "number",
                        min: 1,
                        message: "Quantity must be at least 1",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Quantity" min={1} />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Product
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>

        <h4>Shipping Details</h4>
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="pinCode" label="Pin Code" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="shippingCharge"
          label="Shipping Charge"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Order Status"
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
            Submit Order
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddOrder;
