import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from '../context/AuthContext';

const BeautyContest = () => {
    const { user, isAuthenticated } = useAuth();

    const eventId = 8;                  // ⭐ ID SỰ KIỆN
    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);
    const [capacity, setCapacity] = useState(200);
    const [isLoading, setIsLoading] = useState(true);

    // =============== KIỂM TRA HẾT HẠN ===============
    const deadline = new Date("2025-12-20T23:59:59");
    const isExpired = new Date() > deadline;

    // =============== LOAD SỐ NGƯỜI ĐĂNG KÝ ===============
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 200);
            } catch (err) {
                console.log("Lỗi tải attendees:", err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    // =============== XỬ LÝ ĐĂNG KÝ ===============
    const handleOpenForm = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập!");
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

            setAttendees(prev => prev + 1);
            setShowForm(true);
        } catch (err) {
            alert("Lỗi kết nối server!");
        }
    };

    if (isLoading)
        return <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>⏳ Đang tải...</div>;

    return (
        <div
            style={{
                background: 'linear-gradient(to bottom, #4c1d95, #581c87)',
                color: 'white',
                minHeight: '100vh',
                padding: '60px 20px',
            }}
        >
            {/* Tiêu đề */}
            <h2
                style={{
                    textAlign: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                }}
            >
                ✨ CUỘC THI “NÉT ĐẸP SINH VIÊN DTM 2025” ✨
                <br />
                <span style={{ fontSize: "20px", color: "#f9a8d4" }}>
                    Bright With Purpose – Rực rỡ cùng sứ mệnh
                </span>
            </h2>

            {/* Nội dung chính */}
            <div
                style={{
                    backgroundColor: '#3b0764',
                    padding: '32px',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '750px',
                    margin: '0 auto',
                    border: '1px solid #f9a8d4',
                    lineHeight: '1.8',
                    fontSize: '16px',
                }}
            >
                <p>
                    🌟 <strong>Đối tượng dự thi:</strong> Sinh viên nam, nữ hệ chính quy tại Trường ĐH TNMT TP.HCM.
                </p>

                <p>📏 <strong>Chiều cao:</strong> Nữ ≥ 1m55, Nam ≥ 1m65.</p>

                <p>🕒 <strong>Thời gian đăng ký:</strong> 11/08/2025 – 04/09/2025.</p>

                <p>📍 <strong>Địa điểm:</strong> Trường ĐH Tài nguyên & Môi trường TP.HCM</p>

                <h3 style={{ color: '#f9a8d4', marginTop: '20px' }}>📌 Quy định bình chọn</h3>

                <ul style={{ marginLeft: '20px' }}>
                    <li>1 Like/Tym = 3 điểm</li>
                    <li>1 Wow/Haha = 2 điểm</li>
                    <li>1 bình luận hợp lệ = 5 điểm</li>
                    <li>1 lượt Share công khai = 7 điểm</li>
                </ul>

                {/* Số lượng */}
                <p style={{ marginTop: "20px", color: "#fde047", fontWeight: "bold" }}>
                    🔥 Số lượng hiện tại: {attendees}/{capacity}
                </p>

                {/* Nút hành động */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
                        marginTop: '24px',
                    }}
                >
                    {isExpired || attendees >= capacity ? (
                        <button
                            style={{
                                backgroundColor: '#9ca3af',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                color: 'white',
                                fontWeight: 'bold',
                                border: 'none',
                                cursor: 'not-allowed',
                            }}
                            disabled
                        >
                            🔒 KHÔNG THỂ ĐĂNG KÝ
                        </button>
                    ) : (
                        <button
                            onClick={handleOpenForm}
                            style={{
                                backgroundColor: '#ec4899',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            }}
                        >
                            Đăng ký tham gia
                        </button>
                    )}

                    <button
                        onClick={() => window.history.back()}
                        style={{
                            backgroundColor: '#e2e8f0',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            color: '#111827',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Quay lại
                    </button>
                </div>

                {/* Form */}
                {showForm && !isExpired && (
                    <EventForm
                        eventId={eventId}
                        eventTitle="Cuộc thi Nét đẹp Sinh viên DTM 2025"
                        user={user}
                        onSubmit={() => setShowForm(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default BeautyContest;
