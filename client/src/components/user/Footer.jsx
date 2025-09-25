import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const Footer = (props) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email); // Simple email validation
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        // Required field validation
        if (!value.trim()) {
            setError("Email is required");
        } else if (!validateEmail(value)) {
            setError("Please enter a valid email address");
        } else {
            setError("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setError("Email is required");
            toast.error("Email is required!");
        } else if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            toast.error("Invalid email address!");
        } else {
            setError("");
            toast.success("Subscribed successfully!");
            setEmail(""); // Clear input after successful submission
        }
    };

    return (
        <div className="footer container mt-5 d-flex flex-column border-top">
            <div className="row d-flex justify-content-around align-items-center gap-5 my-4">
                <div className="col-6 col-md-2 d-flex justify-content-center align-items-center">
                    <div className="logo">
                        <Link to="/" className="nav-link p-0 text-body-secondary fw-bolder fs-1 text">
                            PUREBITE
                        </Link>
                        <p className="text-nowrap">Taste the Goodness</p>
                    </div>
                </div>

                <div className="col-6 col-md-2 d-flex flex-column justify-content-center align-items-center">
                    <h5>Quick Links</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><Link to="/" className="nav-link p-0 text-body-secondary">Home</Link></li>
                        <li className="nav-item mb-2"><Link to="/shop" className="nav-link p-0 text-body-secondary">Shop</Link></li>
                        <li className="nav-item mb-2"><Link to="/contact" className="nav-link p-0 text-body-secondary">Contact</Link></li>
                        <li className="nav-item mb-2"><Link to="/order-history" className="nav-link p-0 text-body-secondary">Your Orders</Link></li>
                        <li className="nav-item mb-2"><Link to="/cart" className="nav-link p-0 text-body-secondary">Cart</Link></li>
                    </ul>
                </div>

                <div className="col-md-5 offset-md-1 mb-3 d-flex flex-column justify-content-center align-items-center">
                    <form onSubmit={handleSubmit}>
                        <h5>Subscribe to our newsletter</h5>
                        <p>Monthly digest of what's new and exciting from us.</p>
                        <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                            <label htmlFor="newsletter1" className="visually-hidden">Email address</label>
                            <input 
                                id="newsletter1" 
                                type="text" 
                                className="form-control" 
                                placeholder="Email address" 
                                value={email} 
                                onChange={handleChange} 
                            />
                            <button className="btns" type="submit">Subscribe</button>
                        </div>
                        {error && <small className="text-danger">{error}</small>}
                    </form>
                </div>
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-center border-top">
                <p className="my-4">© 2025 Company, Inc. All rights reserved.</p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Footer;
