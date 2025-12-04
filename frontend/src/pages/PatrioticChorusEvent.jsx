import React, { useState, useEffect } from "react";
import EventForm from "../components/EventForm";
import { useAuth } from "../context/AuthContext";

const PatrioticChorusEvent = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);   // số lượng thật
    const [capacity, setCapacity] = useState(50);    // giới hạn (mặc định 50)
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 30;   // 👉 ĐẶT ID SỰ KIỆN MỚI

    // ============== KIỂM TRA HẠN ==================
    const deadline = new Date("2025-12-20T23:59:59");
    const isExpired = new Date() > deadline;

    // ============== LOAD SỐ NGƯỜI ĐĂNG KÝ ==============
    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 50);
            } catch (err) {
                console.log("Lỗi tải số lượng:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendees();
    }, []);

    // ============== XỬ LÝ ĐĂNG KÝ ==============
    const handleRegister = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập trước khi đăng ký!");
            return;
        }

        if (isExpired) {
            alert("⚠ Đã hết hạn đăng ký chương trình!");
            return;
        }

        if (attendees >= capacity) {
            alert("⚠ Chương trình đã đủ số lượng!");
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
            alert("❌ Lỗi kết nối server!");
        }
    };

    if (isLoading) return (
        <div style={{ color: "#fff", textAlign: "center", padding: 50 }}>
            ⏳ Đang tải...
        </div>
    );

    return (
        <div
            style={{
                background: "linear-gradient(to bottom, #1e1b4b, #2e1065)",
                color: "white",
                minHeight: "100vh",
                padding: "60px 20px",
            }}
        >
            {/* ============ TIÊU ĐỀ ============ */}
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "34px",
                    fontWeight: "bold",
                    marginBottom: "30px",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                }}
            >
                💕 ĐỒNG DIỄN & HÒA CA “TÔI YÊU TỔ QUỐC TÔI” 💕
                <br />
                <span style={{ fontSize: "20px", color: "#c7d2fe" }}>
                    “Lan tỏa tinh thần Việt Nam – Niềm tự hào dân tộc.”
                </span>
            </h2>

            {/* ============ KHUNG NỘI DUNG ============ */}
            <div
                style={{
                    backgroundColor: "#2c225b",
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
                <p>📡 Thông báo số 15 về việc tổ chức Lễ Chào cờ “Tôi yêu Tổ quốc tôi” và Chương trình Hòa ca “Đất nước trọn niềm vui”.</p>

                <p>
                    💗 <strong>Cùng nhau viết tiếp “Câu chuyện Hòa bình”</strong>, lan toả yêu thương bằng âm nhạc và niềm tin của tuổi trẻ!
                </p>

                <p>
                    <strong>👉 Số lượng phân bổ:</strong> {attendees}/{capacity} bạn
                </p>

                <p><strong>⏰ Tập luyện:</strong> 17h30–20h00, Thứ Năm 17/6/2025 tại UEH Nguyễn Văn Linh</p>

                <p><strong>⏰ Tổng duyệt:</strong> 14h00, Thứ 7 ngày 19/5/2025 tại Nhà Văn Hóa Sinh Viên</p>

                <p><strong>⏰ Biểu diễn:</strong> 5h00 sáng – Bắt đầu chương trình 6h30, Chủ Nhật 20/6/2025</p>

                <p>
                    <strong>💗 Quyền lợi:</strong> Giấy chứng nhận, áo cờ đỏ sao vàng, cộng điểm rèn luyện, xác lập kỷ lục, được lên hình!
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
                    💕 HÃY CÙNG LAN TỎA NIỀM TỰ HÀO VIỆT NAM! 💕
                </div>

                {/* ============ NÚT ĐĂNG KÝ ============ */}
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
                            }}
                            disabled
                        >
                            🔒 KHÔNG THỂ ĐĂNG KÝ
                        </button>
                    ) : (
                        <button
                            onClick={handleRegister}
                            style={buttonPrimary}
                        >
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

                {/* ============ FORM ĐĂNG KÝ ============ */}
                {showForm && (
                    <EventForm
                        eventId={eventId}
                        eventTitle="Đồng diễn & Hòa ca – Tôi yêu Tổ quốc tôi 2025"
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

export default PatrioticChorusEvent;
