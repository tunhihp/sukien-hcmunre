import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from "../context/AuthContext";

const FutureGreenEvent = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);  // Số lượng đăng ký thật
    const [capacity, setCapacity] = useState(100);  // Sức chứa sự kiện
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 11;   // ⭐ ID trong bảng su_kien

    // ========= KIỂM TRA HẠN ĐĂNG KÝ =========
    const deadline = new Date("2025-12-20T23:59:59");
    const isExpired = new Date() > deadline;

    // ========= LẤY DỮ LIỆU SỐ LƯỢNG TỪ DB =========
    useEffect(() => {
        const loadCount = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 100);
            } catch (err) {
                console.log("Lỗi load số lượng:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCount();
    }, []);

    // ========= XỬ LÝ NÚT ĐĂNG KÝ =========
    const handleOpenForm = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập để tiếp tục!");
            return;
        }

        if (isExpired) {
            alert("⚠ Đã hết hạn đăng ký hội thi!");
            return;
        }

        if (attendees >= capacity) {
            alert("⚠ Sự kiện đã đủ số lượng người tham gia!");
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

            setAttendees(prev => prev + 1);
            setShowForm(true);

        } catch (err) {
            console.log(err);
            alert("Không thể kết nối đến server!");
        }
    };

    if (isLoading)
        return (
            <div style={{ color: "white", textAlign: "center", padding: "50px" }}>
                ⏳ Đang tải dữ liệu...
            </div>
        );

    return (
        <div
            style={{
                background: 'linear-gradient(to bottom, #064e3b, #14532d)',
                color: 'white',
                minHeight: '100vh',
                padding: '60px 20px'
            }}
        >
            <h2
                style={{
                    textAlign: 'center',
                    fontSize: '34px',
                    fontWeight: 'bold',
                    marginBottom: '28px'
                }}
            >
                🌱 HỘI THI HỌC THUẬT “TƯƠNG LAI XANH – ACT FOR A SUSTAINABLE FUTURE” 🌏
            </h2>

            <div
                style={{
                    backgroundColor: '#166534',
                    padding: '32px',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '800px',
                    margin: '0 auto',
                    border: '1px solid #86efac',
                    lineHeight: '1.8',
                    fontSize: '16px'
                }}
            >
                <p>
                    💡 <strong>Bạn đam mê môi trường, yêu thích kiến thức xanh và mong muốn góp phần bảo vệ Trái Đất?</strong>
                </p>

                <p>
                    Hãy nhanh tay đăng ký tham gia để:<br />
                    • Thử thách bản thân với các câu hỏi thú vị về phát triển bền vững.<br />
                    • Rinh về những phần thưởng hấp dẫn.<br />
                    • Gặp gỡ những người bạn cùng chí hướng.
                </p>

                <p>
                    <strong>📅 Thời gian đăng ký:</strong> 23/9/2025 – 03/10/2025 <br />
                    <strong>💰 Lệ phí:</strong> 80.000đ/người
                </p>

                <p>
                    <strong>🎁 Quyền lợi khi tham gia:</strong><br />
                    • Nhận 5 điểm rèn luyện và chứng nhận hoạt động. <br />
                    • Cơ hội trở thành đại sứ “Sinh viên vì Môi Trường Bền Vững”.
                </p>

                <p
                    style={{
                        marginTop: '10px',
                        fontWeight: 'bold',
                        color: '#fef9c3'
                    }}
                >
                    👥 Số lượng đã đăng ký: {attendees}/{capacity}
                </p>

                <div
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#fef9c3',
                        textAlign: 'center',
                        marginTop: '22px'
                    }}
                >
                    🌎 Hãy cùng hành động vì một tương lai xanh ngay hôm nay! 🌿
                </div>

                {/* ====== BUTTON ====== */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
                        marginTop: '26px'
                    }}
                >
                    {(isExpired || attendees >= capacity) ? (
                        <button
                            disabled
                            style={{
                                backgroundColor: '#9ca3af',
                                padding: '10px 22px',
                                borderRadius: '8px',
                                border: 'none',
                                color: 'white',
                                cursor: 'not-allowed',
                                fontWeight: 'bold'
                            }}
                        >
                            🔒 KHÔNG THỂ ĐĂNG KÝ
                        </button>
                    ) : (
                        <button
                            onClick={handleOpenForm}
                            style={{
                                backgroundColor: '#22c55e',
                                border: 'none',
                                padding: '10px 22px',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Đăng ký tham gia
                        </button>
                    )}

                    <button
                        onClick={() => window.history.back()}
                        style={{
                            backgroundColor: '#e2e8f0',
                            color: '#111827',
                            padding: '10px 22px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Quay lại
                    </button>
                </div>

                {/* ====== FORM ====== */}
                {showForm && !isExpired && (
                    <div style={{ marginTop: '24px' }}>
                        <EventForm
                            eventId={eventId}
                            eventTitle="Hội thi Tương lai xanh 2025"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FutureGreenEvent;
