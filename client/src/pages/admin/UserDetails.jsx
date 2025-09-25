import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const UserDetails = () => {
  const user = {
    First_Name: "John",
    Last_Name: "Doe",
    Email: "john.doe@example.com",
    Mobile_No: "1234567890",
    Active_Status: 1,
  };

  const [status, setStatus] = useState(user.Active_Status);
  const orders = [
    {
      Order_Id: "1001",
      Order_Date: "2025-03-10",
      Total_Quantity: 3,
      Total_Price: 150,
      Order_Status: "Delivered",
    },
    {
      Order_Id: "1002",
      Order_Date: "2025-03-11",
      Total_Quantity: 2,
      Total_Price: 200,
      Order_Status: "Pending",
    },
  ];

  const handleStatusChange = (newStatus) => {
    Swal.fire({
      title: newStatus ? "Activate Account?" : "Deactivate Account?",
      text: newStatus ? "Are you sure you want to activate this account?" : "Are you sure you want to deactivate this account? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus ? "#28a745" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: newStatus ? "Activate" : "Deactivate",
    }).then((result) => {
      if (result.isConfirmed) {
        setStatus(newStatus);
        Swal.fire(
          newStatus ? "Activated!" : "Deactivated!",
          `The account has been ${newStatus ? "activated" : "deactivated"}.`,
          "success"
        );
      }
    });
  };
   const handleDelete = () => {
          Swal.fire({
              title: "Are you sure?",
              text: `Do you want to delete this order? This action cannot be undone!`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "Yes, delete it!",
          }).then((result) => {
              if (result.isConfirmed) {
                  Swal.fire("Deleted!", "order has been removed.", "success");
              }
          });
      };

  return (
    <div>
      <h1 className="mt-4">User Details</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
        <li className="breadcrumb-item active">User Details</li>
      </ol>

      <div className="card mb-4">
        <div className="card-header">
          <h4>User Information</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Username:</strong> {user.First_Name} {user.Last_Name}</p>
              <p><strong>Email:</strong> {user.Email}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Phone Number:</strong> {user.Mobile_No}</p>
              <p><strong>Status:</strong> {status === 1 ? "Active" : "Inactive"}</p>
            </div>
          </div>
          <Link className="btn btn-primary mt-3" to="/admin/update-user">Edit User Info</Link>
          {status === 1 ? (
            <button className="btn btn-danger mt-3 ms-2" onClick={() => handleStatusChange(0)}>
              Deactivate Account
            </button>
          ) : (
            <button className="btn btn-success mt-3 ms-2" onClick={() => handleStatusChange(1)}>
              Activate Account
            </button>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h4>User Orders</h4>
        </div>
        <div className="card-body">
          <table className="table border text-nowrap">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.Order_Id}>
                    <td>{order.Order_Id}</td>
                    <td>{order.Order_Date}</td>
                    <td>{order.Total_Quantity}</td>
                    <td>₹{order.Total_Price.toFixed(2)}</td>
                    <td>{order.Order_Status}</td>
                    <td>
                      <Link to="/admin/view-order" className="btn btn-info btn-sm me-1">View</Link>
                      <Link to="/admin/update-order" className="btn btn-primary btn-sm me-1">Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
