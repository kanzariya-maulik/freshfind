import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import { loadUserAssets } from "../utils/LoadUserAssets";
import { useAuth } from "../contexts/AuthContext";

const UserLayout = () => {
  const { user } = useAuth();

  if (user?.role === "Admin") {
    return <Navigate to="/admin" replace />;
  }

  // Load user-specific assets
  loadUserAssets();

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;
