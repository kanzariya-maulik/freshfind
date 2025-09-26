import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Image,
  Typography,
  Row,
  Col,
  message,
  Breadcrumb,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("http://localhost:8000/banners");
        setBanners(response.data);
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch banners.");
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleDelete = async (bannerId) => {
    try {
      await axios.delete(`http://localhost:8000/banners/${bannerId}`);
      setBanners((prev) => prev.filter((b) => b._id !== bannerId));
      message.success("Banner deleted successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete the banner.");
    }
  };

  const freeDeliveryBanners = banners.filter((b) => b.type === "freeDelivery");
  const firstOrderBanners = banners.filter((b) => b.type === "firstOrder");
  const sliderBanners = banners.filter((b) => b.type === "slider");

  const sliderColumns = [
    {
      title: "Image",
      dataIndex: "bannerImage",
      key: "image",
      render: (url) => <Image width={150} src={url} />,
    },
    {
      title: "View Order",
      dataIndex: "viewOrder",
      key: "viewOrder",
      sorter: (a, b) => a.viewOrder - b.viewOrder,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Link to={`/admin/update-banner/${record._id}`}>
            <Button type="default" icon={<EditOutlined />}>
              Edit
            </Button>
          </Link>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const renderBannerTable = (bannersArray) => (
    <Table
      dataSource={bannersArray}
      rowKey="_id"
      pagination={false}
      columns={[
        {
          title: "Image",
          dataIndex: "bannerImage",
          key: "image",
          render: (url) => <Image width={200} src={url} />,
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <Link to={`/admin/update-banner/${record._id}`}>
              <Button type="default" icon={<EditOutlined />}>
                Edit
              </Button>
            </Link>
          ),
        },
      ]}
    />
  );

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>Banner Management</Title>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/admin">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Banners</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col>
          <Link to="/admin/add-banner">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Banner
            </Button>
          </Link>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Title level={5}>Free Delivery Banners</Title>
          {renderBannerTable(freeDeliveryBanners)}
        </Col>
        <Col xs={24} md={12}>
          <Title level={5}>First Order Banners</Title>
          {renderBannerTable(firstOrderBanners)}
        </Col>
      </Row>

      <div style={{ marginTop: 32 }}>
        <Title level={5}>Slider Banners</Title>
        <Table
          dataSource={sliderBanners}
          rowKey="_id"
          loading={loading}
          columns={sliderColumns}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default Banners;
