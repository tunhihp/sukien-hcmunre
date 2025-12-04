// frontend/src/pages/admin/AdminExtend.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_BASE = "http://localhost:3001";

function AdminExtend() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const getToken = () => localStorage.getItem("token");

    const handleAuthGuard = () => {
        alert("Vui lòng đăng nhập lại!");
        navigate("/login");
    };

    const fetchConversations = async () => {
        try {
            setLoadingConversations(true);
            const token = getToken();
            if (!token) {
                handleAuthGuard();
                return;
            }

            const res = await fetch(`${API_BASE}/api/admin/chat/conversations`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                if (res.status === 403) {
                    alert("Bạn không có quyền truy cập trang này!");
                    navigate("/");
                    return;
                }
                throw new Error("Không thể tải danh sách hội thoại");
            }

            const data = await res.json();
            setConversations(data.conversations || []);
        } catch (error) {
            console.error("fetchConversations error:", error);
            alert("Lỗi khi tải danh sách hội thoại!");
        } finally {
            setLoadingConversations(false);
        }
    };

    const fetchMessages = async (userId, silent = false) => {
        try {
            if (!silent) setLoadingMessages(true);
            const token = getToken();
            if (!token) {
                handleAuthGuard();
                return;
            }

            const res = await fetch(`${API_BASE}/api/chat/conversation/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Không thể tải cuộc hội thoại");
            }

            const data = await res.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error("fetchMessages error:", error);
            if (!silent) alert("Lỗi khi tải cuộc hội thoại!");
        } finally {
            if (!silent) setLoadingMessages(false);
        }
    };

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation.user_id);
    };

    const handleSendReply = async () => {
        if (!replyContent.trim()) {
            alert("Vui lòng nhập nội dung tin nhắn!");
            return;
        }
        if (!selectedConversation) {
            alert("Vui lòng chọn một cuộc hội thoại!");
            return;
        }

        try {
            setSending(true);
            const token = getToken();
            if (!token) {
                handleAuthGuard();
                return;
            }

            const body = {
                sender_type: "admin",
                sender_id: user?.ma_nguoi_dung || user?.id,
                receiver_id: selectedConversation.user_id,
                content: replyContent.trim()
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
                throw new Error(data.message || "Gửi tin nhắn thất bại");
            }

            setReplyContent("");
            fetchMessages(selectedConversation.user_id, true);
            fetchConversations();
        } catch (error) {
            console.error("handleSendReply error:", error);
            alert(error.message || "Không thể gửi tin nhắn!");
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (!selectedConversation) return;
        const interval = setInterval(() => {
            fetchMessages(selectedConversation.user_id, true);
        }, 8000);
        return () => clearInterval(interval);
    }, [selectedConversation]);

    const filteredConversations = useMemo(() => {
        if (!searchTerm.trim()) return conversations;
        const keyword = searchTerm.toLowerCase();
        return conversations.filter((conv) => {
            const { ho_ten = "", email = "", mssv = "" } = conv;
            return (
                ho_ten.toLowerCase().includes(keyword) ||
                email.toLowerCase().includes(keyword) ||
                mssv.toLowerCase().includes(keyword)
            );
        });
    }, [conversations, searchTerm]);

    const stats = useMemo(() => {
        const totalMessages = conversations.reduce((sum, conv) => sum + (conv.so_tin_nhan || 0), 0);
        const today = new Date().toDateString();
        const todayMessages = conversations.reduce((sum, conv) => {
            const last = conv.tin_nhan_cuoi ? new Date(conv.tin_nhan_cuoi) : null;
            return last && last.toDateString() === today ? sum + 1 : sum;
        }, 0);
        return {
            totalConversations: conversations.length,
            totalMessages,
            todayMessages
        };
    }, [conversations]);

    const formatTime = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return "";

        const formatter = new Intl.DateTimeFormat("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",  // luôn ép về giờ VN
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour12: false,
        });

        const parts = formatter.formatToParts(date);
        const get = (type) => parts.find((p) => p.type === type)?.value || "";

        const hour = get("hour");
        const minute = get("minute");
        const day = get("day");
        const month = get("month");
        const year = get("year");

        return `${hour}:${minute} ${day}/${month}/${year}`;
    };

    return (
        <div
            style={{
                padding: '40px',
                background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
                minHeight: '100vh',
                color: '#0f172a',
                fontFamily: "Inter, Segoe UI, sans-serif"
            }}
        >
            <button
                onClick={() => navigate("/")}
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    backgroundColor: "#90caf9",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "1px solid #42a5f5",
                    color: "#0f172a",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "0.25s",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#64b5f6"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#90caf9"}
            >
                ⬅️ Quay lại
            </button>

            <h1
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
                💬 Hộp thư hai chiều
            </h1>

            <p
                style={{
                    textAlign: "center",
                    color: "#475569",
                    marginBottom: "30px",
                    fontSize: "15px"
                }}
            >
                Trả lời sinh viên nhanh chóng ngay trong bảng điều khiển admin
            </p>


            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                    marginBottom: "30px"
                }}
            >
                <StatCard
                    icon="👥"
                    label="Tổng cuộc hội thoại"
                    value={stats.totalConversations}
                    color="#90caf9"   // xanh pastel
                />
                <StatCard
                    icon="💌"
                    label="Tổng tin nhắn"
                    value={stats.totalMessages}
                    color="#64b5f6"   // xanh sáng đồng bộ dashboard
                />
                <StatCard
                    icon="📅"
                    label="Tin nhắn hôm nay"
                    value={stats.todayMessages}
                    color="#4dd0e1"   // xanh ngọc pastel hiện đại
                />
            </div>


            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "400px 1fr",
                    gap: "24px",
                    maxWidth: "1400px",
                    margin: "0 auto"
                }}
            >{/* Left column - Conversation list */}
                <div
                    style={{
                        backgroundColor: "rgba(255,255,255,0.75)",
                        borderRadius: "20px",
                        padding: "20px",
                        border: "2px solid #bbdefb",
                        minHeight: "600px",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                        transition: "0.3s"
                    }}
                >
                    <h2
                        style={{
                            fontSize: "20px",
                            marginBottom: "12px",
                            color: "#0f172a",
                            fontWeight: 600
                        }}
                    >
                        Danh sách hội thoại
                    </h2>

                    <input
                        type="text"
                        placeholder="🔍 Tìm theo tên, MSSV hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: "12px",
                            borderRadius: "12px",
                            border: "2px solid #90caf9",
                            backgroundColor: "#e3f2fd",
                            color: "#0f172a",
                            marginBottom: "16px",
                            fontSize: "14px",
                            outline: "none",
                            transition: "0.25s"
                        }}
                        onFocus={(e) => (e.target.style.backgroundColor = "#bbdefb")}
                        onBlur={(e) => (e.target.style.backgroundColor = "#e3f2fd")}
                    />

                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {loadingConversations ? (
                            <EmptyState
                                icon="⏳"
                                message="Đang tải hội thoại..."
                                subMessage="Vui lòng chờ trong giây lát"
                            />
                        ) : filteredConversations.length === 0 ? (
                            <EmptyState
                                icon="📭"
                                message="Không tìm thấy hội thoại"
                                subMessage="Hãy kiểm tra lại từ khóa tìm kiếm"
                            />
                        ) : (
                            filteredConversations.map((conv) => (
                                <ConversationCard
                                    key={conv.user_id}
                                    conversation={conv}
                                    isActive={selectedConversation?.user_id === conv.user_id}
                                    onClick={() => handleSelectConversation(conv)}
                                />
                            ))
                        )}
                    </div>
                </div>


                {/* Right column - Chat window */}
                <div
                    style={{
                        backgroundColor: "rgba(255,255,255,0.75)",
                        borderRadius: "20px",
                        padding: "20px",
                        border: "2px solid #bbdefb",
                        minHeight: "600px",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                        transition: "0.3s"
                    }}
                >
                    {!selectedConversation ? (
                        <EmptyState
                            icon="💌"
                            message="Chọn một hội thoại để xem chi tiết"
                            subMessage="Danh sách hội thoại nằm bên trái"
                        />
                    ) : (
                        <>
                            <ConversationHeader conversation={selectedConversation} />

                            <div
                                style={{
                                    flex: 1,
                                    overflowY: "auto",
                                    margin: "16px 0",
                                    paddingRight: "6px"
                                }}
                            >
                                {loadingMessages ? (
                                    <EmptyState
                                        icon="⏳"
                                        message="Đang tải nội dung..."
                                        subMessage="Vui lòng chờ trong giây lát"
                                    />
                                ) : messages.length === 0 ? (
                                    <EmptyState
                                        icon="✉️"
                                        message="Chưa có tin nhắn nào"
                                        subMessage="Hãy là người đầu tiên trả lời sinh viên này"
                                    />
                                ) : (
                                    messages.map((msg) => (
                                        <MessageBubble key={msg.id} message={msg} formatTime={formatTime} />
                                    ))
                                )}
                            </div>

                            <div
                                style={{
                                    borderTop: "2px solid #bbdefb",
                                    paddingTop: "16px"
                                }}
                            >
                                <textarea
                                    placeholder="Nhập nội dung phản hồi..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    rows={4}
                                    style={{
                                        width: "100%",
                                        borderRadius: "12px",
                                        border: "2px solid #90caf9",
                                        backgroundColor: "#e3f2fd",
                                        color: "#0f172a",
                                        padding: "14px",
                                        resize: "none",
                                        marginBottom: "12px",
                                        outline: "none",
                                        transition: "0.25s"
                                    }}
                                    onFocus={(e) => (e.target.style.backgroundColor = "#bbdefb")}
                                    onBlur={(e) => (e.target.style.backgroundColor = "#e3f2fd")}
                                />

                                <button
                                    onClick={handleSendReply}
                                    disabled={sending}
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        borderRadius: "12px",
                                        border: "none",
                                        fontWeight: "bold",
                                        background: sending
                                            ? "rgba(144,202,249,0.6)"
                                            : "linear-gradient(135deg, #64b5f6, #90caf9)",
                                        color: "#0f172a",
                                        cursor: sending ? "not-allowed" : "pointer",
                                        fontSize: "16px",
                                        transition: "0.25s"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!sending) e.target.style.opacity = "0.85";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!sending) e.target.style.opacity = "1";
                                    }}
                                >
                                    {sending ? "Đang gửi..." : "Gửi phản hồi"}
                                </button>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

const StatCard = ({ icon, label, value, color }) => (
    <div
        style={{
            backgroundColor: "rgba(255,255,255,0.75)",
            borderRadius: "18px",
            padding: "24px",
            border: `2px solid #bbdefb`,
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            transition: "0.25s",
            color: "#0f172a",
            cursor: "default"
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 12px 26px rgba(0,0,0,0.12)";
            e.currentTarget.style.borderColor = "#90caf9";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
            e.currentTarget.style.borderColor = "#bbdefb";
        }}
    >
        <div style={{ fontSize: "34px", marginBottom: "8px" }}>{icon}</div>

        <div style={{ fontSize: "34px", fontWeight: "bold", color: "#0f172a" }}>
            {value}
        </div>

        <div style={{ color: "#475569", marginTop: "4px", fontSize: 15 }}>
            {label}
        </div>
    </div>
);

