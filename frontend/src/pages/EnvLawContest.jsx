import React, { useState, useEffect } from "react";
import EventForm from "../components/EventForm";
import { useAuth } from "../context/AuthContext";

const EnvLawContest = () => {
    const { user, isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [attendees, setAttendees] = useState(0);
    const [capacity, setCapacity] = useState(1000);
    const [isLoading, setIsLoading] = useState(true);

    const eventId = 19;

    // ================== KIỂM TRA HẠN ==================
    const deadline = new Date("2025-12-20T20:00:00");
    const isExpired = new Date() > deadline;

    // ================== LOAD ATTENDEES ==================
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/event/count/${eventId}`);
                const data = await res.json();

                setAttendees(data.registered || 0);
                setCapacity(data.capacity || 1000);
            } catch (err) {
                console.log("Lỗi tải attendees:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCount();
    }, []);

    // ================== XỬ LÝ ĐĂNG KÝ ==================
    const handleRegister = async () => {
        if (!isAuthenticated) {
            alert("⚠ Bạn cần đăng nhập trước khi đăng ký!");
            return;
        }

        if (isExpired) {
            alert("⚠ Cuộc thi đã hết hạn đăng ký!");
            return;
        }

        if (attendees >= capacity) {
            alert("⚠ Đã đủ số lượng!");
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
            alert("❌ Không thể kết nối server!");
        }
    };

    if (isLoading)
        return <div style={{ color: "#fff", textAlign: "center", padding: 50 }}>⏳ Đang tải...</div>;

    return (
        <div
            style={{
                background: "linear-gradient(to bottom, #0f766e, #134e4a)",
                color: "white",
                minHeight: "100vh",
                padding: "60px 20px",
            }}
        >
            {/* ==================== TIÊU ĐỀ ==================== */}
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "34px",
                    fontWeight: "bold",
                    marginBottom: "30px",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                }}
            >
                ⚖️ CUỘC THI “TÌM HIỂU LUẬT BẢO VỆ MÔI TRƯỜNG” – ONLINE
                <br />
                <span style={{ fontSize: "20px", color: "#a7f3d0" }}>
                    Hưởng ứng Ngày Pháp luật Việt Nam 09/11 🌿
                </span>
            </h2>

            {/* ==================== KHUNG NỘI DUNG ==================== */}
            <div
                style={{
                    backgroundColor: "#115e59",
                    padding: "32px",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "820px",
                    margin: "0 auto",
                    border: "1px solid #99f6e4",
                    lineHeight: "1.8",
                    fontSize: "16px",
                    boxShadow: "0 0 25px rgba(0,0,0,0.15)",
                }}
            >
                <p>
                    Hưởng ứng <strong>Ngày Pháp luật nước CHXHCN Việt Nam (09/11)</strong>,
                    Khoa Môi Trường tổ chức cuộc thi Online
                    <strong> “Tìm hiểu Luật Bảo vệ Môi Trường 2020”</strong>.
                </p>

                {/* ⭐⭐⭐ THÊM SỐ LƯỢNG NHƯ BLOODDONATION */}
                <p>
                    <strong>🎯 Số lượng tham gia:</strong> {attendees}/{capacity} bạn
                </p>

                <p>
                    <strong>📘 Mục tiêu cuộc thi:</strong><br />
                    • Nắm vững nội dung Luật BVMT 2020.<br />
                    • Khuyến khích tuân thủ pháp luật & phát triển bền vững.<br />
                    • Lan tỏa tinh thần “Sống xanh – Hành động xanh – Tương lai xanh”.
                </p>

                <p>
                    <strong>🕒 Thời gian tham gia:</strong><br />
                    13h30 ngày 10/11/2025 → 20h00 ngày 11/11/2025
                </p>

                <p>
                    <strong>🌐 Hình thức thi:</strong><br />
                    Trắc nghiệm trên MyAloha<br />
                    🔗 Link:{" "}
                    <a
                        href="https://myaloha.vn/ct/hc38ah"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#a7f3d0" }}
                    >
                        https://myaloha.vn/ct/hc38ah
                    </a>
                </p>

                <p>
                    <strong>📝 Cách thức tham gia:</strong><br />
                    1️⃣ Like Fanpage Khoa Môi Trường.<br />
                    2️⃣ Tag 2 người bạn.<br />
                    3️⃣ Chia sẻ bài viết kèm hashtag.<br />
                    4️⃣ Đăng nhập Zalo → Làm bài thi.
                </p>

                <p>
                    <strong>🎁 Quyền lợi:</strong><br />
                    • Sinh viên Khoa Môi Trường đạt ≥ 25/30: +0.5 điểm rèn luyện.<br />
                    • Chụp màn hình kết quả gửi về Bí thư + QLK.
                </p>

                <p>⚠️ Phải hoàn thành đầy đủ 4 bước để được tính điểm.</p>

                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#fcd34d",
                        textAlign: "center",
                        marginTop: "24px",
                    }}
                >
                    🌿 Chung tay hiểu luật – sống xanh – bảo vệ môi trường bền vững!
                </div>

                {/* ==================== NÚT ĐĂNG KÝ ==================== */}
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
                                padding: "10px 20px",
                                borderRadius: "6px",
                                color: "white",
                                fontWeight: "bold",
                                border: "none",
                                cursor: "not-allowed",
                            }}
                        >
                            🔒 KHÔNG THỂ ĐĂNG KÝ
                        </button>
                    ) : (
                        <button onClick={handleRegister} style={buttonPrimary}>
                            Đăng ký
                        </button>
                    )}

                    <button
                        onClick={() => window.history.back()}
                        style={buttonSecondary}
                    >
                        Quay lại trang Sự kiện
                    </button>
                </div>

                {/* ==================== FORM ==================== */}
                {showForm && (
                    <EventForm
                        eventId={eventId}
                        eventTitle="Cuộc thi Tìm hiểu Luật Bảo vệ Môi Trường"
                        user={user}
                        onSubmit={() => setShowForm(false)}
                    />
                )}
            </div>
        </div>
    );
};

const buttonPrimary = {
    backgroundColor: "#8b5cf6",
    padding: "10px 20px",
    borderRadius: "6px",
    color: "white",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
};

const buttonSecondary = {
    backgroundColor: "#e2e8f0",
    color: "#111827",
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
};

export default EnvLawContest;
