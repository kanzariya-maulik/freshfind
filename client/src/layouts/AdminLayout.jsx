import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import Footer from "../components/admin/Footer";
import { loadAdminAssets } from "../utils/loadAdminAssets";
import { useAuth } from "../contexts/AuthContext";

const AdminLayout = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== "Admin") return <Navigate to="/" replace />;

  loadAdminAssets();

  const [isSidebarToggled, setIsSidebarToggled] = useState(
    localStorage.getItem("sb|sidebar-toggle") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("sb-sidenav-toggled", isSidebarToggled);
  }, [isSidebarToggled]);

  const toggleSidebar = () => {
    setIsSidebarToggled((prev) => {
      const newState = !prev;
      localStorage.setItem("sb|sidebar-toggle", newState);
      return newState;
    });
  };

  return (
    <div className="sb-nav-fixed">
      <div id="layoutSidenav">
        <Header toggleSidebar={toggleSidebar} />
        <Sidebar isSidebarToggled={isSidebarToggled} />
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-sm-4">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
