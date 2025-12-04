import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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

            <div
                style={{
                    textAlign: "center",
                    marginTop: 60,
                    opacity: 0.6,
                    fontSize: 14,
                    color: "#475569"
                }}
            >
                HCMUNRE Notification Center
                <br />
                Hệ thống thông báo thông minh cho sinh viên
            </div>
        </div>
    );
};

export default Notifications;
