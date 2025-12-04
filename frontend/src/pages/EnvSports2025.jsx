import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from '../context/AuthContext';

const EnvSports2025 = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);
    const [capacity, setCapacity] = useState(300); // theo Events.jsx
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 18; // ⭐ ID sự kiện Hội thao

    // =============== KIỂM TRA HẠN ĐĂNG KÝ ===============
    const deadline = new Date("2025-12-20T23:59:59");
    const isExpired = new Date() > deadline;

    // =============== LOAD SỐ NGƯỜI ĐÃ ĐĂNG KÝ ===============
    useEffect(() => {
        const loadCount = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 300);
            } catch (err) {
                console.log("Lỗi load attendees:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCount();
    }, []);

    // =============== XỬ LÝ ĐĂNG KÝ ===============
    const handleOpenForm = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập trước!");
            return;
        }

        if (isExpired) {
            alert("⚠ Đã hết hạn đăng ký tham gia Hội thao!");
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

            setAttendees(prev => prev + 1);
            setShowForm(true);

        } catch (err) {
            console.log(err);
            alert("Không thể kết nối server!");
        }
    };

    if (isLoading)
        return <div style={{ color: "#fff", textAlign: "center", padding: 50 }}>⏳ Đang tải...</div>;

    return (
        <div
            style={{
                background: 'linear-gradient(to bottom, #166534, #065f46)',
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
                    marginBottom: '30px'
                }}
            >
                🏆 HỘI THAO KHOA MÔI TRƯỜNG 2025
                <br />
                <span style={{ fontSize: '20px', color: '#bbf7d0' }}>
                    Sẵn sàng bùng nổ – Cháy hết mình cùng tuổi trẻ Môi Trường!
                </span>
            </h2>

            <div
                style={{
                    backgroundColor: '#14532d',
                    padding: '32px',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '820px',
                    margin: '0 auto',
                    border: '1px solid #86efac',
                    lineHeight: '1.8',
                    fontSize: '16px'
                }}
            >
                <p>
                    Một mùa hội thao mới chính thức khởi động! 🌿
                    Khoa Môi Trường đã sẵn sàng bật tung năng lượng, cháy hết mình cùng những trận đấu gay cấn!
                </p>

                <p>
                    Hội thao không chỉ là nơi tranh tài – mà còn là nơi gắn kết, lan tỏa niềm vui và khẳng định bản lĩnh sinh viên.
                </p>

                <p>
                    <strong>⚽ Sân chơi dành cho tất cả sinh viên Khoa Môi Trường!</strong><br />
                    • Tốc độ – Khéo léo – Dẻo dai.<br />
                    • Muốn vui – Muốn trải nghiệm – Muốn gắn kết.<br />
                </p>

                <p>
                    <strong>🗓 Thời gian đăng ký:</strong> 03/11/2025 – 16/11/2025<br />
                    <strong>📍 Địa điểm:</strong> Sân vận động & khuôn viên Trường ĐH Tài nguyên và Môi trường TP.HCM<br />
                    <strong>👥 Đối tượng:</strong> Sinh viên Khoa Môi Trường
                </p>

                <p>
                    <strong>💪 Lý do không thể bỏ lỡ:</strong><br />
                    • Tranh tài – Gắn kết – Vui chơi.<br />
                    • Tạo khoảnh khắc đáng nhớ.<br />
                    • Đem vinh quang về cho chi đội.
                </p>

                <div
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#fcd34d',
                        textAlign: 'center',
                        marginTop: '24px'
                    }}
                >
                    🌿 CHƠI HẾT MÌNH – VUI HẾT NẤC – CHIẾN THẮNG HẾT CỠ! 🌿
                    <br />
                    {attendees}/{capacity} bạn đã đăng ký
                </div>

                {/* ====================== NÚT HÀNH ĐỘNG ====================== */}
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
                                padding: '10px 20px',
                                borderRadius: '6px',
                                border: 'none',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'not-allowed'
                            }}
                        >
                            🔒 KHÔNG THỂ ĐĂNG KÝ
                        </button>
                    ) : (
                        <button
                            onClick={handleOpenForm}
                            style={{
                                backgroundColor: '#8b5cf6',
                                border: 'none',
                                padding: '10px 20px',
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
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Quay lại trang Sự kiện
                    </button>
                </div>

                {/* ====================== FORM ====================== */}
                {showForm && !isExpired && (
                    <div style={{ marginTop: '24px' }}>
                        <EventForm
                            eventId={eventId}
                            eventTitle="Hội thao Khoa Môi Trường 2025"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnvSports2025;
