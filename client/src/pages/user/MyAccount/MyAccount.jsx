import React, { useState, useEffect } from "react";
import { Tabs, Card, Row, Col, Divider, message } from "antd";
import axios from "axios";
import UpdatePasswordForm from "./UpdatePasswordForm";
import UpdateProfileForm from "./UpdateProfileForm";
import WishlistTable from "../../../components/user/WishlistTable";
import OrdersTable from "../../../components/user/OrdersTable";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const { TabPane } = Tabs;

const MyAccount = () => {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const notification = location.state?.message;
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/${user._id}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error(error);
        message.error("Failed to load profile");
      }
    };
    fetchUserData();

    if (notification) message.success(notification);
  }, []);

  return (
    <div className="container mt-5">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <p>
            <a href="/" className="text-decoration-none dim link">
              Home /
            </a>{" "}
            Account
          </p>
        </Col>
        <Col>
          <p>
            Welcome!{" "}
            <span className="highlight">{user?.firstName || "User"}</span>
          </p>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} md={24}>
          <Card>
            <Tabs defaultActiveKey="my-profile" type="card">
              <TabPane tab="My Profile" key="my-profile">
                <Divider orientation="left">Edit Your Profile</Divider>
                {userData && <UpdateProfileForm userData={userData} />}

                <Divider orientation="left">Change Password</Divider>
                {userData && <UpdatePasswordForm email={userData.email} />}
              </TabPane>

              <TabPane tab="My Orders" key="all-orders">
                <Divider orientation="left">All Orders</Divider>
                <OrdersTable userId={userData?._id} />
              </TabPane>

              <TabPane tab="My Wishlist" key="my-wishlist">
                <Divider orientation="left">Wishlist</Divider>
                <WishlistTable userId={userData?._id} />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyAccount;
