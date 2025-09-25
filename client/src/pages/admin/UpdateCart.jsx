import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateCart = () => {
  const [quantity, setQuantity] = useState(2);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    if (quantity < 1) formErrors.quantity = "Quantity must be at least 1";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success("Cart record updated successfully");
    }
  };

  return (
    <div>
      <h1 className="mt-4">Update Cart</h1>
      <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to="/admin/users">Users</Link></li>
                    <li className="breadcrumb-item"><Link to="/admin/cart">Cart</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Update Cart</li>
                </ol>
            </nav>
      <h5>User: John Doe</h5>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Product</label>
              <input type="text" className="form-control" value="Product A" disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              {errors.quantity && <div className="text-danger">{errors.quantity}</div>}
            </div>
            <button type="submit" className="btn btn-secondary">Update Cart</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCart;