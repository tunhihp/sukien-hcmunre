import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.jpg';

const API_BASE = "http://localhost:3001";

function Extend() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const messagesEndRef = useRef(null);

    const getToken = () => localStorage.getItem("token");
    const currentUserId = user?.ma_nguoi_dung || user?.id;

    // Luôn đưa trang về đầu mỗi khi mở trang Extend
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Kiểm tra đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const fetchMessages = async (silent = false) => {
        try {
            if (!currentUserId) return;
            if (!silent) setLoadingMessages(true);

            const token = getToken();
            if (!token) {
                navigate("/login");
                return;
            }

            const res = await fetch(`${API_BASE}/api/chat/conversation/${currentUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Không thể tải cuộc hội thoại");
            }

            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err) {
            console.error("Lỗi tải cuộc hội thoại:", err);
        } finally {
            if (!silent) setLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (!currentUserId) return;
        fetchMessages();

        // Tự động làm mới sau mỗi 8 giây để nhận phản hồi mới từ admin
        const interval = setInterval(() => {
            fetchMessages(true);
        }, 8000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId]);

    const handleSend = async () => {
        if (!input.trim()) {
            alert("Vui lòng nhập nội dung!");
            return;
        }

        if (!isAuthenticated || !user) {
            alert("Vui lòng đăng nhập để gửi tin nhắn!");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const token = getToken();
            if (!token) {
                alert("Vui lòng đăng nhập lại!");
                navigate("/login");
                return;
            }

            const body = {
                sender_type: "student",
                sender_id: currentUserId,
                content: input.trim()
            };

            const res = await fetch(`${API_BASE}/api/chat/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                alert(data.message || "Gửi tin nhắn thất bại!");
                return;
            }

            setInput('');

            // Cập nhật ngay trên UI
            await fetchMessages(true);
        } catch (err) {
            console.error("Lỗi gửi tin nhắn:", err);
            alert("Không thể kết nối server! Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    return (
        <div
            style={{
                background: "#e8f6ff",
                minHeight: "100vh",
                padding: "40px 20px",
                fontFamily: "Inter, sans-serif",
                color: "#0f172a"
            }}
        >
            {/* TITLE */}
            
            <h2
                style={{
                    fontSize: "34px",
                    marginBottom: "32px",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#0f172a",
                    padding: "14px 28px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(144,202,249,0.6)",
                    boxShadow: "0 6px 20px rgba(144,202,249,0.25)",
                    display: "inline-block",
                    marginLeft: "50%",
                    transform: "translateX(-50%)",
                    backdropFilter: "blur(6px)"
                }}
            >
                 Bạn muốn chia sẻ – Nhà trường sẽ lắng nghe
            </h2>
            <p
                style={{
                    textAlign: "center",
                    fontSize: "17px",
                    color: "#475569",
                    marginBottom: "40px"
                }}
            >
                Chia sẻ cảm xúc – nhận phản hồi từ ban tổ chức
            </p>

            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1.2fr",
                    gap: "30px"
                }}
            >
                {/* LEFT CARD */}
                <div
                    style={{
                        background: "white",
                        padding: "24px",
                        borderRadius: "16px",
                        border: "1px solid #cce7ff",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
                    }}
                >
                    <h3
                        style={{
                            color: "#0f172a",
                            fontWeight: "700",
                            marginBottom: "10px",
                            fontSize: "20px"
                        }}
                    >
                        💗 Hỗ trợ tinh thần
                    </h3>

                    <p style={{ color: "#475569", fontSize: "15px", marginBottom: "16px" }}>
                        Hộp thư hai chiều giúp bạn chia sẻ điều khó nói. Mọi tin nhắn được bảo mật và admin sẽ phản hồi sớm nhất.
                    </p>

                    <ul
                        style={{
                            paddingLeft: "20px",
                            lineHeight: "1.7",
                            fontSize: "14px",
                            color: "#334155"
                        }}
                    >
                        <li>Chia sẻ tâm sự, khó khăn trong học tập.</li>
                        <li>Góp ý các phong trào, sự kiện của trường.</li>
                        <li>Nhận lời khuyên từ ban tổ chức.</li>
                    </ul>
                    {/* Sticker động hộp thư */}
                    <img
                        src="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyNmp1MDRpYTNkNzZxMnlpOXh2c2xmeHRnMXJxYnpucmV0bDRscDF3ZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jSWNK7NN0rIPvPmYux/200.gif"
                        alt="mail-sticker"
                        style={{
                            width: "160px",              // ⭐ Tăng kích thước
                            display: "block",
                            margin: "20px auto 0 auto",   // ⭐ Canh giữa hoàn toàn
                            filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))",
                            borderRadius: "12px"          // ⭐ Nhìn mềm và đẹp hơn
                        }}
                    />
                </div>

                {/* RIGHT CHAT CARD */}
                <div
                    style={{
                        background: "white",
                        padding: "24px",
                        borderRadius: "16px",
                        border: "1px solid #cce7ff",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "450px"
                    }}
                >
                    <h4
                        style={{
                            fontSize: "18px",
                            color: "#0f172a",
                            marginBottom: "14px",
                            fontWeight: "700"
                        }}
                    >
                        💬 Hôm nay bạn cảm thấy thế nào?
                    </h4>

                    {/* MESSAGE BOX */}
                    <div
                        style={{
                            flex: 1,
                            background: "#f0faff",
                            borderRadius: "12px",
                            border: "1px solid #bae6fd",
                            padding: "14px",
                            overflowY: "auto",
                            marginBottom: "14px"
                        }}
                    >
                        {loadingMessages ? (
                            <div style={{ textAlign: "center", padding: "20px", color: "#475569" }}>
                                Đang tải tin nhắn...
                            </div>
                        ) : messages.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                                Chưa có tin nhắn nào. Hãy chia sẻ cảm xúc của bạn nhé!
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isStudent = msg.sender !== "admin";

                                return (
                                    <div
                                        key={msg.id}
                                        style={{
                                            display: "flex",
                                            justifyContent: isStudent ? "flex-end" : "flex-start",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: "70%",
                                                background: isStudent
                                                    ? "linear-gradient(90deg,#38bdf8,#0ea5e9)"
                                                    : "white",
                                                border: isStudent
                                                    ? "none"
                                                    : "1px solid #cce7ff",
                                                color: isStudent ? "white" : "#0f172a",
                                                padding: "10px 14px",
                                                borderRadius: isStudent
                                                    ? "14px 14px 0 14px"
                                                    : "14px 14px 14px 0",
                                                fontSize: "14px",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                            }}
                                        >
                                            <div style={{ whiteSpace: "pre-wrap" }}>{msg.message}</div>
                                            <div
                                                style={{
                                                    marginTop: "6px",
                                                    fontSize: "11px",
                                                    textAlign: "right",
                                                    color: isStudent ? "white" : "#64748b"
                                                }}
                                            >
                                                {isStudent ? "Bạn • " : "Admin • "}
                                                {formatTime(msg.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* INPUT */}
                    <textarea
                        placeholder="Viết điều bạn muốn chia sẻ..."
                        style={{
                            width: "100%",
                            minHeight: "80px",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #bae6fd",
                            background: "white",
                            color: "#0f172a",
                            fontSize: "14px",
                            marginBottom: "12px",
                            outline: "none",
                            resize: "vertical",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                        }}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />

                    {/* SEND BUTTON */}
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: loading
                                ? "#0ea5e9aa"
                                : "linear-gradient(90deg,#38bdf8,#0ea5e9)",
                            borderRadius: "10px",
                            border: "none",
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: "0 4px 12px rgba(0,170,255,0.3)",
                            transition: "0.25s"
                        }}
                    >
                        {loading ? "⏳ Đang gửi..." : "🚀 Gửi tin nhắn"}
                    </button>
                </div>
            </div>

            {/* FOOTER */}
            <footer
                style={{
                    marginTop: "60px",
                    padding: "35px 20px",
                    background: "rgba(255, 255, 255, 0.6)",
                    borderTop: "2px solid #cce7ff",
                    fontFamily: "Arial, sans-serif",
                    backdropFilter: "blur(6px)",
                    borderRadius: "8px"
                }}
            >
                <div
                    style={{
                        maxWidth: "900px",
                        margin: "0 auto",
                        display: "flex",
                        gap: "25px",
                        alignItems: "flex-start"
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
                            background: "#fff"
                        }}
                    />

                    {/* RIGHT CONTENT */}
                    <div style={{ flex: 1 }}>
                        {/* Title */}
                        <p style={{ fontWeight: "700", fontSize: "20px", color: "#0f172a", marginBottom: "6px" }}>
                            HCMUNRE Event Manager
                        </p>

                        {/* Description (optional – giữ gọn) */}
                        <p style={{ fontSize: "14px", color: "#1e293b", marginBottom: "12px" }}>
                            Nền tảng hỗ trợ đăng ký sự kiện – quét mã QR – và quản lý điểm rèn luyện dành cho sinh viên.
                        </p>

                        {/* Contact Section */}
                        <p style={{ fontWeight: "700", fontSize: "15px", color: "#0d9488", marginBottom: "6px" }}>
                            Thông tin liên hệ
                        </p>
                        <p style={{ margin: "4px 0", fontSize: "14px", color: "#475569" }}>
                            📍 236B Lê Văn Sỹ, Phường Tân Sơn Hòa, TP. Hồ Chí Minh
                        </p>
                        <p style={{ margin: "4px 0", fontSize: "14px", color: "#475569" }}>
                            ✉️ 1050080149@hcmunre.edu.vn
                        </p>

                        {/* Copyright */}
                        <div style={{ marginTop: "10px", fontSize: "12px", color: "#64748b" }}>
                            © 2025 HCMUNRE - Phát triển bởi sinh viên, vì cộng đồng sinh viên.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Extend;