const ConversationCard = ({ conversation, isActive, onClick }) => (
    <div
        onClick={onClick}
        style={{
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "12px",
            cursor: "pointer",
            background: isActive ? "rgba(187,222,251,0.85)" : "rgba(255,255,255,0.7)",
            border: isActive ? "2px solid #64b5f6" : "2px solid #bbdefb",
            boxShadow: isActive
                ? "0 6px 18px rgba(0,0,0,0.12)"
                : "0 4px 14px rgba(0,0,0,0.06)",
            transition: "0.25s",
            color: "#0f172a"
        }}
        onMouseEnter={(e) => {
            if (!isActive) {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.12)";
                e.currentTarget.style.borderColor = "#90caf9";
            }
        }}
        onMouseLeave={(e) => {
            if (!isActive) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderColor = "#bbdefb";
            }
        }}
    >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a" }}>
                {conversation.ho_ten}
            </span>

            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e40af" }}>
                {conversation.so_tin_nhan || 0} tin
            </span>
        </div>

        {/* Email */}
        <div style={{ fontSize: "13px", color: "#334155" }}>
            {conversation.email}
        </div>

        {/* MSSV */}
        {conversation.mssv && (
            <div style={{ fontSize: "12px", color: "#1e3a8a", marginTop: "4px" }}>
                🎓 MSSV: {conversation.mssv}
            </div>
        )}
    </div>
);


