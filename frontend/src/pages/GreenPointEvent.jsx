import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from "../context/AuthContext";

const GreenPointEvent = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);
    const [capacity, setCapacity] = useState(100);
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 12;

    // GreenPoint luôn mở đăng ký
    const isExpired = false;

    // =============== LẤY DỮ LIỆU SỐ LƯỢNG ===============
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

    // =============== XỬ LÝ NÚT ĐĂNG KÝ ===============
    const handleOpenForm = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập để đăng ký!");
            return;
        }

        if (isExpired) {
            alert("⚠ Hoạt động đã kết thúc!");
            return;
        }

        if (attendees >= capacity) {
            alert("⚠ Hoạt động đã đủ số lượng!");
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
            alert("Không thể kết nối server!");
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
                background: 'linear-gradient(to bottom, #065f46, #15803d)',
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
                ♻️ GREENPOINT – THU RÁC TÁI CHẾ, ĐỔI QUÀ XANH 🌿
            </h2>

            <div
                style={{
                    backgroundColor: '#166534',
                    padding: '32px',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '800px',
                    margin: '0 auto',
                    border: '1px solid #a7f3d0',
                    lineHeight: '1.8',
                    fontSize: '16px'
                }}
            >
                <p>
                    🔔 <strong>Reng reng reng! Sinh viên HCMUNRE đã sẵn sàng chưa?</strong> <br />
                    GreenPoint mang đến cho bạn hoạt động cực “xanh”: <strong>Thu rác tái chế – Đổi quà xanh</strong>!
                </p>

                <p>
                    <strong>🗓 Lịch hoạt động:</strong><br />
                    8h30 – 11h30, Thứ Năm hàng tuần<br />
                    <strong>📅 Thời gian:</strong> 25/09/2025 – 28/12/2025<br />
                    <strong>📍 Địa điểm:</strong> Đối diện phòng Y tế – Trường Đại học Tài Nguyên & Môi Trường
                </p>

                <p
                    style={{
                        marginTop: '10px',
                        fontWeight: 'bold',
                        fontSize: '17px',
                        color: '#fde047'
                    }}
                >
                    👥 Số lượng đã đăng ký: {attendees}/{capacity}
                </p>

                <div
                    style={{
                        fontSize: '19px',
                        fontWeight: 'bold',
                        color: '#facc15',
                        textAlign: 'center',
                        marginTop: '22px'
                    }}
                >
                    💚 Biến rác thành tài nguyên – hành động nhỏ tạo thay đổi lớn!
                </div>

                {/* ====== NÚT ====== */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
                        marginTop: '28px'
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
                            eventTitle="GreenPoint – Thu rác tái chế, đổi quà xanh"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GreenPointEvent;
