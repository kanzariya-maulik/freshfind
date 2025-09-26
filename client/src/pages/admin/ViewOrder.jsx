import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, Card, Descriptions, Divider, Image, Spin } from "antd";
import axios from "axios";

const ViewOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/orders/${orderId}`);
        const { order, orderItems } = res.data;
        setOrder(order);
        setProducts(orderItems || []);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <Spin tip="Loading..." style={{ marginTop: 50 }} />;
  if (!order) return <div>Order not found.</div>;

  // Safely parse decimal values
  const shippingCharge = parseFloat(order.shippingCharge?.$numberDecimal || 0);
  const total = parseFloat(order.total?.$numberDecimal || 0);
  let actualTotal = 0;

  const columns = [
    {
      title: "Item Image",
      dataIndex: ["productId", "productImage"],
      key: "image",
      render: (src, record) => (
        <Image width={50} src={src} alt={record.productId.productName} />
      ),
    },
    {
      title: "Item Name",
      dataIndex: ["productId", "productName"],
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        `₹${parseFloat(price?.$numberDecimal || 0).toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => {
        const price = parseFloat(record.price?.$numberDecimal || 0);
        const totalItem = price * record.quantity;
        actualTotal += totalItem;
        return `₹${totalItem.toFixed(2)}`;
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h1>View Order</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/orders">Orders</Link>
            </li>
            <li className="breadcrumb-item active">View Order</li>
          </ol>
        </div>
      </div>

      {/* Order Details */}
      <Card title="Order Details" style={{ marginBottom: 24 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Order ID">{order._id}</Descriptions.Item>
          <Descriptions.Item label="Status">
            {order.orderStatus}
          </Descriptions.Item>
          <Descriptions.Item label="Order Date">
            {new Date(order.orderDate).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Mode">
            {order.paymentMode}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            {order.paymentStatus}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Shipping Address */}
        <Card title="Shipping Address" style={{ flex: 1, minWidth: 300 }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">
              {order.delAddressId.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {order.delAddressId.address}
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {order.delAddressId.city}
            </Descriptions.Item>
            <Descriptions.Item label="State">
              {order.delAddressId.state}
            </Descriptions.Item>
            <Descriptions.Item label="Zip Code">
              {order.delAddressId.pincode}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {order.delAddressId.phone}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* User Information */}
        <Card title="User Information" style={{ flex: 1, minWidth: 300 }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">
              {order.userId.firstName} {order.userId.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {order.userId.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {order.userId.mobile}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      {/* Ordered Items */}
      <Card title="Ordered Items" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={products}
          pagination={false}
          rowKey={(record) => record.productId._id}
          footer={() => (
            <>
              <div style={{ textAlign: "right", marginTop: 12 }}>
                <div>Subtotal: ₹{actualTotal.toFixed(2)}</div>
                {actualTotal + shippingCharge - total > 0 && (
                  <div style={{ color: "red" }}>
                    Total Discount: -₹
                    {(actualTotal + shippingCharge - total).toFixed(2)}
                  </div>
                )}
                <div>Shipping Charge: ₹{shippingCharge.toFixed(2)}</div>
                <Divider />
                <div>
                  <strong>Total: ₹{total.toFixed(2)}</strong>
                </div>
              </div>
            </>
          )}
        />
      </Card>
    </div>
  );
};

export default ViewOrder;
