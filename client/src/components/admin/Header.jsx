import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Layout,
  Menu,
  Dropdown,
  Button,
  Space,
  Typography,
  Avatar,
} from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/admin/my-profile">My Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Button type="text" onClick={handleLogout} style={{ padding: 0 }}>
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#F97316",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Space align="center">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={toggleSidebar}
          style={{ color: "#fff", fontSize: 18 }}
        />
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: 600 }}>
          FRESH FIND
        </Text>
      </Space>

      <Dropdown overlay={menu} placement="bottomRight">
        <Space style={{ cursor: "pointer" }}>
          <Avatar icon={<UserOutlined />} />
          <Text style={{ color: "#fff" }}>Admin</Text>
        </Space>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;
