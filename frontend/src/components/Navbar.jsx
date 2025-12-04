import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {

    const { user, isAuthenticated, logout } = useAuth();
    const [unread, setUnread] = useState(0);

    // 📌 Lấy số thông báo chưa đọc
    useEffect(() => {
        if (!user) return;

        fetch(`/api/notifications/count/${user.ma_nguoi_dung}`)
            .then(res => res.json())
            .then(data => {
                setUnread(data.total);
            })
            .catch(err => console.error("Lỗi load số thông báo:", err));
    }, [user]);

    return (
        <nav className="w-full bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">

            {/* Logo */}
            <Link to="/" className="text-xl font-bold">
                <span className="text-slate-300">Sự kiện của trường</span>
                <span className="text-blue-400 ml-1">HCMUNRE</span>
            </Link>

            {/* Menu */}
            <div className="flex items-center gap-8">
                <Link to="/" className="hover:text-blue-400">Trang chủ</Link>
                <Link to="/events" className="hover:text-blue-400">Sự kiện</Link>
                <Link to="/extend" className="hover:text-blue-400">Góc chia sẻ</Link>
                <Link to="/community" className="hover:text-blue-400">Bảo mật</Link>

                {!isAuthenticated && (
                    <Link to="/login" className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
                        Đăng nhập
                    </Link>
                )}

                {isAuthenticated && (
                    <div className="flex items-center gap-6">

                        {/* 🔔 Icon thông báo */}
                        <Link to="/notifications" className="relative cursor-pointer">
                            <span className="text-2xl">🔔</span>

                            {unread > 0 && (
                                <span className="absolute -top-1 -right-2 
                                    bg-red-500 text-white w-5 h-5 rounded-full 
                                    text-xs flex items-center justify-center shadow-lg animate-pulse">
                                    {unread}
                                </span>
                            )}
                        </Link>

                        {/* Avatar */}
                        <Link to="/profile" className="flex items-center gap-2">
                            <img src={user.avatar} className="w-10 h-10 rounded-full border border-white" />
                            <span>{user.ho_ten}</span>
                        </Link>

                        <button onClick={logout} className="text-red-400 hover:text-red-500 ml-4">
                            Đăng xuất
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
