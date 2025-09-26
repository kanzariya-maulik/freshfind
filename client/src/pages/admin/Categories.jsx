import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Image,
  Space,
  Popconfirm,
  message,
  Row,
  Col,
  Typography,
  Breadcrumb,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:8000/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (categoryId) => {
    setDeletingCategoryId(categoryId);
    try {
      await axios.delete(`http://localhost:8000/categories/${categoryId}`);
      setCategories(categories.filter((c) => c._id !== categoryId));
      message.success("Category deleted successfully");
    } catch (error) {
      message.error("Failed to delete category");
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const filteredCategories = categories.filter((c) =>
    (c.name || "").toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Category ID",
      dataIndex: "_id",
      key: "_id",
      width: "20%",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "20%",
      render: (img, record) => (
        <Image width={75} height={75} src={img} alt={record.name} />
      ),
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Category Color",
      dataIndex: "color",
      key: "color",
      width: "20%",
      render: (color) => (
        <div
          style={{
            backgroundColor: color,
            width: 40,
            height: 40,
            borderRadius: "50%",
          }}
          title={`Color: ${color}`}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/update-category/${record._id}`}>
            <Button type="primary" icon={<EditOutlined />} size="small">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deletingCategoryId === record._id}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>Categories</Title>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/admin">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Categories</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col>
          <Link to="/admin/add-category">
            <Button type="primary">Add Category</Button>
          </Link>
        </Col>
      </Row>

      <Input
        placeholder="Search categories..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Categories;
