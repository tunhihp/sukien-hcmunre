import React, { useState, useEffect } from "react";
import EventForm from "../components/EventForm";
import { useAuth } from "../context/AuthContext";

const BloodDonation2025 = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);        // ⭐ số người đã đăng ký (thật)
    const [capacity, setCapacity] = useState(400);        // ⭐ số lượng tối đa
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 20;

    // ================== KIỂM TRA SỰ KIỆN HẾT HẠN ==================
    const eventDate = new Date("2025-12-20T06:30:00");
    const isExpired = new Date("2025-12-20T23:59:59") < new Date();

    // ================== LOAD SỐ LƯỢNG ĐĂNG KÝ THẬT ==================
    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/eventCount/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 400);
            } catch (err) {
                console.log("Lỗi load số lượng:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendees();
    }, []);

    // ================== XỬ LÝ ĐĂNG KÝ SỰ KIỆN ==================
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

            if (data.success === false) {
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

    if (isLoading) return <div style={{ color: "#fff", textAlign: "center", padding: 50 }}>⏳ Đang tải...</div>;

    return (
        <div
            style={{
                background: "linear-gradient(to bottom, #f87171, #b91c1c)",
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
                    textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                }}
            >
                ❤️ HIẾN MÁU TÌNH NGUYỆN ĐỢT 5 – NĂM 2025 ❤️
                <br />
                <span style={{ fontSize: "20px", color: "#ffe4e6" }}>
                    “Mỗi giọt máu cho đi – Một cuộc đời ở lại.”
                </span>
            </h2>

            {/* ==================== KHUNG NỘI DUNG ==================== */}
            <div
                style={{
                    backgroundColor: "#fca5a5",
                    color: "#450a0a",
                    padding: "32px",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "820px",
                    margin: "0 auto",
                    border: "1px solid #fecaca",
                    lineHeight: "1.8",
                    fontSize: "16px",
                    boxShadow: "0 0 25px rgba(0,0,0,0.15)",
                }}
            >
                <p>
                    <strong>
                        Hãy cùng nhau lan tỏa yêu thương qua Chương trình Hiến máu Tình nguyện Đợt 5 – Năm 2025
                    </strong>.
                </p>

                <p>
                    <strong>📅 Thời gian:</strong> 6h30 – 10h30, ngày 18/11/2025<br />
                    <strong>📍 Địa điểm:</strong> Hội trường A – Trường ĐH Tài nguyên & Môi trường TP.HCM<br />
                    <strong>🎯 Số lượng huy động:</strong> {attendees}/{capacity} người
                </p>

                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#7f1d1d",
                        textAlign: "center",
                        marginTop: "24px",
                    }}
                >
                    ❤️ Cùng nhau viết tiếp hành trình “Trao máu – Trao niềm tin – Trao sự sống”! ❤️
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
                            Đăng ký
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
                        eventTitle="Hiến máu tình nguyện đợt 5 - 2025"
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

export default BloodDonation2025;
