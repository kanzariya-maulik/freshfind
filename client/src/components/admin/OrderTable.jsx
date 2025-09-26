import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Input, Button, Space, Popconfirm } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [filterText, setFilterText] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/orders/active");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`http://localhost:8000/orders/${orderId}/delete`);
        Swal.fire("Deleted!", "Order has been deleted.", "success");
        fetchOrders();
      } catch (error) {
        Swal.fire("Error", "Failed to delete order.", "error");
      }
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Customer Name",
      key: "customer",
      render: (_, row) =>
        `${row.userId?.firstName || ""} ${row.userId?.lastName || ""}`,
      sorter: (a, b) => {
        const nameA = `${a.userId?.firstName || ""} ${
          a.userId?.lastName || ""
        }`;
        const nameB = `${b.userId?.firstName || ""} ${
          b.userId?.lastName || ""
        }`;
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: "Shipping (₹)",
      dataIndex: "shippingCharge",
      key: "shippingCharge",
      render: (val) => parseFloat(val?.["$numberDecimal"] || 0).toFixed(2),
      sorter: (a, b) =>
        parseFloat(a.shippingCharge?.["$numberDecimal"] || 0) -
        parseFloat(b.shippingCharge?.["$numberDecimal"] || 0),
    },
    {
      title: "Total Price (₹)",
      dataIndex: "total",
      key: "total",
      render: (val) => parseFloat(val?.["$numberDecimal"] || 0).toFixed(2),
      sorter: (a, b) =>
        parseFloat(a.total?.["$numberDecimal"] || 0) -
        parseFloat(b.total?.["$numberDecimal"] || 0),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <Space size="middle">
          <Link to={`/admin/view-order/${row._id}`}>
            <Button icon={<EyeOutlined />} type="primary" size="small">
              View
            </Button>
          </Link>
          <Link to={`/admin/update-order/${row._id}`}>
            <Button icon={<EditOutlined />} type="default" size="small">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this order?"
            onConfirm={() => handleDelete(row._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredOrders = orders.filter((item) =>
    Object.values({
      _id: item._id,
      firstName: item.userId?.firstName,
      lastName: item.userId?.lastName,
      orderDate: new Date(item.orderDate).toLocaleDateString(),
      shippingCharge: item.shippingCharge?.$numberDecimal,
      total: item.total?.$numberDecimal,
      orderStatus: item.orderStatus,
    })
      .join(" ")
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  return (
    <div>
      <Input
        placeholder="Search orders..."
        prefix={<SearchOutlined />}
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default OrderTable;
