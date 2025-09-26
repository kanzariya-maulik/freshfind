import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ProductList from "../../components/user/ProductList";

export default function SearchResults() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    ratings: "",
    priceRange: "",
    discount: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({}); // Filters applied to ProductList

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters(filters); // Apply filters
  };

  const handleWishlistClick = (productId) => {
    // You can integrate backend wishlist API here
    toast.success("Added to wishlist");
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

  return (
    <div className="container">
      {/* Breadcrumb Navigation */}
      <div className="row align-items-center sitemap">
        <div className="col-6">
          <p className="mt-5">
            <Link to="/" className="text-decoration-none dim link">
              Home
            </Link>
            <span className="text-decoration-none dim link"> / Search</span>
          </p>
        </div>
        <div className="col-6 justify-content-end d-flex">
          <button
            className="primary-btn"
            onClick={() => setFilterVisible(!filterVisible)}
          >
            <i className="fa-solid fa-filter pe-2"></i>Filter
          </button>
        </div>
      </div>

      {/* Search Query Heading */}
      <h2 className="mt-3">
        You searched for "<span className="text-primary">{query}</span>"
      </h2>

      {/* Filters Section */}
      {filterVisible && (
        <form onSubmit={handleSubmit} method="post">
          <div className="border p-3 row" id="filter-section">
            {/* Customer Ratings */}
            <div className="col-6 col-sm-4 col-md-3 mb-2">
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
                    {rating} <i className="fa fa-star" aria-hidden="true"></i>{" "}
                    and above
                  </label>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="col-6 col-sm-4 col-md-3 mb-2">
              <h6 className="mb-2">Price</h6>
              {Object.keys(priceMap).map((key) => (
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
                  <label htmlFor={key}>{priceMap[key]}</label>
                </div>
              ))}
            </div>

            {/* Discount */}
            <div className="col-6 col-sm-4 col-md-3 mb-2">
              <h6 className="mb-2">Discount</h6>
              {Object.keys(discountMap).map((key) => (
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
                  <label htmlFor={key}>{discountMap[key]}</label>
                </div>
              ))}
            </div>

            <div className="col-6 col-sm-4 col-md-3 mb-2 d-flex align-items-end justify-content-end">
              <input type="submit" value="Apply" className="primary-btn" />
            </div>
          </div>
        </form>
      )}

      {/* Product List */}
      <ProductList
        searchQuery={query}
        filters={appliedFilters}
        onWishlistClick={handleWishlistClick}
      />
    </div>
  );
}
