import { useState } from "react";
import { Link } from "react-router-dom";
import ProductList from "../../components/user/ProductList";
import { useAuth } from "../../contexts/AuthContext";

export default function Shop() {
  const [filterVisible, setFilterVisible] = useState(false);
  const { filters, setFilters, filteredProducts } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const priceMap = {
    lt50: "Less than Rs 50",
    "51to100": "Rs 51 to 100",
    "101to200": "Rs 101 to 200",
    "201to500": "Rs 201 to 500",
    gt500: "More than Rs 500",
  };

  const discountMap = {
    lt5: "Less than 5%",
    "5to15": "5% to 15%",
    "15to25": "15% to 25%",
    gt25: "More than 25%",
  };

  const clearFilters = () => {
    setFilters({
      ratings: "",
      priceRange: "",
      discount: "",
    });
  };

  return (
    <div className="container">
      {/* Top Navigation */}
      <div className="row align-items-center sitemap">
        <div className="col-6">
          <p className="mt-5">
            <Link to="/" className="text-decoration-none dim link">
              Home /{" "}
            </Link>{" "}
            Shop
          </p>
        </div>
        <div className="col-6 justify-content-end d-flex">
          <button
            className="primary-btn"
            style={{ backgroundColor: "orange" }}
            onClick={() => setFilterVisible(!filterVisible)}
          >
            <i className="fa-solid fa-filter pe-2"></i>Filter
          </button>
        </div>
      </div>

      {/* Filters */}
      {filterVisible && (
        <div className="border p-3 row" id="filter-section">
          {/* Ratings */}
          <div className="col-md-3 col-sm-4 col-6 mb-2">
            <h6 className="mb-2">Customer Ratings</h6>
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
                <label htmlFor={`${rating}star`}>
                  {rating} <i className="fa fa-star"></i> and above
                </label>
              </div>
            ))}
          </div>

          {/* Price Range */}
          <div className="col-md-3 col-sm-4 col-6 mb-2">
            <h6 className="mb-2">Price</h6>
            {Object.entries(priceMap).map(([key, label]) => (
              <div className="text-nowrap" key={key}>
                <input
                  className="me-1"
                  type="radio"
                  name="priceRange"
                  id={key}
                  value={key}
                  checked={filters.priceRange === key}
                  onChange={handleChange}
                />
                <label htmlFor={key}>{label}</label>
              </div>
            ))}
          </div>

          {/* Discount */}
          <div className="col-md-3 col-sm-4 col-6 mb-2">
            <h6 className="mb-2">Discount</h6>
            {Object.entries(discountMap).map(([key, label]) => (
              <div className="text-nowrap" key={key}>
                <input
                  className="me-1"
                  type="radio"
                  name="discount"
                  id={key}
                  value={key}
                  checked={filters.discount === key}
                  onChange={handleChange}
                />
                <label htmlFor={key}>{label}</label>
              </div>
            ))}
          </div>

          {/* Clear Filters */}
          <div className="col-md-3 col-sm-4 col-6 mb-2 d-flex align-items-end">
            <button
              type="button"
              style={{ color: "orange" }}
              className="btn w-100"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Product Listing */}
      <ProductList products={filteredProducts} />
    </div>
  );
}
