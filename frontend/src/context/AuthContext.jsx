import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (userData) => {
        const fixedAvatar =
            !userData.avatar || userData.avatar === "NULL" || userData.avatar === "null"
                ? "/uploads/avatars/default.png"
                : (userData.avatar.startsWith("/") ? userData.avatar : "/" + userData.avatar);

        const normalized = {
            ...userData,

            // 🔥 THÊM TRƯỜNG THÔNG BÁO CHƯA ĐỌC
            unreadNotifications: userData.unreadNotifications || 0,

            avatar: fixedAvatar,
            role: userData.role || userData.vai_tro || "sinhvien",
        };

        setUser(normalized);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(normalized));
    };

    // ⭐ Khi đánh dấu đã đọc → cập nhật user.unreadNotifications
    const updateUnreadNotifications = (count) => {
        setUser((prev) => {
            const updated = { ...prev, unreadNotifications: count };
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        });
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                updateUnreadNotifications
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
