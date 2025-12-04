import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from "../context/AuthContext";

const SmartStudentEvent = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);
    const [capacity, setCapacity] = useState(500); // mặc định
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 5;

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
                setCapacity(data.capacity || 500);
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
            alert("⚠ Bạn cần đăng nhập để đăng ký!");
            return;
        }

        if (isExpired) {
            alert("⚠ Đã hết hạn đăng ký tham gia cuộc thi!");
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
                ✨ THÔNG BÁO THAM GIA CUỘC THI SINH VIÊN THÔNG THÁI 2025 ✨
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

                <p><strong>📌 Thông tin chính:</strong></p>

                <p>🔍 <strong>Chủ đề:</strong> Tìm hiểu pháp luật quản lý hoạt động kinh doanh theo phương thức đa cấp.</p>

                <p><strong>Vòng sơ khảo:</strong><br />
                    ✔ Thi trắc nghiệm trực tuyến từ 25/4 đến 10/5/2025.<br />
                    ✔ Link: <a href="https://tracnghiem-bhdc.vcc.gov.vn" target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>https://tracnghiem-bhdc.vcc.gov.vn</a>
                </p>

                <p><strong>Vòng chung kết:</strong><br />
                    ✔ 05 trường có tổng điểm cao nhất sẽ lập đội thi trực tiếp.<br />
                    ✔ Ngày thi: 30/5/2025<br />
                    ✔ Địa điểm: TP. Hồ Chí Minh (sẽ thông báo).<br />
                    ✔ Gồm các phần: Giới thiệu – Tiểu phẩm – Hùng biện.
                </p>

                <p><strong>Giải thưởng:</strong><br />
                    • Sơ khảo: 10 giải cá nhân x 2.000.000 VNĐ<br />
                    • Chung kết: Nhất 50tr – Nhì 30tr – Ba 20tr – KK 15tr
                </p>

                <p><strong>Lưu ý:</strong><br />
                    ✔ Ghi rõ thông tin khi đăng ký.<br />
                    ✔ Được cộng điểm rèn luyện.<br />
                    ✔ Chụp màn hình sau khi thi để gửi về Chi đoàn xác nhận.
                </p>

                <p style={{
                    fontSize: '17px',
                    fontWeight: 'bold',
                    color: '#fde047',
                    textAlign: 'center',
                    marginTop: "10px"
                }}>
                    👥 Đã đăng ký: {attendees}/{capacity}
                </p>

                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fcd34d', textAlign: 'center', marginTop: '16px' }}>
                    ✨ Tham gia ngay để khẳng định bản lĩnh sinh viên HCMUNRE! ✨
                </div>

                {/* ====== NÚT ACTION ====== */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
                    {(isExpired || attendees >= capacity) ? (
                        <button
                            disabled
                            style={{
                                backgroundColor: '#9ca3af',
                                padding: '10px 20px',
                                borderRadius: '6px',
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
                                backgroundColor: '#8b5cf6',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '6px',
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

                {/* ===== FORM ===== */}
                {!isExpired && showForm && (
                    <div style={{ marginTop: '24px' }}>
                        <EventForm
                            eventId={eventId}
                            eventTitle="Cuộc thi Sinh Viên Thông Thái 2025"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartStudentEvent;
