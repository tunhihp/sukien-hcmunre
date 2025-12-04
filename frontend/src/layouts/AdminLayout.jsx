// src/layouts/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";
import Admin from "../pages/admin/Admin";
import "./AdminLayout.css"; // nếu em muốn style riêng

function AdminLayout() {
    return (
        <div className="admin-layout">
            {/* Sidebar + Header */}
            <Admin />

            {/* MAIN CONTENT */}
            <div className="admin-content">
                {/* 🔥 Menu thêm mới */}
                <div className="admin-extra-menu">
                    <Link to="/profile" className="admin-profile-link">
                        Hồ sơ cá nhân
                    </Link>
                </div>

                {/* Trang con */}
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
