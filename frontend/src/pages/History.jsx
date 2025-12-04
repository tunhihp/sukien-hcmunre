import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function History() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        async function loadHistory() {
            try {
                // Sử dụng ma_nguoi_dung thay vì id
                const userId = user.ma_nguoi_dung || user.id;
                if (!userId) {
                    console.error("Không tìm thấy user ID");
                    return;
                }

                const res = await fetch(
                    `http://localhost:3001/api/history/${userId}`
                );
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setHistory(Array.isArray(data) ? data : []);

            } catch (err) {
                console.error("Lỗi tải lịch sử:", err);
                setHistory([]); // chống crash
            }
        }

        if (user) loadHistory();
    }, [user]);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
                padding: "40px",
                color: "#0f172a",
                fontFamily: "Inter, sans-serif"
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    marginBottom: "40px",
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#0f172a"
                }}
            >
                📅 Sự kiện đã tham gia
            </h1>

            {history.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        backgroundColor: "rgba(255,255,255,0.8)",
                        borderRadius: "16px",
                        border: "2px solid #bbdefb",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
                    }}
                >
                    <div style={{ fontSize: "48px", marginBottom: "20px" }}>📭</div>
                    <p style={{ fontSize: "18px", color: "#0f172a" }}>
                        Bạn chưa check-in sự kiện nào.
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                        gap: "24px",
                        maxWidth: "1200px",
                        margin: "0 auto"
                    }}
                >
                    {history.map((h) => (
                        <div
                            key={h.ma_dang_ky || h.id}
                            style={{
                                border: "2px solid #90caf9",
                                padding: "24px",
                                borderRadius: "16px",
                                background: "rgba(255,255,255,0.9)",
                                transition: "0.3s",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-6px)";
                                e.currentTarget.style.boxShadow =
                                    "0 12px 24px rgba(0,0,0,0.18)";
                                e.currentTarget.style.borderColor = "#42a5f5";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(0,0,0,0.1)";
                                e.currentTarget.style.borderColor = "#90caf9";
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: "22px",
                                    fontWeight: "bold",
                                    marginBottom: "16px",
                                    color: "#0f172a"
                                }}
                            >
                                {h.title || "Sự kiện"}
                            </h2>

                            {h.location && (
                                <p style={{ marginBottom: "8px", color: "#1e293b" }}>
                                    📍 {h.location}
                                </p>
                            )}

                            {h.date && (
                                <p style={{ marginBottom: "8px", color: "#1e293b" }}>
                                    🕒{" "}
                                    {new Date(h.date).toLocaleString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                            )}

                            <div
                                style={{
                                    marginTop: "16px",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    backgroundColor: "#e3f2fd",
                                    border: "1px solid #64b5f6"
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        color: "#0f172a",
                                        fontWeight: "bold"
                                    }}
                                >
                                    ⭐ Điểm rèn luyện nhận:{" "}
                                    {h.diem_cong || h.points || 5} điểm
                                </p>
                            </div>

                            {h.thoi_gian_checkin && (
                                <p
                                    style={{
                                        marginTop: "16px",
                                        fontSize: "14px",
                                        color: "#474747",
                                        opacity: 0.8
                                    }}
                                >
                                    ✅ Check-in lúc:{" "}
                                    {new Date(h.thoi_gian_checkin).toLocaleString(
                                        "vi-VN"
                                    )}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default History;
