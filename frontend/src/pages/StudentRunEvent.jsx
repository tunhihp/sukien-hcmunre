import React, { useState, useEffect } from "react";
import EventForm from "../components/EventForm";
import { useAuth } from "../context/AuthContext";

const StudentRegisterList = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);   // Số người đã đăng ký
    const [capacity, setCapacity] = useState(50);    // Cần 50 bạn
    const [isLoading, setIsLoading] = useState(true);

    // NHỚ TẠO SỰ KIỆN CÓ ID NÀY Ở DB
    const eventId = 1;

    // ================== HẠN CHÓT ĐĂNG KÝ ==================
    // Hạn chót 09h00 ngày 20/11/2025
    const eventDeadline = new Date("2025-12-20T09:00:00");
    const isExpired = eventDeadline < new Date();

    // ================== LOAD SỐ LƯỢNG ĐĂNG KÝ ==================
    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 50);
            } catch (err) {
                console.log("Lỗi load số lượng:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendees();
    }, []);

    // ================== XỬ LÝ ĐĂNG KÝ ==================
    const handleRegister = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập để đăng ký tham gia!");
            return;
        }

        if (isExpired) {
            alert("⚠ Đã hết hạn đăng ký (sau 09h00 ngày 20/11/2025)!");
            return;
        }

        if (attendees >= capacity) {
            alert("⚠ Đã đủ 50 bạn đăng ký, không thể đăng ký thêm!");
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/api/event/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ma_su_kien: eventId,
                    ma_nguoi_dung: user.ma_nguoi_dung,
                }),
            });

            const data = await res.json();

            if (data.success === false) {
                alert(data.message || "Đăng ký không thành công!");
                return;
            }

            alert("🎉 Đăng ký thành công!");
            setAttendees((prev) => prev + 1);
            setShowForm(true);
        } catch (err) {
            console.log(err);
            alert("Lỗi kết nối server!");
        }
    };

    if (isLoading) {
        return (
            <div
                style={{
                    color: "#fff",
                    textAlign: "center",
                    padding: 50,
                }}
            >
                ⏳ Đang tải...
            </div>
        );
    }

    return (
        <div
            style={{
                background: "linear-gradient(to bottom, #0f172a, #1e3a8a)",
                color: "white",
                minHeight: "100vh",
                padding: "60px 20px",
            }}
        >
            {/* ================== TIÊU ĐỀ ================== */}
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "34px",
                    fontWeight: "bold",
                    marginBottom: "30px",
                }}
            >
                🎤 TALKSHOW BLOCKCHAIN – WEB3 – METAVERSE 🎤
                <br />
                <span style={{ fontSize: "20px", color: "#bfdbfe" }}>
                    Kiến thức nền tảng – Cơ hội nghề nghiệp & Thách thức cho giới trẻ
                </span>
            </h2>

            {/* ================== KHUNG NỘI DUNG ================== */}
            <div
                style={{
                    backgroundColor: "#1e293b",
                    padding: "32px",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "820px",
                    margin: "0 auto",
                    border: "1px solid #38bdf8",
                    lineHeight: "1.8",
                    fontSize: "16px",
                }}
            >
                <p>
                    <strong>
                        Chương trình talkshow “Kiến thức nền tảng về Blockchain, Web3, Metaverse –
                        Cơ hội nghề nghiệp và thách thức cho giới trẻ”.
                    </strong>
                    <br />
                    Buổi chia sẻ giúp sinh viên hiểu rõ hơn về xu hướng công nghệ mới, định hướng nghề nghiệp
                    và những kỹ năng cần chuẩn bị trong tương lai.
                </p>

                <p>
                    <strong>📅 Thời gian:</strong> 13h30 – ngày 20/11/2025<br />
                    <strong>📍 Địa điểm:</strong> Hội trường A (trụ sở chính)<br />
                    <strong>🎯 Chỉ tiêu:</strong> {attendees}/{capacity} bạn (cần đủ 50 bạn)
                </p>

                <p>
                    <strong>🔔 Lưu ý:</strong><br />
                    • Hạn chót đăng ký: <strong>09h00 – ngày 20/11/2025</strong><br />
                    • Các bạn đăng ký tham gia được tính vào{" "}
                    <strong>điểm Công tác Đoàn – Hội</strong> theo quy định.
                </p>

                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#facc15",
                        textAlign: "center",
                        marginTop: "24px",
                    }}
                >
                    🚀 Đừng bỏ lỡ cơ hội chạm vào thế giới Blockchain – Web3 – Metaverse! 🚀
                </div>

                {/* ================== NÚT HÀNH ĐỘNG ================== */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "12px",
                        marginTop: "28px",
                    }}
                >
                    {(isExpired || attendees >= capacity) ? (
                        <button
                            disabled
                            style={{
                                backgroundColor: "#9ca3af",
                                border: "none",
                                padding: "10px 22px",
                                borderRadius: "8px",
                                color: "white",
                                fontWeight: "bold",
                                cursor: "not-allowed",
                            }}
                        >
                            🔒 KHÔNG THỂ ĐĂNG KÝ
                        </button>
                    ) : (
                        <button
                            onClick={handleRegister}
                            style={{
                                backgroundColor: "#38bdf8",
                                border: "none",
                                padding: "10px 22px",
                                borderRadius: "8px",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            Đăng ký tham gia
                        </button>
                    )}

                    <button
                        onClick={() => window.history.back()}
                        style={{
                            backgroundColor: "#e2e8f0",
                            color: "#111827",
                            padding: "10px 22px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Quay lại trang Sự kiện
                    </button>
                </div>

                {/* ================== FORM ================== */}
                {showForm && (
                    <div style={{ marginTop: "24px" }}>
                        <EventForm
                            eventId={eventId}
                            eventTitle="Talkshow Blockchain – Web3 – Metaverse 2025"
                            user={user}
                            onSubmit={() => setShowForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentRegisterList;
