import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Button, Rate, Pagination, Badge } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

// eslint-disable-next-line react/prop-types
const ProductList = ({ products }) => {
  const { user, updateCartCount, updateWishlistCount } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // eslint-disable-next-line react/prop-types
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      setLoadingWishlist(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/wishlist/${user._id}`
        );
        const productIds = response.data.wishlist?.productIds.map((p) => p._id);
        setWishlist(productIds || []);
      } catch {
        // toast.error("Failed to fetch wishlist.");
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error("Please log in to use wishlist.");
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        await axios.delete(
          `http://localhost:8000/wishlist/${user._id}/remove`,
          { data: { productId } }
        );
        setWishlist((prev) => prev.filter((id) => id !== productId));
        toast.info("Product removed from wishlist.");
      } else {
        const res = await axios.post(
          `http://localhost:8000/wishlist/${user._id}/add`,
          { productId }
        );
        setWishlist((prev) => [...prev, productId]);
        toast.success("Product added to wishlist.");
        if (res.data?.wishlist?.productIds?.length >= 0) {
          updateWishlistCount(res.data.wishlist.productIds.length);
        }
      }
    } catch {
      toast.error("Wishlist update failed.");
    }
  };

  const handleAddToCartClick = async (productId) => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    setAddingToCartId(productId);
    try {
      const response = await axios.post(`http://localhost:8000/cart`, {
        userId: user._id,
        productId,
        quantity: 1,
      });
      toast.success("Product added to cart successfully!");
      if (response.data?.items?.length) {
        updateCartCount(response.data.items.length);
      }
    } catch {
      toast.error("Failed to add product to cart.");
    } finally {
      setAddingToCartId(null);
    }
  };

  if (!products || products.length === 0) {
    return <p className="text-center">No products found</p>;
  }

  return (
    <div>
      <div className="row justify-content-start align-items-stretch">
        {currentProducts.map((product) => {
          const isOutOfStock = product.stock <= 0;
          const discountedPrice = (
            product.salePrice -
            (product.salePrice * product.discount) / 100
          ).toFixed(2);
          const isInWishlist = wishlist.includes(product._id);

          return (
            <div
              key={product._id}
              className="col-lg-3 col-md-4 col-6 gap p-2 mt-2"
            >
              <Badge.Ribbon
                text={
                  isOutOfStock ? "Out Of Stock" : `Save ${product.discount}%`
                }
                color={isOutOfStock ? "red" : "orange"}
              >
                <Card
                  hoverable
                  cover={
                    <Link to={`/product/${product._id}`}>
                      <img
                        alt={product.productName}
                        src={product.productImage}
                        className="img-thumbnail img-fluid p-4"
                        style={{ height: "225px" }}
                      />
                    </Link>
                  }
                  actions={[
                    // eslint-disable-next-line react/jsx-key
                    <Button
                      type="text"
                      icon={
                        isInWishlist ? (
                          <HeartFilled style={{ color: "#F97316" }} />
                        ) : (
                          <HeartOutlined />
                        )
                      }
                      onClick={() => toggleWishlist(product._id)}
                    />,
                    // eslint-disable-next-line react/jsx-key
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      disabled={isOutOfStock || addingToCartId === product._id}
                      loading={addingToCartId === product._id}
                      onClick={() => handleAddToCartClick(product._id)}
                    >
                      Add
                    </Button>,
                  ]}
                >
                  <Meta
                    title={
                      <Link
                        to={`/product/${product._id}`}
                        className="text-decoration-none"
                      >
                        {product.productName}
                      </Link>
                    }
                    description={
                      <>
                        <Link
                          to="/shop"
                          className="category-name category-link"
                        >
                          {product.categoryId?.name || "Category"}
                        </Link>
                        <div className="rating-section mt-1">
                          <Rate
                            disabled
                            defaultValue={product.averageRating}
                            allowHalf
                          />
                          <span className="ps-1">
                            ({product.totalReviews || 0})
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="price">₹{discountedPrice}</span>{" "}
                          <span className="striked-price">
                            ₹{product.salePrice}
                          </span>
                        </div>
                      </>
                    }
                  />
                </Card>
              </Badge.Ribbon>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            current={currentPage}
            pageSize={productsPerPage}
            total={products.length}
            onChange={paginate}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
