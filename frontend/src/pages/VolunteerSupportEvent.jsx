import React, { useState, useEffect } from "react";
import EventForm from "../components/EventForm";
import { useAuth } from "../context/AuthContext";

const VolunteerSupportEvent = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);       // ⭐ số người đã đăng ký (thật)
    const [capacity, setCapacity] = useState(10);        // ⭐ số lượng tối đa: 10 bạn
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 8; // ⭐ ID sự kiện thật

    // ================== KIỂM TRA SỰ KIỆN HẾT HẠN ==================
    const deadline = new Date("2025-12-20T17:00:00");
    const isExpired = deadline < new Date();

    // ================== LOAD SỐ LƯỢNG ĐĂNG KÝ THẬT ==================
    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 10);
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
            alert("⚠ Bạn cần đăng nhập trước khi đăng ký!");
            return;
        }

        if (isExpired) {
            alert("⚠ Sự kiện đã hết hạn!");
            return;
        }

        if (attendees >= capacity) {
            alert("⚠ Sự kiện đã đủ số lượng!");
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

            if (!data.success) {
                alert(data.message);
                return;
            }

            alert("🎉 Đăng ký thành công!");
            setAttendees(prev => prev + 1);
            setShowForm(true);

        } catch (err) {
            console.log(err);
            alert("Lỗi kết nối server!");
        }
    };

    if (isLoading)
        return <div style={{ color: "#fff", textAlign: "center", padding: 50 }}>⏳ Đang tải...</div>;

    return (
        <div
            style={{
                background: "linear-gradient(to bottom, #1e1b4b, #2e1065)",
                color: "white",
                minHeight: "100vh",
                padding: "60px 20px",
            }}
        >
            {/* ==================== TIÊU ĐỀ ==================== */}
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "34px",
                    fontWeight: "bold",
                    marginBottom: "30px",
                }}
            >
                💪 ĐỘI HÌNH THANH NIÊN TÌNH NGUYỆN – MÙA HÈ XANH 2025 💪
                <br />
                <span style={{ fontSize: "20px", color: "#ddd6fe" }}>
                    Chung tay hỗ trợ người dân – Vì cộng đồng văn minh 🌟
                </span>
            </h2>

            {/* ==================== KHUNG NỘI DUNG ==================== */}
            <div
                style={{
                    backgroundColor: "#2c225b",
                    color: "#ede9fe",
                    padding: "32px",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "820px",
                    margin: "0 auto",
                    border: "1px solid #a78bfa",
                    lineHeight: "1.8",
                    fontSize: "16px",
                    boxShadow: "0 0 25px rgba(0,0,0,0.15)",
                }}
            >
                <p>
                    <strong>📣 Nội dung:</strong> Hỗ trợ vận hành chính quyền hai cấp – thuộc
                    <strong> Mùa hè xanh 2025</strong>.
                </p>

                <p>
                    <strong>📅 Thời gian:</strong> 14/07/2025 → 01/08/2025 (Thứ 2 – Thứ 6)
                </p>

                <p>
                    <strong>👥 Số lượng:</strong> {attendees}/{capacity} bạn (tối đa 10 bạn)
                </p>

                <p>
                    <strong>📍 Địa điểm:</strong> UBND – Trung tâm Phục vụ Hành chính công phường Tân Sơn Hòa
                </p>

                <p>
                    <strong>🕐 Thời gian làm việc:</strong><br />
                    • Sáng: 7h30 – 11h30<br />
                    • Chiều: 13h00 – 17h00
                </p>

                <p>
                    <strong>📅 Các tuần thực hiện:</strong><br />
                    • Tuần 1: 14/7 – 18/7/2025<br />
                    • Tuần 2: 21/7 – 25/7/2025<br />
                    • Tuần 3: 28/7 – 01/08/2025
                </p>

                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#fcd34d",
                        textAlign: "center",
                        marginTop: "20px",
                    }}
                >
                    🌟 Lan tỏa tinh thần trẻ – Hành động vì cộng đồng! 🌟
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
                            disabled
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
                        eventTitle="Đội hình Thanh niên Tình nguyện – Mùa hè xanh 2025"
                        user={user}
                        onSubmit={() => setShowForm(false)}
                    />
                )}
            </div>
        </div>
    );
};

const buttonPrimary = {
    backgroundColor: "#8b5cf6",
    padding: "10px 20px",
    borderRadius: "6px",
    color: "white",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
};

const buttonSecondary = {
    backgroundColor: "#e2e8f0",
    color: "#111827",
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
};

export default VolunteerSupportEvent;