const ConversationHeader = ({ conversation }) => (
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #bbdefb",
            paddingBottom: "14px",
            marginBottom: "10px",
            color: "#0f172a"
        }}
    >
        {/* LEFT */}
        <div>
            {/* Tên sinh viên */}
            <h2 style={{ fontSize: "20px", margin: 0, color: "#0f172a", fontWeight: 700 }}>
                {conversation.ho_ten}
            </h2>

            {/* Email */}
            <p style={{ margin: "4px 0", color: "#475569", fontSize: "14px" }}>
                {conversation.email}
            </p>

            {/* MSSV + Lớp */}
            <div style={{ fontSize: "13px", color: "#1e3a8a", fontWeight: 500 }}>
                {conversation.mssv && <>🎓 MSSV: {conversation.mssv} &nbsp; • &nbsp;</>}
                {conversation.lop && <>📚 Lớp: {conversation.lop}</>}
            </div>
        </div>

        {/* BADGE – Tin nhắn */}
        <div
            style={{
                backgroundColor: "rgba(144,202,249,0.35)",
                padding: "8px 18px",
                borderRadius: "999px",
                border: "1px solid #90caf9",
                fontSize: "14px",
                fontWeight: 600,
                color: "#0f172a",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transition: "0.25s"
            }}
        >
            💬 {conversation.so_tin_nhan || 0} tin nhắn
        </div>
    </div>
);

