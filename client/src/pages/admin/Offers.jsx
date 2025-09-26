import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Tag,
  Input,
  Button,
  Space,
  Card,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/offers");
      setOffers(res.data);
    } catch {
      message.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/offers/${id}`);
      message.success("Offer deleted successfully");
      fetchOffers();
    } catch (err) {
      message.error("Failed to delete offer");
    }
  };

  const filteredOffers = offers.filter((offer) =>
    Object.values(offer)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Offer Description",
      dataIndex: "offerDescription",
      key: "offerDescription",
      sorter: (a, b) => a.offerDescription.localeCompare(b.offerDescription),
    },
    {
      title: "Offer Code",
      dataIndex: "offerCode",
      key: "offerCode",
      sorter: (a, b) => a.offerCode.localeCompare(b.offerCode),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => `${discount}%`,
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: "Minimum Order",
      dataIndex: "minimumOrder",
      key: "minimumOrder",
      render: (amount) => `₹${parseFloat(amount).toFixed(2)}`,
      sorter: (a, b) => a.minimumOrder - b.minimumOrder,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const now = new Date();
        const start = new Date(record.startDate);
        const end = new Date(record.endDate);
        const isActive = now >= start && now <= end;
        return (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "Active" : "Expired"}
          </Tag>
        );
      },
      filters: [
        { text: "Active", value: "Active" },
        { text: "Expired", value: "Expired" },
      ],
      onFilter: (value, record) => {
        const now = new Date();
        const start = new Date(record.startDate);
        const end = new Date(record.endDate);
        const isActive = now >= start && now <= end;
        return (isActive ? "Active" : "Expired") === value;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/update-offer/${record._id}`}>
            <Button icon={<EditOutlined />} type="primary" size="small">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure you want to delete this offer?"
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <div>
          <h1>Offers Management</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Offers</li>
          </ol>
        </div>
        <Link to="/admin/add-offer">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Offer
          </Button>
        </Link>
      </div>

      <Card>
        <Input.Search
          placeholder="Search offers..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
          allowClear
        />
        <Table
          columns={columns}
          dataSource={filteredOffers}
          rowKey={(record) => record._id}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Offers;
