import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
    const { user, isAuthenticated } = useAuth();

    // ⛔ Chưa login → đưa về trang login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // 🔐 Nếu route yêu cầu role admin nhưng user không phải admin
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}
