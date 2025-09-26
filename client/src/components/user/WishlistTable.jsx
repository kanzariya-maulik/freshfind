import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { Table, Button, Spin, Image } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";

const WishlistTable = ({ userId }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCartId, setAddingToCartId] = useState(null);
  const { updateCartCount, updateWishlistCount } = useAuth();

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/wishlist/${userId}`);
      const productIds = res.data?.wishlist?.productIds || [];
      setWishlist(productIds);
      updateWishlistCount(productIds.length);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchWishlist();
  }, [userId]);

  // Delete from wishlist
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/wishlist/${userId}/remove`, {
        data: { productId },
      });
      toast.success("Product removed from wishlist!");
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      updateWishlistCount(wishlist.length - 1);
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      toast.error("Failed to remove product.");
    }
  };

  // Add to cart
  const handleAddToCart = async (productId) => {
    if (!userId) {
      toast.error("Please log in to add to cart.");
      return;
    }

    setAddingToCartId(productId);
    try {
      const response = await axios.post(`http://localhost:8000/cart`, {
        userId,
        productId,
        quantity: 1,
      });

      toast.success("Product added to cart successfully!");
      if (response.data?.items?.length) {
        updateCartCount(response.data.items.length);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    } finally {
      setAddingToCartId(null);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "product",
      render: (_, item) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={item.productImage}
            alt={item.productName}
            width={60}
            height={60}
            style={{ objectFit: "cover", marginRight: 10 }}
            preview={false}
          />
          <span>{item.productName}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "salePrice",
      key: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, item) => (
        <div>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => handleAddToCart(item._id)}
            loading={addingToCartId === item._id}
          >
            {addingToCartId === item._id ? "Adding..." : "Add to Cart"}
          </Button>
          <Button
            type="default"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(item._id)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={wishlist}
          columns={columns}
          rowKey={(item) => item._id}
          pagination={false}
          locale={{ emptyText: "Your wishlist is empty." }}
        />
      )}
    </>
  );
};

export default WishlistTable;
