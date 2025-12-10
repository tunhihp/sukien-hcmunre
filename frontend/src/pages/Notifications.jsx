import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/logo.jpg";

const Notifications = () => {
    const { user } = useAuth();
    const [list, setList] = useState([]);

    useEffect(() => {
        if (!user) return;

        axios
            .get(`http://localhost:3001/api/notifications/${user.ma_nguoi_dung}`)
            .then((res) => {
                setList(res.data);
            })
            .catch((err) => console.log("ERR NOTI:", err));
    }, [user]);

    // Đánh dấu đã đọc
    const markRead = async (id) => {
        try {
            await axios.put(`http://localhost:3001/api/notifications/read/${id}`);

            setList((prev) =>
                prev.map((i) =>
                    i.id_thong_bao === id ? { ...i, da_doc: true } : i
                )
            );
        } catch (err) {
            console.log("READ ERROR:", err);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "40px 20px",
                background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
                color: "#0f172a",
                fontFamily: "Inter, sans-serif"
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    fontSize: 40,
                    fontWeight: "800",
                    background: "linear-gradient(135deg, #1e3a8a, #0f172a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}
            >
                🔔 Thông báo của bạn
            </h1>

            <p style={{ textAlign: "center", opacity: 0.7, marginTop: 5, color: "#0f172a" }}>
                Tất cả thông báo mới nhất từ hệ thống HCMUNRE
            </p>

            <div style={{ maxWidth: 900, margin: "40px auto" }}>
                {list.length === 0 ? (
                    <div
                        style={{
                            background: "rgba(255,255,255,0.7)",
                            padding: 40,
                            borderRadius: 16,
                            textAlign: "center",
                            border: "2px solid #bbdefb",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
                        }}
                    >
                        <span style={{ fontSize: 50 }}>📭</span>
                        <h3 style={{ marginTop: 10, color: "#0f172a" }}>Hiện chưa có thông báo nào</h3>
                    </div>
                ) : (
                    list.map((item) => (
                        <div
                            key={item.id_thong_bao}
                            onClick={() => markRead(item.id_thong_bao)}
                            style={{
                                padding: 20,
                                background: item.da_doc
                                    ? "rgba(255,255,255,0.7)"
                                    : "rgba(255,255,255,0.9)",
                                borderRadius: 16,
                                marginBottom: 20,
                                cursor: "pointer",
                                border: item.da_doc ? "2px solid #bbdefb" : "2px solid #64b5f6",
                                transition: "0.3s",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
                            }}
                        >
                            <div style={{ fontSize: 24, fontWeight: "bold", color: "#0f172a" }}>
                                {item.icon || "🔔"} {item.tieu_de}
                            </div>

                            <div style={{ marginTop: 10, opacity: 0.9, color: "#334155", fontSize: 15 }}>
                                {item.noi_dung}
                            </div>

                            <div style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
                                {new Date(item.thoi_gian_tao).toLocaleString("vi-VN")}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FOOTER */}
            <footer
                style={{
                    marginTop: "60px",
                    padding: "35px 20px",
                    background: "rgba(255, 255, 255, 0.6)",
                    borderTop: "2px solid #cce7ff",
                    fontFamily: "Inter, Poppins, sans-serif",
                    backdropFilter: "blur(6px)",
                    borderRadius: "8px",
                }}
            >
                <div
                    style={{
                        maxWidth: "900px",
                        margin: "0 auto",
                        display: "flex",
                        gap: "25px",
                        alignItems: "flex-start",
                    }}
                >
                    {/* LOGO */}
                    <img
                        src={logo}
                        alt="HCMUNRE Logo"
                        style={{
                            width: "75px",
                            height: "75px",
                            borderRadius: "6px",
                            border: "1px solid #d0e7ff",
                            padding: "5px",
                            background: "#fff",
                        }}
                    />

                    {/* RIGHT CONTENT */}
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: "700", fontSize: "20px", color: "#0f172a", marginBottom: "6px" }}>
                            HCMUNRE Event Manager
                        </p>

                        <p style={{ fontSize: "14px", color: "#1e293b", marginBottom: "12px" }}>
                            Nền tảng hỗ trợ đăng ký sự kiện – quét mã QR – và quản lý điểm rèn luyện dành cho sinh viên.
                        </p>

                        <p style={{ fontWeight: "700", fontSize: "15px", color: "#0d9488", marginBottom: "6px" }}>
                            Thông tin liên hệ
                        </p>

                        <p style={contactStyle}>📍 236B Lê Văn Sỹ, Phường Tân Sơn Hòa, TP. Hồ Chí Minh</p>
                        <p style={contactStyle}>✉️ 1050080149@hcmunre.edu.vn</p>

                        <div style={{ marginTop: "10px", fontSize: "12px", color: "#64748b" }}>
                            © 2025 HCMUNRE - Phát triển bởi sinh viên, vì cộng đồng sinh viên.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

///////////////////////// STYLE COMPONENTS /////////////////////////

const SectionTitle = ({ text }) => (
    <h3
        style={{
            color: "#000",
            marginTop: "28px",
            fontWeight: 700,
            background: "rgba(46,134,193,0.12)",
            padding: "10px 14px",
            borderRadius: "12px",
            borderLeft: "4px solid #3b82f6",
        }}
    >
        {text}
    </h3>
);

const ulStyle = {
    marginLeft: "22px",
    marginTop: "10px",
    fontWeight: 500,
    color: "#000",
};

const contactStyle = {
    margin: "4px 0",
    fontSize: "14px",
    color: "#475569",
};


export default Notifications;
