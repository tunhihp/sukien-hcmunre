import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from "../context/AuthContext";

const RecycleEvent = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);
    const [capacity, setCapacity] = useState(9999); // sự kiện đông nên để lớn
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 15; // ⭐ ID riêng trong localEvents

    // ===== HẠN ĐĂNG KÝ =====
    const deadline = new Date("2025-12-20T23:59:59");
    const isExpired = new Date() > deadline;

    // ===== LẤY SỐ LƯỢNG TỪ DATABASE =====
    useEffect(() => {
        const loadCount = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 9999);
            } catch (err) {
                console.log("Lỗi tải số lượng:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCount();
    }, []);

    // ===== ĐĂNG KÝ =====
    const handleOpenForm = async () => {
        if (!isAuthenticated) {
            alert("⚠ Hãy đăng nhập để đăng ký tham gia!");
            return;
        }

        if (isExpired) {
            alert("⚠ Đã hết hạn đăng ký tham gia chương trình!");
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
            alert("Không thể kết nối server!");
        }
    };

    if (isLoading) {
        return (
            <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>
                ⏳ Đang tải dữ liệu...
            </div>
        );
    }

    return (
        <div
            style={{
                background: 'linear-gradient(to bottom, #065f46, #14532d)',
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
                🌱 ĐỔI RÁC NHỎ – NHẬN QUÀ TO ♻️
                <br />
                <span style={{ fontSize: '20px', color: '#bbf7d0' }}>
                    Sống xanh cùng Trạm Đổi Rác tại ĐH Tài nguyên & Môi trường!
                </span>
            </h2>

            <div
                style={{
                    backgroundColor: '#166534',
                    padding: '32px',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '820px',
                    margin: '0 auto',
                    border: '1px solid #a7f3d0',
                    lineHeight: '1.8',
                    fontSize: '16px'
                }}
            >
                <p>
                    Bạn có biết? 🌍 <strong>Những món rác nhỏ bé trong tay bạn có thể biến thành món quà giá trị!</strong>
                </p>

                <p>
                    Hãy tham gia <strong>Trạm Tái chế GreenPoint</strong> để:
                    <br />• Góp phần bảo vệ môi trường.
                    <br />• Sống xanh hơn mỗi ngày.
                    <br />• Nhận quà hấp dẫn khi đổi rác!
                </p>

                <p>
                    <strong>🗓 Thời gian:</strong><br />
                    - Khai trương: Chủ nhật, 25/09/2025<br />
                    - Sau đó: Thứ Năm hàng tuần (25/09 – 31/12/2025)<br />
                    <strong>⏰ Khung giờ:</strong> 08:30 – 16:00<br />
                    <strong>📍 Địa điểm:</strong> Đối diện phòng Y tế – Trường ĐH Tài nguyên & Môi Trường TP.HCM
                </p>

                <p>
                    <strong>♻️ Cách tham gia:</strong><br />
                    1️⃣ <strong>Tải app GRAC:</strong> Đồng hành cùng bạn trong hành trình tích điểm xanh.<br />
                    2️⃣ <strong>Phân loại & rửa sạch rác:</strong> Chai nhựa, lon nước, hộp giấy...<br />
                    3️⃣ <strong>Mang rác tới Trạm Đổi Rác:</strong> Cân rác, ghi nhận và tích điểm trực tiếp trên app GRAC.<br />
                    4️⃣ <strong>Tích điểm đổi quà:</strong> Đổi quà eco-friendly, đồ dùng xanh, snack ngon và nhiều phần thưởng hấp dẫn!
                </p>

                <p
                    style={{
                        marginTop: '10px',
                        fontSize: '17px',
                        fontWeight: 'bold',
                        color: '#fde047',
                        textAlign: 'center'
                    }}
                >
                    👥 Đã đăng ký: {attendees}/{capacity}
                </p>

                <div
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#fde047',
                        textAlign: 'center',
                        marginTop: '24px'
                    }}
                >
                    💚 GreenPoint – Biến rác thành tài nguyên, biến hành động nhỏ thành thay đổi lớn!
                </div>

                {/* ====== NÚT ACTION ====== */}
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
                {!isExpired && showForm && (
                    <div style={{ marginTop: '24px' }}>
                        <EventForm
                            eventId={eventId}
                            eventTitle="Trạm Đổi Rác – GreenPoint HCMUNRE"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecycleEvent;
