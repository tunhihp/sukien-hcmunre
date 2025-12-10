/* =============================
   EVENTS PAGE - PREMIUM UI
   ============================= */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getEventImage } from "../utils/getEventImage";
import logo from "../assets/images/logo.jpg";

/* ====== ẢNH TĨNH GỐC CỦA EM (KHÔNG ĐỤNG) ====== */
import logoTruongImg from "../assets/images/LOGO trường.jpg";

/* 20 SỰ KIỆN TĨNH + ẢNH GỐC */
const staticEvents = [
];

const gradientBg = "linear-gradient(135deg,#1e1b4b,#2e1065,#312e81)";
const cardBg = "rgba(255,255,255,0.08)";

function Events() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");

    /* 🚫 Chặn truy cập khi chưa login */
    useEffect(() => {
        if (!user) navigate("/login");
    }, [user]);

    /* =====================
       FETCH EVENTS TỪ DB
    ====================== */
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/events");
                const dbEvents = await res.json();

                const cleanDB = dbEvents.map((e) => {
                    const id = e.id || e.ma_su_kien;
                    // Lấy ảnh từ image hoặc hinh_anh
                    const imgPath = e.image || e.hinh_anh || "";

                    return {
                        ...e,
                        id,
                        image: imgPath,
                        hinh_anh: imgPath, // Giữ cả hai field để tương thích
                    };
                });

                // lọc: chỉ lấy các sự kiện DB có id > 20
                const dbMerged = cleanDB.filter((e) => e.id > 20);

                // merge static + DB
                const merged = [...staticEvents, ...dbMerged].sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );

                setEvents(merged);
            } catch (er) {
                console.error("Lỗi tải sự kiện:", er);
                setEvents(staticEvents);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const filteredEvents = events.filter(
        (ev) =>
            (selectedType === "all" || ev.type === selectedType) &&
            ev.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /* ===================================== UI ===================================== */

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#e8f6ff",
                padding: "20px 30px",
                fontFamily: "Inter, sans-serif",
                color: "#0f172a"
            }}
        >

            {/* TITLE */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1
                    style={{
                        fontSize: "35px",
                        marginBottom: "3px",
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#0f172a",
                        padding: "10px 20px",
                        borderRadius: "14px",
                        background: "rgba(255,255,255,0.6)",
                        border: "1px solid rgba(144,202,249,0.6)",
                        boxShadow: "0 10px 20px rgba(144,202,249,0.25)",
                        display: "inline-block",
                        marginLeft: "30%",
                        transform: "translateX(-50%)",
                        backdropFilter: "blur(6px)"
                    }}
                >
                    Danh sách sự kiện
                </h1>

                <p style={{ color: "#475569", fontSize: "17px" }}>
                    Khám phá và tham gia các hoạt động của trường
                </p>
            </div>

            {/* SEARCH + FILTER */}
            <div
                style={{
                    display: "flex",
                    gap: "16px",
                    justifyContent: "center",
                    marginBottom: "40px",
                    flexWrap: "wrap",
                }}
            >
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm sự kiện..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: "12px 18px",
                        width: "280px",
                        background: "white",
                        borderRadius: "10px",
                        border: "1px solid #bae6fd",
                        color: "#0f172a",
                        outline: "none",
                        fontSize: "15px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                    }}
                />

                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{
                        padding: "12px 18px",
                        background: "white",
                        borderRadius: "10px",
                        border: "1px solid #bae6fd",
                        color: "#0f172a",
                        outline: "none",
                        fontSize: "15px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                    }}
                >
                    <option value="all">Tất cả</option>
                    <option value="academic">Học thuật</option>
                    <option value="sports">Thể thao</option>
                    <option value="cultural">Văn hóa</option>
                    <option value="environment">Môi trường</option>
                    <option value="community">Cộng đồng</option>
                    <option value="community">Hoạt động truyền thông</option>
                </select>
            </div>

            {/* EVENT LIST */}
            <div
                style={{
                    maxWidth: "1000px",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "50px",
                }}
            >
                {filteredEvents.map((event) => (
                    <div
                        key={event.id}
                        style={{
                            background: "white",
                            borderRadius: "18px",
                            padding: "24px",
                            border: "1px solid #cce7ff",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                            transition: "0.25s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-6px)";
                            e.currentTarget.style.boxShadow =
                                "0 12px 28px rgba(0,0,0,0.12)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                                "0 8px 20px rgba(0,0,0,0.08)";
                        }}
                    >
                        {/* TITLE */}
                        <h2
                            style={{
                                fontSize: "26px",
                                fontWeight: "700",
                                marginBottom: "8px",
                                color: "#0c4a6e",
                            }}
                        >
                            {event.title}
                        </h2>

                        <p style={{ color: "#475569", marginBottom: "18px", fontSize: "15px" }}>
                            {event.description}
                        </p>

                        {/* IMAGE */}
                        <div
                            style={{
                                width: "100%",
                                height: "350px",
                                borderRadius: "14px",
                                overflow: "hidden",
                                marginBottom: "22px",
                            }}
                        >
                            <img
                                src={
                                    event.id > 20
                                        ? getEventImage(event.hinh_anh || event.image)
                                        : event.image
                                }
                                alt={event.title}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                                onError={(e) => (e.target.src = iconTag)}
                            />
                        </div>

                        {/* INFO */}
                        <div
                            style={{
                                fontSize: "16px",
                                color: "#334155",
                                marginBottom: "20px",
                                lineHeight: "1.5"
                            }}
                        >
                            🕒{" "}
                            {event.date
                                ? new Date(event.date).toLocaleString("vi-VN")
                                : "Chưa có thời gian"}{" "}
                            <br />
                            📍 {event.location || "Chưa có địa điểm"}
                        </div>

                        {/* BUTTON */}
                        {/* CHECK HẾT HẠN */}
                        {new Date(event.date) < new Date() ? (
                            // NÚT HẾT HẠN – KHÔNG NHẤN ĐƯỢC
                            <div
                                style={{
                                    padding: "12px",
                                    background: "#9ca3af",
                                    borderRadius: "12px",
                                    textAlign: "center",
                                    fontWeight: "700",
                                    color: "white",
                                    fontSize: "16px",
                                    opacity: 0.9,
                                    cursor: "not-allowed"
                                }}
                            >
                                ⛔ HẾT HẠN ĐĂNG KÝ
                            </div>
                        ) : (
                            // NÚT XEM CHI TIẾT – BÌNH THƯỜNG
                            <Link
                                to={`/events/${event.id}`}
                                style={{
                                    display: "block",
                                    padding: "12px",
                                    background: "linear-gradient(90deg,#38bdf8,#0ea5e9)",
                                    borderRadius: "12px",
                                    textAlign: "center",
                                    fontWeight: "700",
                                    color: "white",
                                    textDecoration: "none",
                                    fontSize: "16px",
                                    boxShadow: "0 4px 12px rgba(0, 170, 255, 0.35)"
                                }}
                            >
                                🔍 Xem chi tiết
                            </Link>
                        )}

                    </div>
                ))}
            </div>
            <footer
                style={{
                    marginTop: "60px",
                    padding: "35px 20px",
                    background: "rgba(255, 255, 255, 0.6)",
                    borderTop: "2px solid #cce7ff",
                    fontFamily: "Arial, sans-serif",
                    backdropFilter: "blur(6px)",
                    borderRadius: "8px",
                }}
            >
                <div
                    style={{
                        maxWidth: "900px",
                        margin: "0 auto",
                        display: "flex",
                        gap: "25px",
                        alignItems: "flex-start",
                    }}
                >
                    {/* LOGO */}
                    <img
                        src={logo}
                        alt="HCMUNRE Logo"
                        style={{
                            width: "75px",
                            height: "75px",
                            borderRadius: "6px",
                            border: "1px solid #d0e7ff",
                            padding: "5px",
                            background: "#fff",
                        }}
                    />

                    {/* RIGHT CONTENT */}
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: "700", fontSize: "20px", color: "#0c4a6e", marginBottom: "6px" }}>
                            HCMUNRE Event Manager
                        </p>

                        <p style={{ fontSize: "14px", color: "#1e293b", marginBottom: "12px" }}>
                            Nền tảng hỗ trợ đăng ký sự kiện – quét mã QR – và quản lý điểm rèn luyện dành cho sinh viên.
                        </p>

                        <p style={{ fontWeight: "700", fontSize: "15px", color: "#0d9488", marginBottom: "6px" }}>
                            Thông tin liên hệ
                        </p>

                        <p style={contactStyle}>
                            📍 236B Lê Văn Sỹ, Phường Tân Sơn Hòa, TP. Hồ Chí Minh
                        </p>
                        <p style={contactStyle}>
                            ✉️ 1050080149@hcmunre.edu.vn
                        </p>

                        <div style={{ marginTop: "10px", fontSize: "12px", color: "#64748b" }}>
                            © 2025 HCMUNRE - Phát triển bởi sinh viên, vì cộng đồng sinh viên.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

///////////////////////// STYLE COMPONENTS /////////////////////////

const SectionTitle = ({ text }) => (
    <h3
        style={{
            color: "#000",
            marginTop: "28px",
            fontWeight: 700,
            background: "rgba(46,134,193,0.12)",
            padding: "10px 14px",
            borderRadius: "12px",
            borderLeft: "4px solid #3b82f6",
        }}
    >
        {text}
    </h3>
);

const ulStyle = {
    marginLeft: "22px",
    marginTop: "10px",
    fontWeight: 500,
    color: "#000",
};

const contactStyle = {
    margin: "4px 0",
    fontSize: "14px",
    color: "#475569",
};

export default Events;
