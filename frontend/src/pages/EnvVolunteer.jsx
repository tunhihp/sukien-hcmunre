import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from "../context/AuthContext";

const EnvVolunteer = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);   // số đăng ký thực
    const [capacity, setCapacity] = useState(120);   // số lượng tối đa
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 19;  // ⭐ ID sự kiện trong DB

    // =============== KIỂM TRA HẠN ĐĂNG KÝ ===============
    const deadline = new Date("2025-12-20T23:59:59");
    const isExpired = new Date() > deadline;

    // =============== LẤY SỐ NGƯỜI ĐÃ ĐĂNG KÝ ===============
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 120);
            } catch (err) {
                console.log("Lỗi load số lượng:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCount();
    }, []);

    // =============== XỬ LÝ ĐĂNG KÝ ===============
    const handleOpenForm = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn phải đăng nhập trước!");
            return;
        }

        if (isExpired) {
            alert("⚠ Đã hết hạn đăng ký!");
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
                    marginBottom: '30px'
                }}
            >
                🐾 TUYỂN MỘ TÌNH NGUYỆN VIÊN BẢO VỆ ĐỘNG VẬT HOANG DÃ
                <br />
                <span style={{ fontSize: '20px', color: '#bbf7d0' }}>
                    Hành động nhỏ – Bảo vệ sự sống lớn!
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
                    🌳 <strong>Bạn có từng tự hỏi:</strong> “Nếu không có chúng ta, ai sẽ là người lên tiếng cho
                    những sinh linh bị lãng quên trong rừng sâu?”
                </p>

                <p>
                    Tháng 10 này, <strong>Trung tâm Giáo dục Thiên nhiên Việt Nam (ENV)</strong> phối hợp cùng{' '}
                    <strong>Khoa Môi Trường – ĐH Tài nguyên & Môi trường TP.HCM</strong> mở đăng ký chương trình
                    <strong> “Tình nguyện viên bảo vệ động vật hoang dã”</strong>.
                </p>

                <p>
                    <strong>🌱 Đối tượng:</strong><br />
                    • Sinh viên yêu thiên nhiên.<br />
                    • Quan tâm đến động vật hoang dã.<br />
                    • Định hướng làm việc tại NGO hoặc tổ chức môi trường.
                </p>

                <p>
                    <strong>🎯 Tham gia, bạn sẽ:</strong><br />
                    • Hiểu rõ thách thức bảo tồn ĐVHD.<br />
                    • Liên hệ thực tiễn – nghiên cứu.<br />
                    • Trở thành thành viên mạng lưới ENV.
                </p>

                <p>
                    <strong>🕒 Thời gian:</strong> 9h30 – 11h00, ngày 10/10/2025<br />
                    <strong>📍 Địa điểm:</strong> Trường ĐH TN&MT TP.HCM
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
                    💚 Cùng ENV hành động hôm nay – để bảo vệ tiếng gọi của thiên nhiên ngày mai!
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

                {/* ====================== FORM ====================== */}
                {showForm && !isExpired && (
                    <div style={{ marginTop: '24px' }}>
                        <EventForm
                            eventId={eventId}
                            eventTitle="Tình nguyện viên bảo vệ động vật hoang dã"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnvVolunteer;
