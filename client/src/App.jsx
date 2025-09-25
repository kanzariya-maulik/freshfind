import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import { BrowserRouter } from "react-router-dom";
import './App.css';
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return <BrowserRouter>
    <AuthProvider>
        <AdminRoutes />
        <UserRoutes />
    </AuthProvider>
  </BrowserRouter>;
}

export default App
