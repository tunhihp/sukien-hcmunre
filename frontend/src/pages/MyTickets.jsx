import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import QRCode from "qrcode";

const MyTickets = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        axios
            .get(`http://localhost:3001/api/tickets/my/${user.ma_nguoi_dung}`)
            .then(async (res) => {
                const data = res.data;

                // tạo QR PNG
                for (let t of data) {
                    t.qr_png = await QRCode.toDataURL(t.qr_code);
                }

                setTickets(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log("❌ LỖI TẢI VÉ:", err);
                setLoading(false);
            });
    }, [user]);

    const downloadQR = (qr_png, id) => {
        const link = document.createElement("a");
        link.href = qr_png;
        link.download = `QR_Event_${id}.png`;
        link.click();
    };

    return (
        <div
            style={{
                padding: 40,
                minHeight: "100vh",
                background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
                fontFamily: "Inter, Segoe UI, sans-serif",
                color: "#0f172a"
            }}
        >
            {/* TITLE */}
            <h2
                style={{
                    fontSize: 32,
                    textAlign: "center",
                    fontWeight: 800,
                    color: "#0a3d62",
                    marginBottom: 24,
                    letterSpacing: "1px"
                }}
            >
                🎟 Vé Của Tôi
            </h2>

            {/* LOADING */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
                    <p style={{ fontSize: "18px", color: "#374151" }}>Đang tải vé...</p>
                </div>
            ) : tickets.length === 0 ? (
                /* NO TICKET BOX */
                <div
                    style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        backgroundColor: "rgba(255,255,255,0.6)",
                        borderRadius: "16px",
                        border: "2px solid rgba(25,118,210,0.2)",
                        maxWidth: "600px",
                        margin: "0 auto",
                        backdropFilter: "blur(6px)"
                    }}
                >
                    <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎫</div>
                    <p style={{ fontSize: "18px", color: "#1e293b" }}>
                        Bạn chưa đăng ký sự kiện nào.
                    </p>
                </div>
            ) : (
                /* TICKET GRID */
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: 24
                    }}
                >
                    {tickets.map((tk) => (
                        <div
                            key={tk.ma_dang_ky}
                            style={{
                                background: "rgba(255,255,255,0.85)",
                                padding: "24px",
                                borderRadius: "16px",
                                textAlign: "center",
                                border: "2px solid rgba(33, 150, 243, 0.3)",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                transition: "all 0.3s ease",
                            }}

                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                                e.currentTarget.style.borderColor = "rgba(33,150,243,0.7)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                                e.currentTarget.style.borderColor = "rgba(33,150,243,0.3)";
                            }}
                        >
                            {/* TITLE */}
                            <h3
                                style={{
                                    fontSize: 20,
                                    color: "#0d47a1",
                                    fontWeight: "700",
                                    marginBottom: 12
                                }}
                            >
                                {tk.title}
                            </h3>

                            {/* LOCATION */}
                            {tk.location && (
                                <p style={{ fontSize: 14, color: "#374151", marginBottom: 6 }}>
                                    📍 {tk.location}
                                </p>
                            )}

                            {/* DATE */}
                            {tk.date && (
                                <p style={{ fontSize: 14, color: "#374151", marginBottom: 16 }}>
                                    🕒{" "}
                                    {new Date(tk.date).toLocaleString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            )}

                            {/* QR CODE */}
                            <img
                                src={tk.qr_png}
                                alt="QR Code"
                                style={{
                                    width: 180,
                                    height: 180,
                                    margin: "16px auto",
                                    padding: 12,
                                    background: "#ffffff",
                                    borderRadius: "12px",
                                    border: "2px solid #e3f2fd",
                                    boxShadow: "0 0 8px rgba(33,150,243,0.25)"
                                }}
                            />

                            {/* DOWNLOAD BUTTON */}
                            <button
                                onClick={() => downloadQR(tk.qr_png, tk.ma_su_kien)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: 12,
                                    background: "#2196f3",
                                    borderRadius: "10px",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: "700",
                                    fontSize: 14,
                                    transition: "all 0.25s",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = "#1976d2";
                                    e.target.style.transform = "scale(1.03)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = "#2196f3";
                                    e.target.style.transform = "scale(1)";
                                }}
                            >
                                ⬇ Tải QR Code
                            </button>

                            {/* CHECK-IN STATUS */}
                            <div
                                style={{
                                    marginTop: 16,
                                    padding: "12px",
                                    borderRadius: "10px",
                                    fontWeight: "600",
                                    fontSize: 14,
                                    background: tk.check_in
                                        ? "rgba(46, 204, 113, 0.2)"
                                        : "rgba(255,193,7,0.2)",
                                    color: tk.check_in ? "#2ecc71" : "#d97706",
                                    border: tk.check_in
                                        ? "1px solid rgba(39,174,96,0.5)"
                                        : "1px solid rgba(251,191,36,0.6)",
                                }}
                            >
                                {tk.check_in ? "✔ ĐÃ CHECK-IN" : "⏳ CHƯA CHECK-IN"}
                            </div>

                            {/* CHECK-IN TIME */}
                            {tk.check_in && tk.thoi_gian_checkin && (
                                <p
                                    style={{
                                        marginTop: 8,
                                        fontSize: 12,
                                        color: "#555",
                                    }}
                                >
                                    Check-in lúc:{" "}
                                    {new Date(tk.thoi_gian_checkin).toLocaleString("vi-VN")}
                                </p>
                            )}

                            {/* POINTS */}
                            {(tk.diem_cong || tk.points) && (
                                <div
                                    style={{
                                        marginTop: 12,
                                        padding: 10,
                                        borderRadius: 8,
                                        background: "rgba(3,169,244,0.15)",
                                        border: "1px solid rgba(3,169,244,0.4)",
                                    }}
                                >
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: 14,
                                            color: "#0277bd",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        ⭐ Điểm nhận: {tk.diem_cong || tk.points || 0} điểm
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTickets;
