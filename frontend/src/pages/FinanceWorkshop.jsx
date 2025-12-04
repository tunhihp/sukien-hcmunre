import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { useAuth } from "../context/AuthContext";

const FinanceWorkshop = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);   // số đăng ký thực tế
    const [capacity, setCapacity] = useState(150);   // số lượng tối đa workshop
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 16;  // ⭐ ID trong bảng su_kien

    // =============== KIỂM TRA HẠN ĐĂNG KÝ ===============
    const deadline = new Date("2025-12-20T23:59:59");
    const isExpired = new Date() > deadline;

    // =============== LẤY SỐ LƯỢNG TỪ DATABASE ===============
    useEffect(() => {
        const loadCount = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 150);
            } catch (err) {
                console.log("Lỗi load số người:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCount();
    }, []);

    // =============== XỬ LÝ NÚT ĐĂNG KÝ ===============
    const handleOpenForm = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập để tiếp tục!");
            return;
        }

        if (isExpired) {
            alert("⚠ Đã hết hạn đăng ký Workshop!");
            return;
        }

        if (attendees >= capacity) {
            alert("⚠ Workshop đã đủ số lượng!");
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
                background: 'linear-gradient(to bottom, #f97316, #c2410c)',
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
                💼 WORKSHOP “QUẢN LÝ TÀI CHÍNH CÁ NHÂN”
                <br />
                <span style={{ fontSize: '20px', color: '#fde68a' }}>
                    Bước đầu tiên để “Sống trọn với đam mê” 💰
                </span>
            </h2>

            <div
                style={{
                    backgroundColor: '#ea580c',
                    padding: '32px',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '820px',
                    margin: '0 auto',
                    border: '1px solid #fdba74',
                    lineHeight: '1.8',
                    fontSize: '16px'
                }}
            >
                <p>
                    Bạn có bao giờ tự hỏi: “Làm sao để vừa theo đuổi đam mê, vừa vững vàng tài chính trong tương lai?”
                </p>

                <p>
                    Câu trả lời nằm trong Workshop <strong>“Quản lý tài chính cá nhân”</strong> –
                    chương trình đặc biệt dành cho sinh viên <strong>ĐH Tài nguyên & Môi trường TP.HCM</strong>.
                </p>

                <p>
                    <strong>📅 Thông tin chi tiết:</strong><br />
                    • ⏰ 13h00 – 17h00 ngày 13/10/2025<br />
                    • 🏫 Hội trường A – 236B Lê Văn Sỹ, Tân Sơn Hòa, TP.HCM<br />
                    • 👥 Số lượng: {attendees}/{capacity} sinh viên<br />
                    • 👕 Trang phục: Lịch sự – năng động
                </p>

                <p>
                    <strong>🎯 Tham gia Workshop, bạn sẽ nhận được:</strong><br />
                    • Kỹ năng quản lý chi tiêu thông minh.<br />
                    • Phương pháp theo dõi tài chính cá nhân.<br />
                    • Tư duy tài chính bền vững – sống xanh, sống thông minh.
                </p>

                <div
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#fde68a',
                        textAlign: 'center',
                        marginTop: '24px'
                    }}
                >
                    💡 Hãy bắt đầu xây dựng tương lai tài chính vững vàng ngay hôm nay!
                </div>

                {/* ======================= BUTTONS ======================= */}
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

                {/* ======================= FORM ======================= */}
                {showForm && !isExpired && (
                    <div style={{ marginTop: '24px' }}>
                        <EventForm
                            eventId={eventId}
                            eventTitle="Workshop Quản lý tài chính cá nhân"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceWorkshop;
