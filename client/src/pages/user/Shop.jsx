import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ProductList from "../../components/user/ProductList";
import { useAuth } from "../../contexts/AuthContext";

export default function Shop() {
  const [filterVisible, setFilterVisible] = useState(false);
  const {filters, setFilters, filteredProducts } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <div className="container">
      {/* Top Navigation */}
      <div className="row align-items-center sitemap">
        <div className="col-6">
          <p className="mt-5">
            <Link to="/" className="text-decoration-none dim link">Home / </Link> Shop
          </p>
        </div>
        <div className="col-6 justify-content-end d-flex">
          <button className="primary-btn" onClick={() => setFilterVisible(!filterVisible)}>
            <i className="fa-solid fa-filter pe-2"></i>Filter
          </button>
        </div>
      </div>

      {/* Filters */}
      {filterVisible && (
        <form onSubmit={handleChange} method="post">
          <div className="border p-3 row" id="filter-section">
            {/* Ratings */}
            <div className="col-md-3 col-sm-4 col-6 mb-2">
              <h6 className="mb-2"><span>Customer Ratings</span></h6>
              {[4, 3, 2, 1].map((rating) => (
                <div className="text-nowrap" key={rating}>
                  <input
                    className="me-1"
                    type="radio"
                    name="ratings"
                    id={`${rating}star`}
                    value={rating}
                    checked={filters.ratings === String(rating)}
                    onChange={handleChange}
                  />
                  <label htmlFor={`${rating}star`}>{rating} <i className="fa fa-star"></i> and above</label>
                </div>
              ))}
            </div>

            {/* Price Range */}
            <div className="col-md-3 col-sm-4 col-6 mb-2">
              <h6 className="mb-2"><span>Price</span></h6>
              {["lt50", "51to100", "101to200", "201to500", "gt500"].map((price) => (
                <div className="text-nowrap" key={price}>
                  <input
                    className="me-1"
                    type="radio"
                    name="priceRange"
                    id={price}
                    value={price}
                    checked={filters.priceRange === price}
                    onChange={handleChange}
                  />
                  <label htmlFor={price}>
                    {{
                      lt50: "Less than Rs 50",
                      "51to100": "Rs 51 to 100",
                      "101to200": "Rs 101 to 200",
                      "201to500": "Rs 201 to 500",
                      gt500: "More than Rs 500"
                    }[price]}
                  </label>
                </div>
              ))}
            </div>

            {/* Discount */}
            <div className="col-md-3 col-sm-4 col-6 mb-2">
              <h6 className="mb-2"><span>Discount</span></h6>
              {["lt5", "5to15", "15to25", "gt25"].map((discount) => (
                <div className="text-nowrap" key={discount}>
                  <input
                    className="me-1"
                    type="radio"
                    name="discount"
                    id={discount}
                    value={discount}
                    checked={filters.discount === discount}
                    onChange={handleChange}
                  />
                  <label htmlFor={discount}>
                    {{
                      lt5: "Less than 5%",
                      "5to15": "5% to 15%",
                      "15to25": "15% to 25%",
                      gt25: "More than 25%"
                    }[discount]}
                  </label>
                </div>
              ))}
            </div>

        {/* Clear Filters Button */}
        <div className="col-md-3 col-sm-4 col-6 mb-2 d-flex align-items-end">
            <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={() =>
                    setFilters({
                        ratings: "",
                        priceRange: "",
                        discount: "",
                        // add other filter fields here if needed
                    })
                }
            >
                Clear Filters
            </button>
        </div>
          </div>
        </form>
      )}

      {/* Product Listing */}
      <ProductList products={filteredProducts} />
    </div>
  );
}