const MessageBubble = ({ message, formatTime }) => {
    const isAdmin = message.sender === "admin";

    return (
        <div
            style={{
                display: "flex",
                justifyContent: isAdmin ? "flex-end" : "flex-start",
                marginBottom: "14px"
            }}
        >
            <div
                style={{
                    maxWidth: "70%",
                    padding: "12px 16px",
                    borderRadius: isAdmin
                        ? "16px 16px 0 16px"
                        : "16px 16px 16px 0",

                    /* 🎨 Màu nền */
                    background: isAdmin
                        ? "linear-gradient(135deg, #64b5f6, #90caf9)"        // Bong bóng admin
                        : "rgba(255,255,255,0.9)",                          // Bong bóng user

                    /* 🎨 Màu chữ */
                    color: isAdmin ? "#0f172a" : "#0f172a",

                    border: isAdmin
                        ? "1px solid #64b5f6"
                        : "1px solid #bbdefb",

                    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                    transition: "0.25s"
                }}
            >
                {/* Nội dung tin nhắn */}
                <div
                    style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontSize: "15px",
                        lineHeight: "1.45"
                    }}
                >
                    {message.message}
                </div>

                {/* Thời gian */}
                <div
                    style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        textAlign: "right",
                        color: "#475569"
                    }}
                >
                    {isAdmin ? "Admin • " : "Sinh viên • "}
                    {formatTime(message.created_at)}
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({ icon, message, subMessage }) => (
    <div
        style={{
            textAlign: "center",
            padding: "50px 20px",
            background: "rgba(255,255,255,0.75)",
            borderRadius: "18px",
            border: "2px solid #bbdefb",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            maxWidth: "420px",
            margin: "30px auto",
            color: "#0f172a",
            transition: "0.25s"
        }}
    >
        <div style={{ fontSize: "46px", marginBottom: "14px" }}>{icon}</div>

        <p style={{ fontSize: "18px", marginBottom: "6px", fontWeight: 600 }}>
            {message}
        </p>

        {subMessage && (
            <p style={{ fontSize: "14px", color: "#475569", marginTop: "4px" }}>
                {subMessage}
            </p>
        )}
    </div>
);


export default AdminExtend;
