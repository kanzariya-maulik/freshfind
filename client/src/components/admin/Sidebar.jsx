import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  UserOutlined,
  GiftOutlined,
  PictureOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = ({ isSidebarToggled }) => {
  const location = useLocation();

  const menuItems = [
    { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/admin/products", icon: <AppstoreOutlined />, label: "Products" },
    { key: "/admin/reviews", icon: <StarOutlined />, label: "Reviews" },
    { key: "/admin/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
    { key: "/admin/categories", icon: <TagsOutlined />, label: "Categories" },
    { key: "/admin/users", icon: <UserOutlined />, label: "Users" },
    { key: "/admin/offers", icon: <GiftOutlined />, label: "Offers" },
    { key: "/admin/banners", icon: <PictureOutlined />, label: "Banners" },
    {
      key: "/admin/responses",
      icon: <MailOutlined />,
      label: "Response Management",
    },
    {
      key: "/admin/site-settings",
      icon: <SettingOutlined />,
      label: "Site Settings",
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={isSidebarToggled}
      width={250}
      style={{ background: "#FAFAF9", marginTop: 100 }}
    >
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: "100%", borderRight: 0 }}
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
