import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./UserHeader.css";

function UserHeader() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    // ⭐⭐⭐ THÊM DÒNG NÀY — RẤT QUAN TRỌNG ⭐⭐⭐
    const isAdmin = user?.vai_tro?.trim() === "admin";

    useEffect(() => {
        const close = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    // =========================
    // HEADER KHI CHƯA ĐĂNG NHẬP
    // =========================
    if (!user) {
        return (
            <header className="user-header">
                <div className="header-left">
                    <Link to="/" className="logo">
                        Sự kiện của trường <span>HCMUNRE</span>
                    </Link>
                </div>

                <nav className="nav-menu">
                    <Link to="/">Trang chủ</Link>
                    <Link to="/events">Sự kiện</Link>
                    <Link to="/extend">Góc chia sẻ</Link>
                    <Link to="/community">Bảo mật</Link>
                </nav>

                <div className="header-right">
                    <Link to="/login" className="btn-login">Đăng nhập</Link>
                    <Link to="/register" className="btn-register">Đăng ký</Link>
                </div>
            </header>
        );
    }

    // ==========================
    // HEADER KHI ĐÃ ĐĂNG NHẬP
    // ==========================
    return (
        <header className="user-header">
            <div className="header-left">
                <Link to="/" className="logo">
                    Sự kiện của trường <span>HCMUNRE</span>
                </Link>
            </div>

            <nav className="nav-menu">
                <Link to="/">Trang chủ</Link>
                <Link to="/events">Sự kiện</Link>
                <Link to="/extend">Góc chia sẻ</Link>
                <Link to="/community">Bảo mật</Link>
            </nav>

            <div className="header-right" ref={menuRef}>
                <div className="notification-icon">
                    <Link to="/notifications">🔔</Link>
                </div>

                <div className="user-menu">
                    <div className="user-trigger" onClick={() => setOpen(!open)}>
                        <img
                            src={
                                user?.avatar
                                    ? `http://localhost:3001${user.avatar.startsWith("/") ? user.avatar : "/" + user.avatar}`
                                    : "https://i.pravatar.cc/150"
                            }
                            alt="avatar"
                            className="avatar-img"
                        />
                        <span className="username">{user?.ho_ten}</span>
                        <span className="arrow">▾</span>
                    </div>

                    {open && (
                        <div className="dropdown">
                            {isAdmin ? (
                                <>
                                    <Link to="/profile">👤 Hồ sơ cá nhân</Link> <br />
                                    <Link to="/admin">⚙ Trang quản trị</Link>
                                    <Link to="/admin/users">👤 Quản lý người dùng</Link>
                                    <Link to="/admin/events">📅 Quản lý sự kiện</Link>
                                    <Link to="/admin/scan-qr">📲 Quét QR</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile">👤 Hồ sơ cá nhân</Link>
                                    <Link to="/mytickets">🎟 Vé của tôi</Link>
                                    <Link to="/history">📅 Sự kiện đã tham gia</Link>
                                    <Link to="/training-points">⭐ Điểm rèn luyện</Link>
                                    <Link to="/notifications">🔔 Thông báo</Link>
                                    <Link to="/change-password">🔑 Đổi mật khẩu</Link>
                                </>
                            )}

                            <button onClick={logout} className="logout-btn">🚪 Đăng xuất</button>
                        </div>
                    )}

                </div>
            </div>
        </header>
    );
}

export default UserHeader;
