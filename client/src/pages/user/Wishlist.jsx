import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spin, Typography } from "antd";
import WishlistTable from "../../components/user/WishlistTable";

const { Paragraph, Title } = Typography;

const Wishlist = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id);
    } else {
      navigate("/login"); // Redirect to login if user not found
    }
  }, [navigate]);

  return (
    <div className="container cart-table">
      <Paragraph className="my-4">
        <Link to="/" className="dim link">
          Home /
        </Link>{" "}
        Wishlist
      </Paragraph>

      {userId ? (
        <WishlistTable userId={userId} />
      ) : (
        <div className="text-center my-5">
          <Spin size="large" tip="Loading your wishlist..." />
        </div>
      )}
    </div>
  );
};

export default Wishlist;
