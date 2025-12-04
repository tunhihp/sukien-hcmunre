import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ChangePassword = () => {
    const { user } = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            return setMessage("⚠️ Vui lòng nhập đầy đủ thông tin.");
        }

        setLoading(true);

        try {
            await axios.post("http://localhost:3001/api/auth/change-password", {
                userId: user.ma_nguoi_dung,
                oldPassword,
                newPassword,
            });

            setMessage("✅ Đổi mật khẩu thành công!");
            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            console.log(err);
            setMessage("❌ Mật khẩu cũ không đúng!");
        }

        setLoading(false);
    };

    return (
        <div
            style={{
                background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
                minHeight: "100vh",
                padding: "40px 0",
                color: "#0f172a",
                fontFamily: "Inter, sans-serif"
            }}
        >

            {/* 🔙 Nút quay lại */}
            <button
                onClick={() => window.history.back()}
                style={{
                    background: "#90caf9",
                    color: "#0f172a",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "1px solid #64b5f6",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: "600",
                    transition: "0.25s",
                    marginLeft: "20px",
                    marginBottom: "10px"
                }}
                onMouseEnter={(e) => (e.target.style.background = "#64b5f6")}
                onMouseLeave={(e) => (e.target.style.background = "#90caf9")}
            >
                ← Quay lại
            </button>

            {/* 🌟 FORM CHÍNH */}
            <div
                style={{
                    maxWidth: "520px",
                    width: "90%",
                    margin: "0 auto",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    padding: "30px",
                    borderRadius: "16px",
                    border: "2px solid #90caf9",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    transition: "0.3s"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.15)";
                    e.currentTarget.style.borderColor = "#42a5f5";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = "#90caf9";
                }}
            >
                <h1
                    style={{
                        fontSize: "26px",
                        fontWeight: "700",
                        color: "#0f172a",
                        marginBottom: "25px",
                        textAlign: "center"
                    }}
                >
                    🔐 Thay đổi mật khẩu
                </h1>

                {message && (
                    <div
                        style={{
                            marginBottom: "15px",
                            color: "#d32f2f",
                            fontSize: "14px",
                            textAlign: "center",
                            fontWeight: "600",
                            background: "rgba(255,0,0,0.1)",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,0,0,0.2)"
                        }}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* 🔑 Mật khẩu cũ */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontWeight: "600", color: "#0f172a" }}>Mật khẩu cũ</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showOld ? "text" : "password"}
                                value={oldPassword}
                                placeholder="Nhập mật khẩu cũ"
                                onChange={(e) => setOldPassword(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 2px 12px 12px",
                                    borderRadius: "10px",
                                    border: "2px solid #90caf9",
                                    backgroundColor: "white",
                                    color: "#0f172a",
                                    marginTop: "6px",
                                    fontSize: "15px",
                                    transition: "0.25s"
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "#42a5f5")}
                                onBlur={(e) => (e.target.style.borderColor = "#90caf9")}
                            />

                            <span
                                onClick={() => setShowOld(!showOld)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    color: "#1e3a8a"
                                }}
                            >
                                {showOld ? "👁‍🗨" : "👁"}
                            </span>
                        </div>
                    </div>

                    {/* 🆕 Mật khẩu mới */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontWeight: "600", color: "#0f172a" }}>Mật khẩu mới</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                placeholder="Nhập mật khẩu mới"
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 2px 12px 12px",
                                    borderRadius: "10px",
                                    border: "2px solid #90caf9",
                                    backgroundColor: "white",
                                    color: "#0f172a",
                                    marginTop: "6px",
                                    fontSize: "15px",
                                    transition: "0.25s"
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "#42a5f5")}
                                onBlur={(e) => (e.target.style.borderColor = "#90caf9")}
                            />

                            <span
                                onClick={() => setShowNew(!showNew)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    color: "#1e3a8a"
                                }}
                            >
                                {showNew ? "👁‍🗨" : "👁"}
                            </span>
                        </div>
                    </div>

                    {/* Nút cập nhật */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            backgroundColor: "#42a5f5",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "700",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1,
                            transition: "0.25s",
                            fontSize: "16px"
                        }}
                        onMouseEnter={(e) =>
                            !loading && (e.target.style.backgroundColor = "#1e88e5")
                        }
                        onMouseLeave={(e) =>
                            !loading && (e.target.style.backgroundColor = "#42a5f5")
                        }
                    >
                        {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
