import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AddBanner from "../pages/admin/AddBanner";
import AddToCart from "../pages/admin/AddToCart";
import AddCategory from "../pages/admin/AddCategory";
import AddOffer from "../pages/admin/AddOffer";
import AddOrder from "../pages/admin/AddOrder";
import AddProduct from "../pages/admin/AddProduct";
import AddReview from "../pages/admin/AddReview";
import Cart from "../pages/admin/Cart";
import Users from "../pages/admin/Users";
import UpdateUser from "../pages/admin/UpdateUser";
import AddUser from "../pages/admin/AddUser";
import Products from "../pages/admin/Products";
import ViewProduct from "../pages/admin/ViewProduct";
import MyProfile from "../pages/admin/MyProfile";
import Reviews from "../pages/admin/Reviews";
import Responses from "../pages/admin/Responses";
import SiteSettings from "../pages/admin/SiteSettings";
import Offers from "../pages/admin/Offers";
import UpdateCategory from "../pages/admin/UpdateCategory";
import UpdateOffer from "../pages/admin/UpdateOffer";
import UpdateReview from "../pages/admin/UpdateReview";
import ViewOrder from "../pages/admin/ViewOrder";
import Orders from "../pages/admin/Orders";
import UpdateCart from "../pages/admin/UpdateCart";
import UpdateBanner from "../pages/admin/UpdateBanner";
import Banners from "../pages/admin/Banners";
import Categories from "../pages/admin/Categories";
import UpdateProduct from "../pages/admin/UpdateProduct";
import UserDetails from "../pages/admin/UserDetails";
import UpdateOrder from "../pages/admin/UpdateOrder";
import EmailVerification from "../pages/admin/EmailVerification";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="banners" element={<Banners />} />
        <Route path="add-banner" element={<AddBanner />} />
        <Route path="update-banner/:id" element={<UpdateBanner />} />
        
        <Route path="users" element={<Users />} />
        <Route path="add-user" element={<AddUser />} />
        <Route path="update-user/:id" element={<UpdateUser />} />
        <Route path="user-details/:id" element={<UserDetails />} />

        <Route path="cart/:userId" element={<Cart />} />
        <Route path="add-to-cart/:userId" element={<AddToCart />} />
        <Route path=":userId/update-cart/:productId" element={<UpdateCart />} />

        <Route path="reviews" element={<Reviews />} />
        <Route path="add-review" element={<AddReview />} />
        <Route path="update-review/:id" element={<UpdateReview />} />

        <Route path="products" element={<Products />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="update-product/:id" element={<UpdateProduct />} />
        <Route path="view-product/:id" element={<ViewProduct />} />

        <Route path="categories" element={<Categories />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="update-category/:id" element={<UpdateCategory />} />

        <Route path="offers" element={<Offers />} />
        <Route path="add-offer" element={<AddOffer />} />
        <Route path="update-offer/:id" element={<UpdateOffer />} />

        <Route path="responses" element={<Responses />} />

        <Route path="site-settings" element={<SiteSettings />} />

        <Route path="my-profile" element={<MyProfile />} />
        <Route path="verify-email" element={<EmailVerification />} />

        <Route path="orders" element={<Orders />} />
        <Route path="add-order" element={<AddOrder />} />
        <Route path="update-order/:orderId" element={<UpdateOrder />} />
        <Route path="view-order/:orderId" element={<ViewOrder />} />

      </Route>
    </Routes>
  );
};

export default AdminRoutes;
