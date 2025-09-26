import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "antd/dist/reset.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigProvider } from "antd";

const theme = {
  token: {
    colorPrimary: "#F97316",
    colorLink: "#F97316",
    colorBgContainer: "#FAFAF9",
    colorTextBase: "#1F2937",
    borderRadius: 8,
  },
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider theme={theme}>
          <AdminRoutes />
          <UserRoutes />
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
