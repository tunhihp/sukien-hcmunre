import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from "../context/AuthContext";

const GreenPointTalkshow = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);   // số lượng đã đăng ký
    const [capacity, setCapacity] = useState(150);   // mặc định
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 13; // ⭐ ID riêng trong localEvents của em

    // ========== KIỂM TRA HẠN ĐĂNG KÝ ==========
    const deadline = new Date("2025-12-20T08:00:00");
    const isExpired = new Date() > deadline;

    // ============= LOAD SỐ LƯỢNG TỪ DB =============
    useEffect(() => {
        const loadCount = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 150);
            } catch (err) {
                console.log("Lỗi load số lượng:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCount();
    }, []);

    // ============= XỬ LÝ NÚT ĐĂNG KÝ =============
    const handleOpenForm = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập để đăng ký!");
            return;
        }

        if (isExpired) {
            alert("⚠ Sự kiện đã hết hạn đăng ký!");
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
                background: 'linear-gradient(to bottom, #14532d, #1a2e05)',
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
                💚 GREEN POINT 2025 TALKSHOW
                <br />
                <span style={{ fontSize: '20px', color: '#bbf7d0' }}>
                    “Hành trình tái chế – Vì một Việt Nam Xanh” 🌍
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
                    border: '1px solid #86efac',
                    lineHeight: '1.8',
                    fontSize: '16px'
                }}
            >
                <p>
                    Mỗi vỏ snack hay lon nước bạn vứt đi đều có thể bắt đầu một <strong>hành trình tái sinh mới</strong>.
                    Và Talkshow <strong>“Hành trình tái chế – Vì một Việt Nam Xanh”</strong> chính là nơi câu chuyện ấy tiếp tục được viết nên.
                </p>

                <p>
                    <strong>🌿 Bạn có bao giờ tự hỏi:</strong><br />
                    • Lượng rác nhựa mình tạo ra mỗi ngày đi về đâu?<br />
                    • Liệu “rác” có thể trở thành nguyên liệu cho tương lai?<br />
                    • Và bạn – sinh viên – có thể làm gì trong vòng tuần hoàn xanh?
                </p>

                <p>
                    👉 Cùng tìm lời giải tại <strong>Talkshow Green Point 2025</strong> – nơi bạn được truyền cảm hứng,
                    học hỏi và kết nối cùng chuyên gia, doanh nghiệp và người trẻ tiên phong trong tái chế & phát triển bền vững!
                </p>

                <p>
                    <strong>🗓 Thời gian:</strong> 08h30 | Thứ 7, ngày 01/11/2025<br />
                    <strong>📍 Địa điểm:</strong> Hội trường A – Trường ĐH Tài nguyên & Môi trường TP.HCM<br />
                    <strong>👥 Đối tượng:</strong> Toàn thể sinh viên HCMUNRE (ưu tiên đăng ký sớm)
                </p>

                <p>
                    <strong>🎯 Tham gia Talkshow, bạn sẽ:</strong><br />
                    • Cập nhật xu hướng mới nhất về phân loại & tái chế rác.<br />
                    • Giao lưu cùng doanh nghiệp tiên phong: PepsiCo Foods VN, Suntory PepsiCo, GRAC...<br />
                    • Trải nghiệm mô hình <strong>Trạm Xanh Tái Chế</strong> thực tế.<br />
                    • Nhận <strong>quà “xanh” ý nghĩa</strong> dành riêng cho người tham dự!
                </p>

                <p
                    style={{
                        fontSize: "17px",
                        fontWeight: "bold",
                        marginTop: "10px",
                        color: "#fef9c3"
                    }}
                >
                    👥 Đã đăng ký: {attendees}/{capacity}
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
                    💚 Green Point 2025 – Cùng nhau viết tiếp hành trình xanh!
                </div>

                {/* ================= BUTTONS ================= */}
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

                {/* FORM */}
                {showForm && !isExpired && (
                    <div style={{ marginTop: '24px' }}>
                        <EventForm
                            eventId={eventId}
                            eventTitle="Green Point 2025 Talkshow"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GreenPointTalkshow;
