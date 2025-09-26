import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Typography, Button, Space } from "antd";
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import OrderTable from "../../components/admin/OrderTable";
import axios from "axios";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalActiveProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalActiveUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/dashboard");
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchStats();
  }, []);

  const {
    totalActiveProducts,
    totalOrders,
    totalCategories,
    totalActiveUsers,
  } = stats;

  const cardData = [
    {
      title: "Total Products",
      value: totalActiveProducts,
      icon: <AppstoreOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
      link: "/admin/products",
      color: "#e6f7ff",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCartOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
      link: "/admin/orders",
      color: "#f6ffed",
    },
    {
      title: "Total Categories",
      value: totalCategories,
      icon: <TagsOutlined style={{ fontSize: 32, color: "#faad14" }} />,
      link: "/admin/categories",
      color: "#fffbe6",
    },
    {
      title: "Total Active Users",
      value: totalActiveUsers,
      icon: <UserOutlined style={{ fontSize: 32, color: "#f5222d" }} />,
      link: "/admin/users",
      color: "#fff1f0",
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Admin Dashboard
      </Title>

      <Row gutter={[16, 16]}>
        {cardData.map((card) => (
          <Col xs={24} sm={12} md={12} lg={6} key={card.title}>
            <Link to={card.link}>
              <Card
                style={{ backgroundColor: card.color, cursor: "pointer" }}
                hoverable
              >
                <Space
                  align="center"
                  style={{ justifyContent: "space-between", width: "100%" }}
                >
                  <div>
                    <Text strong>{card.title}</Text>
                    <Title level={3} style={{ margin: 0 }}>
                      {card.value}
                    </Title>
                  </div>
                  {card.icon}
                </Space>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Recent Orders Section */}
      <Card
        title="Recent Orders"
        extra={
          <Link to="/admin/orders">
            <Button type="default">See All Orders</Button>
          </Link>
        }
        style={{ marginTop: 24 }}
      >
        <OrderTable />
      </Card>
    </div>
  );
};

export default Dashboard;
