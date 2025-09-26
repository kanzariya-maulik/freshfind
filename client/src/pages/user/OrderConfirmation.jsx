import { Link } from "react-router-dom";
import { Result, Button, Space } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const OrderConfirmation = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh", padding: "2rem" }}
    >
      <Result
        icon={
          <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "48px" }} />
        }
        title="Thank you for ordering!"
        subTitle="Your order has been successfully placed and will be processed shortly."
        extra={
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Link to="/order-history">
              <Button type="primary" block>
                View Orders
              </Button>
            </Link>
            <Link to="/shop">
              <Button block>Continue Shopping</Button>
            </Link>
          </Space>
        }
      />
    </div>
  );
};

export default OrderConfirmation;
