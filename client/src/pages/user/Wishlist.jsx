import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WishlistTable from "../../components/user/WishlistTable";

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
      <p className="my-5">
        <Link to="/" className="text-decoration-none dim link">Home /</Link> Wishlist
      </p>
      {userId ? <WishlistTable userId={userId} /> : <p>Loading...</p>}
    </div>
  );
};

export default Wishlist;
