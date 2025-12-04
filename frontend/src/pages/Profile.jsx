import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, login } = useAuth();
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div style={{ color: "white", textAlign: "center", paddingTop: "40px" }}>
                Đang tải...
            </div>
        );
    }

    const mssv = user?.email?.substring(0, 10) || "";
    const isAdmin = user?.role === "admin";

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("userId", user.ma_nguoi_dung);

        try {
            const res = await axios.post("http://localhost:3001/api/avatar/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const updatedUser = { ...user, avatar: res.data.avatar };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            login(updatedUser);
            alert("Cập nhật avatar thành công!");
        } catch (err) {
            console.log(err);
            alert("Lỗi khi cập nhật avatar!");
        }
    };

    const getAvatarURL = () => {
        if (preview) return preview;
        const avatar = user.avatar;

        if (!avatar) return "https://i.pravatar.cc/150";
        if (avatar.startsWith("http")) return avatar;
        if (!avatar.startsWith("/")) return `http://localhost:3001/${avatar}`;
        return `http://localhost:3001${avatar}`;
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "50px 20px",
                color: "#0f172a",
                fontFamily: "Inter, sans-serif",
                background: "linear-gradient(to bottom, #e0f2fe, #bfdbfe, #93c5fd)"
            }}
        >
            {/* BACK BUTTON */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    background: "rgba(30,58,138,0.12)",
                    color: "#1e3a8a",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "1px solid #60a5fa",
                    cursor: "pointer",
                    marginBottom: "25px",
                    fontWeight: 600,
                    transition: ".25s",
                }}
            >
                ← Quay lại
            </button>

            {/* PROFILE CARD */}
            <div
                style={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    background: "rgba(255,255,255,0.72)",
                    backdropFilter: "blur(15px)",
                    padding: "40px",
                    borderRadius: "22px",
                    border: "1px solid rgba(148,163,184,0.35)",
                    boxShadow: "0 10px 35px rgba(30,58,138,0.25)",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "#1e3a8a",
                        marginBottom: "30px",
                        fontFamily: "Inter, sans-serif"
                    }}
                >
                    🌟 Hồ Sơ Cá Nhân
                </h1>

                <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>

                    {/* AVATAR */}
                    <label style={{ cursor: "pointer", position: "relative" }}>
                        <img
                            src={getAvatarURL()}
                            alt="avatar"
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "5px solid #a855f7",
                                boxShadow: "0 0 30px #c084fc"
                            }}
                        />

                        <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />

                        <div
                            style={{
                                position: "absolute",
                                bottom: "8px",
                                right: "8px",
                                background: "#9333ea",
                                color: "white",
                                padding: "8px",
                                borderRadius: "50%",
                                fontSize: "14px",
                                boxShadow: "0 0 10px rgba(147,51,234,0.8)",
                            }}
                        >
                            ✎
                        </div>
                    </label>

                    {/* USER INFO */}
                    <div style={{ fontFamily: "Inter, sans-serif" }}>
                        <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#1e293b" }}>
                            {user.ho_ten}
                        </h2>

                        <p style={{ color: "#334155", marginTop: "6px", fontSize: "15px" }}>
                            📧 {user.email}
                        </p>

                        {!isAdmin && (
                            <>
                                <p style={{ color: "#334155", marginTop: "6px", fontSize: "15px" }}>
                                    🎓 MSSV: {mssv}
                                </p>

                                <p style={{ color: "#334155", marginTop: "6px", fontSize: "15px" }}>
                                    🏫 Lớp: {user.lop}
                                </p>
                            </>
                        )}

                        {isAdmin && (
                            <p style={{ color: "#334155", marginTop: "6px", fontSize: "15px" }}>
                                🛡 Vai trò: Quản trị viên
                            </p>
                        )}
                    </div>
                </div>

                <hr style={{ margin: "30px 0", borderColor: "rgba(148,163,184,0.4)" }} />

                {/* BUTTON */}
                {!isAdmin && (
                    <button
                        onClick={() => navigate("/mytickets")}
                        style={{
                            width: "100%",
                            background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                            padding: "15px",
                            borderRadius: "14px",
                            border: "none",
                            fontWeight: "600",
                            fontSize: "16px",
                            color: "white",
                            cursor: "pointer",
                            boxShadow: "0 6px 20px rgba(99,102,241,0.4)",
                            fontFamily: "Inter, sans-serif",
                            transition: ".3s",
                        }}
                    >
                        🎟 Xem vé của tôi
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;
