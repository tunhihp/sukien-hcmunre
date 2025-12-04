import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from '../context/AuthContext';

const UncleHoContest = () => {

    const { user, isAuthenticated } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);
    const [capacity, setCapacity] = useState(500);
    const [isLoading, setIsLoading] = useState(true);

    // 🔥 ID của sự kiện trong database = 6
    const eventId = 6;

    // 🔥 Hạn cuối đăng ký: 17g00 ngày 17/05/2025
    const deadline = new Date("2025-12-20T17:00:00");
    const isExpired = deadline < new Date();

    // ======================================================
    // LOAD SỐ LƯỢNG ĐĂNG KÝ
    // ======================================================
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 500);
            } catch (err) {
                console.log("Lỗi load số lượng:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCount();
    }, []);

    // ======================================================
    // ĐĂNG KÝ
    // ======================================================
    const handleRegister = async () => {

        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập để đăng ký!");
            return;
        }

        if (isExpired) {
            alert("⚠ Đã hết hạn đăng ký!");
            return;
        }

        if (attendees >= capacity) {
            alert("⚠ Đã đủ số lượng đăng ký!");
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

    if (isLoading)
        return <div style={{ textAlign: "center", color: "#fff", padding: 40 }}>⏳ Đang tải...</div>;

    // ======================================================
    // UI
    // ======================================================

    return (
        <div
            style={{
                background: 'linear-gradient(to bottom, #1e1b4b, #2e1065)',
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
                👑 CUỘC THI TÌM HIỂU VỀ CHỦ TỊCH HỒ CHÍ MINH LẦN III – 2025 👑
            </h2>

            <div
                style={{
                    backgroundColor: '#2c225b',
                    padding: '32px',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '800px',
                    margin: '0 auto',
                    border: '1px solid #a78bfa',
                    lineHeight: '1.8',
                    fontSize: '16px'
                }}
            >
                <p>
                    Hướng đến kỷ niệm <strong>135 năm ngày sinh Chủ tịch Hồ Chí Minh (19/5/1890 – 19/5/2025)</strong>,
                    Trường Đại học Tài nguyên & Môi trường TP.HCM tổ chức Cuộc thi lần III.
                </p>

                <p><strong>📋 Hình thức thi:</strong></p>
                <ul style={{ paddingLeft: '20px' }}>
                    <li>
                        🔅 <strong>Vòng 1 – Trắc nghiệm online:</strong> 40 câu, chọn ra 20 thí sinh cao điểm.
                    </li>
                    <li>
                        🔅 <strong>Vòng 2 – Bài cảm nhận:</strong> tối đa 500 từ.
                        Gửi về:{" "}
                        <a href="mailto:phongctsv@hcmunre.edu.vn" style={{ color: '#60a5fa' }}>
                            phongctsv@hcmunre.edu.vn
                        </a>
                    </li>
                </ul>

                <p>
                    <strong>📅 Thời gian:</strong><br />
                    • Vòng 1: 15/05 → 17g00 ngày 17/05/2025<br />
                    • Vòng 2: 18/05 → 14g00 ngày 20/05/2025
                </p>

                <p>
                    <strong>📊 Số lượng đăng ký:</strong> {attendees}/{capacity}
                </p>

                <div
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#fcd34d',
                        textAlign: 'center',
                        marginTop: '22px'
                    }}
                >
                    ✨ Học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh ✨
                </div>

                {/* NÚT */}
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
                                backgroundColor: '#aaa',
                                padding: "10px 22px",
                                borderRadius: "8px",
                                color: "#fff",
                                border: "none"
                            }}
                        >
                            🔒 KHÔNG THỂ ĐĂNG KÝ
                        </button>
                    ) : (
                        <button
                            onClick={handleRegister}
                            style={{
                                backgroundColor: '#8b5cf6',
                                border: 'none',
                                padding: '10px 22px',
                                borderRadius: '8px',
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

                {showForm && (
                    <div style={{ marginTop: '24px' }}>
                        <EventForm
                            eventId={eventId}
                            eventTitle="Cuộc thi tìm hiểu về Chủ tịch Hồ Chí Minh 2025"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UncleHoContest;
