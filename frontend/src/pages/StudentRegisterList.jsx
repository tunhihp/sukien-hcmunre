import React, { useState, useEffect } from "react";
import EventForm from "../components/EventForm";
import { useAuth } from "../context/AuthContext";

const StudentRegisterList = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);     // số người đã đăng ký (thật)
    const [capacity, setCapacity] = useState(50);      // cần 50 bạn
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 1;

    // ================== THỜI HẠN SỰ KIỆN ==================
    const eventDeadline = new Date("2025-12-20T09:00:00");
    const isExpired = eventDeadline < new Date();

    // ================== LOAD SỐ LƯỢNG ĐĂNG KÝ ==================
    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 50);
            } catch (err) {
                console.log("Lỗi load số lượng:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendees();
    }, []);

    // ================== XỬ LÝ ĐĂNG KÝ ==================
    const handleRegister = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập để đăng ký tham gia!");
            return;
        }

        if (isExpired) {
            alert("⚠ Đã hết hạn đăng ký!");
            return;
        }

        if (attendees >= capacity) {
            alert("⚠ Số lượng đăng ký đã đủ!");
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/api/event/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ma_su_kien: eventId,
                    ma_nguoi_dung: user.ma_nguoi_dung
                })
            });

            const data = await res.json();
            if (data.success === false) {
                alert(data.message);
                return;
            }

            alert("🎉 Đăng ký thành công!");
            setAttendees(prev => prev + 1);
            setShowForm(true);

        } catch (err) {
            console.log(err);
            alert("Lỗi kết nối máy chủ!");
        }
    };

    if (isLoading)
        return (
            <div style={{ color: "#fff", textAlign: "center", padding: 50 }}>
                ⏳ Đang tải...
            </div>
        );

    return (
        <div
            style={{
                background: "linear-gradient(to bottom, #2563eb, #1e3a8a)",
                color: "white",
                minHeight: "100vh",
                padding: "60px 20px",
            }}
        >
            {/* ==================== TIÊU ĐỀ ==================== */}
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "32px",
                    fontWeight: "bold",
                    marginBottom: "30px",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
                }}
            >
                🎤 TALKSHOW BLOCKCHAIN – WEB3 – METAVERSE 🎤
                <br />
                <span style={{ fontSize: "20px", color: "#bfdbfe" }}>
                    “Kiến thức nền tảng – Cơ hội nghề nghiệp & Thách thức cho giới trẻ”
                </span>
            </h2>

            {/* ==================== KHUNG NỘI DUNG ==================== */}
            <div
                style={{
                    backgroundColor: "#93c5fd",
                    color: "#1e3a8a",
                    padding: "32px",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "850px",
                    margin: "0 auto",
                    border: "1px solid #bfdbfe",
                    lineHeight: "1.8",
                    fontSize: "16px",
                    boxShadow: "0 0 25px rgba(0,0,0,0.2)",
                }}
            >
                <p>
                    <strong>
                        Chương trình Talkshow đặc biệt dành cho sinh viên yêu thích công nghệ Blockchain, Web3 và Metaverse.
                    </strong>
                    <br />
                    Đây là cơ hội để khám phá kiến thức nền tảng – xu hướng mới – và định hướng nghề nghiệp trong tương lai.
                </p>

                <p>
                    <strong>📅 Thời gian:</strong> 13h30 — ngày 20/11/2024<br />
                    <strong>📍 Địa điểm:</strong> Hội trường A – Trụ sở chính<br />
                    <strong>🎯 Chỉ tiêu:</strong> {attendees}/{capacity} sinh viên
                </p>

                <p>
                    <strong>🔔 Lưu ý:</strong><br />
                    • Hạn chót đăng ký: <strong>09h00 – ngày 20/11/2024</strong><br />
                    • Sinh viên tham gia được tính <strong>điểm Công tác Đoàn – Hội</strong> theo quy định.
                </p>

                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#1e40af",
                        textAlign: "center",
                        marginTop: "24px",
                    }}
                >
                    🚀 Đừng bỏ lỡ cơ hội tiếp cận công nghệ của tương lai! 🚀
                </div>

                {/* ==================== NÚT ĐĂNG KÝ ==================== */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "12px",
                        marginTop: "24px",
                    }}
                >
                    {(isExpired || attendees >= capacity) ? (
                        <button
                            style={{
                                backgroundColor: "#9ca3af",
                                padding: "10px 20px",
                                borderRadius: "6px",
                                color: "white",
                                fontWeight: "bold",
                                border: "none",
                                cursor: "not-allowed",
                                boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                            }}
                            disabled
                        >
                            🔒 KHÔNG THỂ ĐĂNG KÝ
                        </button>
                    ) : (
                        <button onClick={handleRegister} style={buttonPrimary}>
                            Đăng ký tham gia
                        </button>
                    )}

                    <button
                        onClick={() => window.history.back()}
                        style={buttonSecondary}
                    >
                        Quay lại trang Sự kiện
                    </button>
                </div>

                {/* ==================== FORM ==================== */}
                {showForm && (
                    <EventForm
                        eventId={eventId}
                        eventTitle="Talkshow Blockchain – Web3 – Metaverse"
                        user={user}
                        onSubmit={() => setShowForm(false)}
                    />
                )}
            </div>
        </div>
    );
};

const buttonPrimary = {
    backgroundColor: "#3b82f6",
    padding: "10px 22px",
    borderRadius: "6px",
    color: "white",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
};

const buttonSecondary = {
    backgroundColor: "#e2e8f0",
    color: "#1e293b",
    padding: "10px 22px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
};

export default StudentRegisterList;
