/* =============================
   EVENT DETAIL PAGE - ĐỘNG
   Trang chi tiết sự kiện tự động cho bất kỳ sự kiện nào
   ============================= */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EventForm from '../components/EventForm';
import { getEventImage } from '../utils/getEventImage';

/* IMPORT IMAGE — FALLBACK */
import iconPeople from '../assets/images/bongda.jpg';
import iconTag from '../assets/images/hoithaocongnghe.jpg';
import hienmauImg from '../assets/images/hienmau.jpg';
import vanngheImg from '../assets/images/vannghe.jpg';
import greenpointImg from '../assets/images/greenpoint.jpg';
import taichinhcanhanImg from '../assets/images/taichinhcanhan.jpg';

const imageMap = {
    academic: iconTag,
    sports: iconPeople,
    community: hienmauImg,
    cultural: vanngheImg,
    environment: greenpointImg,
    workshop: taichinhcanhanImg
};

function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState(0);
    const [capacity, setCapacity] = useState(50);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    // Lấy thông tin sự kiện
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:3001/api/events/${id}`);
                const data = await res.json();

                if (!data || !data.id) {
                    alert("Không tìm thấy sự kiện!");
                    navigate("/events");
                    return;
                }

                // Giữ nguyên đường dẫn ảnh gốc, sẽ dùng getEventImage khi render
                setEvent({ ...data });

                // Lấy số lượng đăng ký
                const countRes = await fetch(`http://localhost:3001/api/eventCount/count/${id}`);
                const countData = await countRes.json();
                setAttendees(countData.registered || 0);
                setCapacity(countData.capacity || data.capacity || 50);

                // Kiểm tra đã đăng ký và check-in chưa (nếu có user)
                if (user && user.ma_nguoi_dung) {
                    const checkRes = await fetch(`http://localhost:3001/api/tickets/my/${user.ma_nguoi_dung}`);
                    const tickets = await checkRes.json();
                    const ticket = tickets.find(t => t.ma_su_kien === parseInt(id) || t.id === parseInt(id));
                    setIsRegistered(!!ticket);
                    setIsCheckedIn(ticket?.check_in === true || ticket?.check_in === 1 || ticket?.check_in === '1');
                    // Lưu thông tin ticket để hiển thị trạng thái check-in
                    if (ticket) {
                        setEvent(prev => ({ ...prev, userTicket: ticket }));
                    }
                }

            } catch (err) {
                console.error("Lỗi tải sự kiện:", err);
                alert("Không thể tải thông tin sự kiện!");
                navigate("/events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, user]);

    // Xử lý đăng ký
    const handleRegister = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập để đăng ký!");
            navigate("/login");
            return;
        }

        if (isRegistered) {
            alert("⚠ Bạn đã đăng ký sự kiện này rồi!");
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
                    ma_su_kien: parseInt(id),
                    ma_nguoi_dung: user.ma_nguoi_dung
                })
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.message || "Đăng ký thất bại!");
                return;
            }

            // Cập nhật số lượng từ server (để đảm bảo chính xác)
            const refreshCount = async () => {
                try {
                    const countRes = await fetch(`http://localhost:3001/api/eventCount/count/${id}`);
                    const countData = await countRes.json();
                    setAttendees(countData.registered || 0);
                } catch (err) {
                    console.error("Lỗi refresh số lượng:", err);
                    // Fallback: cộng thêm 1 nếu không refresh được
                    setAttendees(prev => prev + 1);
                }
            };

            await refreshCount();
            setIsRegistered(true);
            setShowForm(true);

        } catch (err) {
            console.error(err);
            alert("Không thể kết nối server!");
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #1e1b4b, #2e1065, #312e81)",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px"
            }}>
                ⏳ Đang tải thông tin sự kiện...
            </div>
        );
    }

    if (!event) {
        return null;
    }

    const gradientBg = event.type === 'sports' ? "linear-gradient(to bottom, #1e3a8a, #1e40af)" :
        event.type === 'environment' ? "linear-gradient(to bottom, #065f46, #15803d)" :
            event.type === 'community' ? "linear-gradient(to bottom, #7c2d12, #9a3412)" :
                "linear-gradient(135deg, #1e1b4b, #2e1065, #312e81)";

    return (
        <div style={{
            background: gradientBg,
            color: "white",
            minHeight: "100vh",
            padding: "60px 20px",
        }}>
            {/* Nút quay lại */}
            <button
                onClick={() => navigate("/events")}
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    backgroundColor: "rgba(59, 130, 246, 0.8)",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(59, 130, 246, 1)";
                    e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(59, 130, 246, 0.8)";
                    e.target.style.transform = "translateY(0)";
                }}
            >
                ⬅️ Quay lại trang Events
            </button>

            {/* Tiêu đề */}
            <h2 style={{
                textAlign: "center",
                fontSize: "34px",
                fontWeight: "bold",
                marginBottom: "30px",
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
            }}>
                {event.title}
            </h2>

            {/* Khung nội dung */}
            <div style={{
                backgroundColor: "rgba(30, 41, 59, 0.9)",
                color: "#e2e8f0",
                padding: "32px",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "820px",
                margin: "0 auto",
                border: "1px solid rgba(56, 189, 248, 0.5)",
                lineHeight: "1.8",
                fontSize: "16px",
                boxShadow: "0 0 25px rgba(0,0,0,0.2)",
            }}>
                {/* Ảnh sự kiện */}
                {(event.image || event.hinh_anh) && (
                    <div style={{
                        width: "100%",
                        height: "400px",
                        overflow: "hidden",
                        borderRadius: "12px",
                        marginBottom: "24px",
                        border: "1px solid rgba(255,255,255,0.2)"
                    }}>
                        <img
                            src={getEventImage(event.hinh_anh || event.image || "")}
                            alt={event.title}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                            onError={(e) => {
                                e.target.src = imageMap[event.type] || iconTag;
                            }}
                        />
                    </div>
                )}

                {/* Mô tả */}
                {event.description && (
                    <div style={{ marginBottom: "24px", whiteSpace: "pre-line" }}>
                        {event.description}
                    </div>
                )}

                {/* Thông tin */}
                <div style={{
                    backgroundColor: "rgba(15, 23, 42, 0.5)",
                    padding: "20px",
                    borderRadius: "12px",
                    marginBottom: "24px"
                }}>
                    <div style={{ marginBottom: "12px" }}>
                        🕒 <strong>Thời gian:</strong> {event.date ? new Date(event.date).toLocaleString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : 'Chưa có thời gian'}
                    </div>
                    {event.location && (
                        <div style={{ marginBottom: "12px" }}>
                            📍 <strong>Địa điểm:</strong> {event.location}
                        </div>
                    )}
                    <div style={{ marginBottom: "12px" }}>
                        👥 <strong>Số lượng:</strong> {attendees}/{capacity} người đã đăng ký
                    </div>
                    {event.points && (
                        <div>
                            ⭐ <strong>Điểm rèn luyện:</strong> {event.points} điểm
                        </div>
                    )}
                </div>

                {/* Trạng thái check-in (nếu đã đăng ký) */}
                {isRegistered && (
                    <div style={{
                        marginBottom: "20px",
                        padding: "16px",
                        borderRadius: "12px",
                        backgroundColor: isCheckedIn ? "rgba(16, 185, 129, 0.2)" : "rgba(251, 191, 36, 0.2)",
                        border: `1px solid ${isCheckedIn ? "rgba(52, 211, 153, 0.4)" : "rgba(251, 191, 36, 0.4)"}`
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "12px",
                            marginBottom: "8px"
                        }}>
                            <span style={{ fontSize: "24px" }}>
                                {isCheckedIn ? "✅" : "⏳"}
                            </span>
                            <span style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: isCheckedIn ? "#6ee7b7" : "#fcd34d"
                            }}>
                                {isCheckedIn ? "Đã check-in" : "Chưa check-in"}
                            </span>
                        </div>
                        {isCheckedIn && event?.userTicket?.thoi_gian_checkin && (
                            <p style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#94a3b8",
                                textAlign: "center"
                            }}>
                                Thời gian check-in: {new Date(event.userTicket.thoi_gian_checkin).toLocaleString('vi-VN')}
                            </p>
                        )}
                        {isCheckedIn && (event?.userTicket?.diem_cong || event?.points) && (
                            <p style={{
                                margin: "8px 0 0 0",
                                fontSize: "14px",
                                color: "#60a5fa",
                                textAlign: "center",
                                fontWeight: "bold"
                            }}>
                                ⭐ Điểm nhận được: {event.userTicket.diem_cong || event.points || 0} điểm
                            </p>
                        )}
                    </div>
                )}

                {/* Nút đăng ký */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    marginTop: "24px",
                }}>
                    {isRegistered ? (
                        <button
                            style={{
                                backgroundColor: "#10b981",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                color: "white",
                                fontWeight: "bold",
                                border: "none",
                                cursor: "default",
                                boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                            }}
                            disabled
                        >
                            ✅ Đã đăng ký
                        </button>
                    ) : attendees >= capacity ? (
                        <button
                            style={{
                                backgroundColor: "#9ca3af",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                color: "white",
                                fontWeight: "bold",
                                border: "none",
                                cursor: "not-allowed",
                                boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                            }}
                            disabled
                        >
                            🔒 Đã đầy
                        </button>
                    ) : (
                        <button
                            onClick={handleRegister}
                            style={{
                                backgroundColor: "#38bdf8",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                color: "white",
                                fontWeight: "bold",
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                                transition: "all 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#0ea5e9";
                                e.target.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#38bdf8";
                                e.target.style.transform = "scale(1)";
                            }}
                        >
                            📝 Đăng ký tham gia
                        </button>
                    )}

                    <button
                        onClick={() => navigate("/events")}
                        style={{
                            backgroundColor: "#64748b",
                            padding: "12px 24px",
                            borderRadius: "8px",
                            color: "white",
                            fontWeight: "bold",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                        }}
                    >
                        Quay lại
                    </button>
                </div>

                {/* Form đăng ký */}
                {showForm && (
                    <EventForm
                        eventId={parseInt(id)}
                        eventTitle={event.title}
                        user={user}
                        onSubmit={async () => {
                            setShowForm(false);
                            // Refresh lại số lượng và kiểm tra lại trạng thái đăng ký
                            try {
                                const countRes = await fetch(`http://localhost:3001/api/eventCount/count/${id}`);
                                const countData = await countRes.json();
                                setAttendees(countData.registered || 0);

                                // Kiểm tra lại xem đã đăng ký và check-in chưa
                                if (user && user.ma_nguoi_dung) {
                                    const checkRes = await fetch(`http://localhost:3001/api/tickets/my/${user.ma_nguoi_dung}`);
                                    const tickets = await checkRes.json();
                                    const ticket = tickets.find(t => t.ma_su_kien === parseInt(id) || t.id === parseInt(id));
                                    setIsRegistered(!!ticket);
                                    setIsCheckedIn(ticket?.check_in === true || ticket?.check_in === 1 || ticket?.check_in === '1');
                                    if (ticket) {
                                        setEvent(prev => ({ ...prev, userTicket: ticket }));
                                    }
                                }
                            } catch (err) {
                                console.error("Lỗi refresh:", err);
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default EventDetail;
