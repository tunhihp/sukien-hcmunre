// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
    const { user, isAuthenticated } = useAuth();

    // Chưa đăng nhập → về trang login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Không phải admin → đá về trang chủ
    const role = user.role || user.vai_tro;
    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;
