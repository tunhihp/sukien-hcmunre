import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from '../context/AuthContext';

const BusOpeningEvent = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);
    const [capacity, setCapacity] = useState(20); // ⭐ cố định
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 9; // ⭐ ID sự kiện khớp với Events.jsx

    // =================== KIỂM TRA HẠN CHÓT ===================
    const deadline = new Date("2025-12-20T23:59:59");
    const isExpired = new Date() > deadline;

    // =================== LOAD SỐ LƯỢNG ĐĂNG KÝ ===================
    useEffect(() => {
        const loadCount = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 20);
            } catch (err) {
                console.log("Lỗi tải số lượng:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCount();
    }, []);

    // =================== ĐĂNG KÝ ===================
    const handleOpenForm = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập trước khi đăng ký!");
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

            setAttendees(prev => prev + 1);
            setShowForm(true);

        } catch (err) {
            console.log("Lỗi đăng ký:", err);
            alert("Lỗi server!");
        }
    };


    if (isLoading)
        return <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>⏳ Đang tải...</div>;

    return (
        <div
            style={{
                background: 'linear-gradient(to bottom, #1e3a8a, #1e40af)',
                color: 'white',
                minHeight: '100vh',
                padding: '60px 20px'
            }}
        >
            {/* Tiêu đề */}
            <h2
                style={{
                    textAlign: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '24px'
                }}
            >
                🚍 THAM GIA QUAY CLIP KHAI TRƯƠNG TUYẾN XE BUÝT BẾN THÀNH - NHÀ BÈ 🚍
            </h2>

            {/* Nội dung chính */}
            <div
                style={{
                    backgroundColor: '#1e293b',
                    padding: '32px',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '750px',
                    margin: '0 auto',
                    border: '1px solid #3b82f6',
                    lineHeight: '1.8',
                    fontSize: '16px'
                }}
            >
                <p>
                    🌟 <strong>Sự kiện đặc biệt:</strong> Tham gia cùng Đoàn trường quay clip chào mừng lễ khai trương
                    tuyến xe buýt <strong>Bến Thành – Nhà Bè</strong> nhằm lan tỏa hình ảnh năng động, hiện đại và thân thiện
                    của sinh viên HCMUNRE.
                </p>

                <p>
                    🕒 <strong>Thời gian:</strong> 13h00 – 17h00, ngày <strong>05/09/2025 (Thứ 6)</strong>
                </p>

                <p>
                    📍 <strong>Địa điểm:</strong> Trụ sở trường – 236B, Lê Văn Sỹ, Phường Tân Sơn Hòa, TP.HCM.<br />
                    (Xuất phát xe buýt từ trường qua Bến Thành, sau đó tiếp tục hành trình Bến Thành – Nhà Bè.)
                </p>

                <p>
                    🎟️ <strong>Vé xe:</strong> Được hỗ trợ vé xe buýt miễn phí (dự kiến).
                </p>

                <p>
                    👥 <strong>Số lượng:</strong> {attendees}/{capacity} sinh viên
                </p>

                <p>
                    👕 <strong>Trang phục:</strong> Áo sơ mi trường, gọn gàng, lịch sự.
                </p>

                <p>
                    ⚠️ <strong>Ghi chú:</strong> Đến đúng giờ để điểm danh.
                    Sinh viên tham gia được <strong>ghi nhận hoạt động Đoàn – Hội</strong> và <strong>tính điểm rèn luyện</strong>.
                </p>

                {/* Câu slogan kết */}
                <div
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#fcd34d',
                        textAlign: 'center',
                        marginTop: '20px'
                    }}
                >
                    💙Cùng nhau lan tỏa hình ảnh sinh viên HCMUNRE văn minh, hiện đại và năng động💙
                </div>

                {/* Nút hành động */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
                        marginTop: '24px'
                    }}
                >
                    {isExpired || attendees >= capacity ? (
                        <button
                            disabled
                            style={{
                                backgroundColor: '#9ca3af',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                border: 'none',
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
                                backgroundColor: '#3b82f6',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
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
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Quay lại
                    </button>
                </div>

                {/* Form */}
                {showForm && !isExpired && (
                    <div style={{ marginTop: '24px' }}>
                        <EventForm
                            eventId={eventId}
                            eventTitle="Quay clip khai trương tuyến xe buýt Bến Thành - Nhà Bè"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusOpeningEvent;
