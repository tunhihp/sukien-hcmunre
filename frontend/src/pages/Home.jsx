import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/logo.jpg";

function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <>
            {/* HERO WITH BACKGROUND IMAGE */}
            <section
                className="hero"
                style={{
                    backgroundImage: "url(/bg-hcmunre.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100vh",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textAlign: "center",
                }}
            >
                {/* Dark overlay giúp chữ nổi bật trên ảnh */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.45)",
                    }}
                ></div>

                <div style={{ position: "relative", zIndex: 2, maxWidth: "850px", padding: "0 20px" }}>
                    <h1
                        style={{
                            fontSize: "40px",
                            fontWeight: "700",
                            textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
                        }}
                    >
                        Chào mừng đến với cổng thông tin sự kiện & điểm rèn luyện HCMUNRE
                    </h1>

                    <p
                        style={{
                            fontSize: "18px",
                            marginTop: "15px",
                            marginBottom: "28px",
                            lineHeight: "1.5",
                            color: "#f1f5f9",
                            textShadow: "1px 1px 6px rgba(0,0,0,0.8)",
                        }}
                    >
                        Đăng ký sự kiện – Quét QR – Theo dõi điểm rèn luyện – Tất cả trong một nền tảng duy nhất.
                    </p>

                    <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
                        <button
                            onClick={() => navigate("/events")}
                            style={{
                                backgroundColor: "#0284c7",
                                color: "white",
                                padding: "12px 28px",
                                borderRadius: "8px",
                                border: "none",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontSize: "16px",
                            }}
                        >
                            Duyệt sự kiện
                        </button>

                        {!isAuthenticated && (
                            <button
                                onClick={() => (window.location.href = "/login")}
                                style={{
                                    backgroundColor: "#7c3aed",
                                    padding: "12px 24px",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                }}
                            >
                                Bắt đầu →
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT – LIGHT MODE BLUE THEME */}
            <div style={{ backgroundColor: "#E6F2FF", color: "#0f172a", fontFamily: "Arial, sans-serif" }}>

                {/* FEATURES */}
                <section style={{ padding: "70px 20px", textAlign: "center" }}>
                    <h2 style={{ color: "#0284c7", marginBottom: "12px", fontSize: "18px" }}>TÍNH NĂNG</h2>
                    <h1 style={{ fontSize: "34px", fontWeight: "700", marginBottom: "45px" }}>
                        Mọi thứ bạn cần để kết nối cùng trường
                    </h1>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "20px",
                            flexWrap: "wrap",
                            maxWidth: "1150px",
                            margin: "0 auto",
                        }}
                    >
                        {[
                            {
                                icon: "📅",
                                title: "Khám phá sự kiện",
                                desc: "Tìm kiếm và đăng ký hàng trăm sự kiện mỗi năm.",
                            },
                            {
                                icon: "👥",
                                title: "Cộng đồng sinh viên",
                                desc: "Kết nối và chia sẻ kinh nghiệm.",
                            },
                            {
                                icon: "🔔",
                                title: "Thông báo nhanh",
                                desc: "Luôn cập nhật mọi thay đổi kịp thời.",
                            },
                            {
                                icon: "✨",
                                title: "Tương tác dễ dàng",
                                desc: "Điểm danh QR – theo dõi DRL – siêu tiện lợi.",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    width: "250px",
                                    backgroundColor: "white",
                                    padding: "22px",
                                    borderRadius: "12px",
                                    border: "1px solid #cbd5e1",
                                    textAlign: "center",
                                    transition: "0.3s",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-6px)";
                                    e.currentTarget.style.backgroundColor = "#E0F7FF";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.backgroundColor = "white";
                                }}
                            >
                                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
                                <h3 style={{ fontWeight: "600", marginBottom: "6px" }}>{item.title}</h3>
                                <p style={{ fontSize: "14px", color: "#475569" }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* UPCOMING EVENTS */}
                <section style={{ padding: "70px 20px", textAlign: "center" }}>
                    <h2 style={{ color: "#0284c7", marginBottom: 10 }}>SỰ KIỆN SẮP DIỄN RA</h2>
                    <h1 style={{ fontSize: "30px", fontWeight: "700", marginBottom: "30px" }}>
                        Đừng bỏ lỡ các hoạt động nổi bật
                    </h1>

                    <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
                        {[
                            { name: "Hội thảo Công nghệ", date: "2025-03-15", time: "10:00 AM" },
                            { name: "Cuộc thi Lập trình", date: "2025-03-20", time: "14:00 PM" },
                        ].map((event, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: "white",
                                    padding: "22px",
                                    borderRadius: "12px",
                                    border: "1px solid #cbd5e1",
                                    width: "300px",
                                    textAlign: "left",
                                }}
                            >
                                <h3 style={{ fontWeight: "700" }}>{event.name}</h3>
                                <p style={{ marginTop: "8px", color: "#334155", fontSize: "14px" }}>
                                    📅 {event.date} – {event.time}
                                </p>
                                <a href="#" style={{ color: "#2563eb", fontSize: "14px" }}>
                                    Tìm hiểu thêm →
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section
                    style={{
                        backgroundColor: "#0284c7",
                        color: "white",
                        padding: "40px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <div style={{ fontSize: "22px", fontWeight: "600" }}>
                        Sẵn sàng tham gia cùng HCMUNRE?<br />Hãy bắt đầu ngay hôm nay.
                    </div>
                    <button
                        onClick={() => navigate("/about")}
                        style={{
                            backgroundColor: "white",
                            color: "#0284c7",
                            padding: "12px 24px",
                            borderRadius: "6px",
                            fontWeight: "700",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Tìm hiểu thêm
                    </button>
                </section>

                {/* FOOTER */}
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
        </>
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

export default Home;
