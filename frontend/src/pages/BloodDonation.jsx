import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from '../context/AuthContext';

const BloodDonation = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);        // ⭐ số người đã đăng ký (thật)
    const [capacity, setCapacity] = useState(60);         // ⭐ cố định theo thông báo
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 3;   // ⭐ ID SỰ KIỆN (trùng Events.jsx)

    // =============== KIỂM TRA HẾT HẠN ===============
    const deadline = new Date("2025-12-20T15:00:00");
    const isExpired = new Date() > deadline;

    // =============== LOAD SỐ LƯỢNG ĐĂNG KÝ THẬT ===============
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 60);
            } catch (err) {
                console.log("Lỗi load attendees:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCount();
    }, []);

    // =============== XỬ LÝ ĐĂNG KÝ ===============
    const handleOpenForm = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập!");
            return;
        }

        if (isExpired) {
            alert("⚠ Sự kiện đã hết hạn đăng ký!");
            return;
        }

        if (attendees >= capacity) {
            alert("⚠ Đã đủ số lượng!");
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

            // ⭐ Cập nhật UI
            setAttendees(prev => prev + 1);
            setShowForm(true);

        } catch (err) {
            console.log("Lỗi đăng ký:", err);
        }
    };

    if (isLoading)
        return <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>⏳ Đang tải...</div>;

    return (
        <div style={{
            background: 'linear-gradient(to bottom, #1e1b4b, #2e1065)',
            color: 'white',
            minHeight: '100vh',
            padding: '60px 20px'
        }}>
            <h2 style={{
                textAlign: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                marginBottom: '24px'
            }}>
                🕒 THÔNG BÁO ĐĂNG KÝ HIẾN MÁU TÌNH NGUYỆN ĐỢT 3 - NĂM 2025
            </h2>

            <div style={{
                backgroundColor: '#2c225b',
                padding: '32px',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '750px',
                margin: '0 auto',
                border: '1px solid #a78bfa',
                lineHeight: '1.8',
                fontSize: '16px'
            }}>
                <p> 💓 Máu là món quà vô giá... Hiến máu là một nghĩa cử cao đẹp…</p>
                <p>Đoàn - Hội trường phối hợp cùng Quận Đoàn Tân Bình tổ chức đợt 3:</p>

                <p><strong>🗓️ Thời gian:</strong> 7h00 - 10h30, ngày 25/05/2025</p>
                <p><strong>🏫 Địa điểm:</strong> Nhà thiếu nhi Quận Tân Bình…</p>
                <p><strong>📞 Liên hệ:</strong> 0366 021 499 - Đ/c Hùng Cường</p>
                <p><strong>🔢 Số lượng:</strong> {attendees}/{capacity} người</p>
                <p><strong>⏰ Hạn chót đăng ký:</strong> 15h00 ngày 24/05/2025</p>

                <p style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#fcd34d',
                    textAlign: 'center'
                }}>
                    💖 MỖI GIỌT MÁU CHO ĐI - MỘT CUỘC ĐỜI Ở LẠI 💖
                </p>

                {/* ==================== NÚT HÀNH ĐỘNG ==================== */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    marginTop: '24px'
                }}>
                    {isExpired || attendees >= capacity ? (
                        <button
                            disabled
                            style={{
                                backgroundColor: '#9ca3af',
                                border: 'none',
                                padding: '10px 28px',
                                borderRadius: '6px',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'not-allowed'
                            }}
                        >
                            🔒 ĐÃ HẾT HẠN
                        </button>
                    ) : (
                        <button
                            onClick={handleOpenForm}
                            style={{
                                backgroundColor: '#8b5cf6',
                                border: 'none',
                                padding: '10px 28px',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Đăng ký
                        </button>
                    )}

                    <button
                        onClick={() => window.history.back()}
                        style={{
                            backgroundColor: '#e2e8f0',
                            color: '#111827',
                            padding: '10px 28px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Quay lại
                    </button>
                </div>

                {/* FORM */}
                {showForm && !isExpired && (
                    <div style={{ marginTop: '24px' }}>
                        <EventForm
                            eventId={eventId}
                            eventTitle="Hiến máu tình nguyện đợt 3 - 2025"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BloodDonation;
