import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Layout,
  Menu,
  Dropdown,
  Badge,
  Avatar,
  Input,
  Button,
  Space,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";

const { Text } = Typography;

const { Header: AntHeader } = Layout;

const Header = () => {
  const {
    isLoggedIn,
    logout,
    user,
    cartCount,
    wishlistCount,
    searchQuery,
    setSearchQuery,
  } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const validateSearch = (e) => {
    e.preventDefault();
    navigate("/shop");
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/account">My Profile</Link>
      </Menu.Item>
      <Menu.Item key="orders">
        <Link to="/order-history">Your Orders</Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Button type="text" onClick={handleLogout}>
          Log out
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader style={{ background: "#FAFAF9", padding: "0 2rem" }}>
      <div className="d-flex justify-content-between align-items-center">
        <Text className="logo fs-1 fw-bold" style={{ color: "#FF8C00" }} to="/">
          F<Text style={{ fontSize: "1.75rem", color: "#FF8C00" }}>resh</Text> F
          <Text style={{ fontSize: "1.75rem", color: "#FF8C00" }}>ind</Text>
        </Text>

        <Space align="center">
          <form onSubmit={validateSearch}>
            <Input
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 250 }}
              suffix={<SearchOutlined onClick={validateSearch} />}
            />
          </form>

          {isLoggedIn ? (
            <Space size="middle">
              <Dropdown overlay={profileMenu} placement="bottomRight">
                <Space style={{ cursor: "pointer" }}>
                  <Avatar
                    src={user?.profilePicture || null}
                    icon={!user?.profilePicture && <UserOutlined />}
                  />
                  {user?.firstName || "User"}
                </Space>
              </Dropdown>

              <Link to="/wishlist">
                <Badge count={wishlistCount} offset={[0, 0]}>
                  <HeartOutlined style={{ fontSize: "20px" }} />
                </Badge>
              </Link>

              <Link to="/cart">
                <Badge count={cartCount} offset={[0, 0]}>
                  <ShoppingCartOutlined style={{ fontSize: "20px" }} />
                </Badge>
              </Link>
            </Space>
          ) : (
            <Space>
              <Link to="/register">
                <Button type="primary">Register</Button>
              </Link>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </Space>
          )}
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;
