import React, { useState, useEffect } from "react";
import EventForm from "../components/EventForm";
import { useAuth } from "../context/AuthContext";

const FootballEventDetail = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);    // số lượng đăng ký thật
    const [capacity, setCapacity] = useState(50);     // giới hạn tối đa
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 2;  // ❤️ ID sự kiện bóng đá trong DB của bạn

    // ================= KIỂM TRA HẠN ĐĂNG KÝ =================
    const deadline = new Date("2025-12-20T23:59:59");
    const isExpired = new Date() > deadline;

    // ================= LOAD SỐ LƯỢNG =================
    // =========== LOAD SỐ LƯỢNG ĐĂNG KÝ ===========
    useEffect(() => {
        const fetchCount = async () => {
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

        fetchCount();
    }, []);

    // ================= XỬ LÝ ĐĂNG KÝ =================
    const handleRegister = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập trước khi đăng ký!");
            return;
        }

        if (isExpired) {
            alert("⚠ Đã hết hạn đăng ký giải bóng đá!");
            return;
        }

        if (attendees >= capacity) {
            alert("⚠ Giải bóng đá đã đủ số lượng!");
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
            setShowForm(true);
            setAttendees(prev => prev + 1);

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
                background: "linear-gradient(to bottom, #1e3a8a, #1e40af)",
                color: "white",
                minHeight: "100vh",
                padding: "60px 20px",
            }}
        >
            {/* ======== TIÊU ĐỀ ========= */}
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "34px",
                    fontWeight: "bold",
                    marginBottom: "30px",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                }}
            >
                ⚽ GIẢI BÓNG ĐÁ TRUYỀN THỐNG HCMUNRE CUP 2025 ⚽
                <br />
                <span style={{ fontSize: "20px", color: "#dbeafe" }}>
                    “Tinh thần thể thao – Đoàn kết – Bản lĩnh – Tỏa sáng!”
                </span>
            </h2>

            {/* ======== KHUNG NỘI DUNG ========= */}
            <div
                style={{
                    backgroundColor: "#1e293b",
                    color: "#e2e8f0",
                    padding: "32px",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "820px",
                    margin: "0 auto",
                    border: "1px solid #38bdf8",
                    lineHeight: "1.8",
                    fontSize: "16px",
                    boxShadow: "0 0 25px rgba(0,0,0,0.2)",
                }}
            >
                <p>
                    <strong>
                        Hãy nhanh tay đăng ký tham gia Giải bóng đá truyền thống HCMUNRE CUP 2025!
                    </strong>
                </p>

                <p>
                    <strong>📅 Thời gian thi đấu:</strong> 15, 16, 22, 23 tháng 3 năm 2025<br />
                    <strong>📍 Địa điểm:</strong> Sân bóng Chảo Lửa, Tân Bình<br />
                    <strong>🎯 Số lượng đăng ký:</strong> {attendees}/{capacity} đội
                </p>

                <p>
                    <strong>🏆 Giải thưởng:</strong><br />
                    • 🥇 Nhất (Nam/Nữ): 1.800.000đ – 1.500.000đ<br />
                    • 🥈 Nhì: 1.500.000đ – 1.000.000đ<br />
                    • 🥉 Ba: 1.200.000đ – 800.000đ<br />
                    • 🧤 Thủ môn xuất sắc<br />
                    • ⚽ Vua phá lưới / Cầu thủ xuất sắc
                </p>

                <p>
                    <strong>⏳ Hạn đăng ký:</strong> 10/03/2025
                </p>

                <p>
                    <strong>💳 Lệ phí:</strong><br />
                    Nam: 1.200.000đ – ký quỹ 300.000đ<br />
                    Nữ: 800.000đ – ký quỹ 300.000đ
                </p>

                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#fcd34d",
                        textAlign: "center",
                        marginTop: "24px",
                    }}
                >
                    ⚽ Hãy cùng viết nên mùa giải bùng nổ nhất năm 2025! ⚽
                </div>

                {/* ======== NÚT ========= */}
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

                {/* ======== FORM ========= */}
                {showForm && (
                    <EventForm
                        eventId={eventId}
                        eventTitle="Giải bóng đá truyền thống HCMUNRE CUP 2025"
                        user={user}
                        onSubmit={() => setShowForm(false)}
                    />
                )}
            </div>
        </div>
    );
};

const buttonPrimary = {
    backgroundColor: "#38bdf8",
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

export default FootballEventDetail;
