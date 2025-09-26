import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Input,
  Card,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/products");
      setProducts(res.data);
    } catch (err) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/products/${id}`);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      message.error("Failed to delete product");
    }
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <img
            src={record.productImage}
            alt={record.productName}
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
          <span className="ms-2">{record.productName}</span>
        </div>
      ),
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Price (₹)",
      dataIndex: "salePrice",
      key: "salePrice",
      sorter: (a, b) => parseFloat(a.salePrice) - parseFloat(b.salePrice),
      render: (price) => `₹${parseFloat(price).toFixed(2)}`,
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => <Tag color={stock > 0 ? "green" : "red"}>{stock}</Tag>,
    },
    {
      title: "Category",
      dataIndex: ["categoryId", "name"],
      key: "category",
      render: (_, record) => record.categoryId?.name || "N/A",
      sorter: (a, b) =>
        (a.categoryId?.name || "").localeCompare(b.categoryId?.name || ""),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/update-product/${record._id}`}>
            <Button icon={<EditOutlined />} type="primary" size="small">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} type="danger" size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Filter products based on search
  const filteredProducts = products.filter((p) =>
    Object.values(p).join(" ").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <div>
          <h1>Products</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Products</li>
          </ol>
        </div>
        <Link to="/admin/add-product">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <Input
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-3"
        />
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey={(record) => record._id}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default ProductList;
