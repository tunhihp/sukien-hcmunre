import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/logo.jpg";
import hienmau from "../assets/images/anhthuchmtn.jpg";
import nethoc from "../assets/images/netdepsinhvienn.jpg";
import muahexanh from "../assets/images/anhthatmhx.jpg";

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

            {/* FEATURED REAL EVENTS */}
            <section style={{ padding: "70px 20px", textAlign: "center" }}>
                <h2 style={{ color: "#0284c7", marginBottom: "10px" }}>SỰ KIỆN TIÊU BIỂU</h2>
                <h1 style={{ fontSize: "30px", fontWeight: "700", marginBottom: "35px" }}>
                    Khoảnh khắc đáng nhớ tại HCMUNRE
                </h1>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px",
                        flexWrap: "wrap",
                        maxWidth: "1100px",
                        margin: "0 auto",
                    }}
                >
                    {/* CARD 1 – HIẾN MÁU TÌNH NGUYỆN */}
                    <div
                        onClick={() => {
                            if (!isAuthenticated) navigate("/login");
                            else navigate("/events");
                        }}
                        style={{
                            width: "330px",
                            background: "white",
                            borderRadius: "14px",
                            overflow: "hidden",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
                            transition: "0.3s",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                        <img src={hienmau} alt="Hiến máu" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                        <div style={{ padding: "18px", textAlign: "left" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
                                Hiến Máu Tình Nguyện – Đợt 1 Năm 2025
                            </h3>
                            <p style={{ color: "#475569", fontSize: "14px", marginBottom: "12px" }}>
                                Sự kiện thu hút hàng trăm sinh viên tham gia, lan tỏa tinh thần yêu thương và sẻ chia.
                            </p>
                        </div>
                    </div>

                    {/* CARD 2 – NÉT ĐẸP SINH VIÊN */}
                    <div
                        onClick={() => {
                            if (!isAuthenticated) navigate("/login");
                            else navigate("/events");
                        }}
                        style={{
                            width: "330px",
                            background: "white",
                            borderRadius: "14px",
                            overflow: "hidden",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
                            transition: "0.3s",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                        <img src={nethoc} alt="Nét đẹp sinh viên" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                        <div style={{ padding: "18px", textAlign: "left" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
                                Chung Kết – Nét Đẹp Sinh Viên HCMUNRE 2025
                            </h3>
                            <p style={{ color: "#475569", fontSize: "14px", marginBottom: "12px" }}>
                                Một đêm tỏa sáng của tài năng, trí tuệ và vẻ đẹp sinh viên trường Tài Nguyên – Môi Trường.
                            </p>
                        </div>
                    </div>

                    {/* CARD 3 – MÙA HÈ XANH 2025 */}
                    <div
                        onClick={() => {
                            if (!isAuthenticated) navigate("/login");
                            else navigate("/events");
                        }}
                        style={{
                            width: "330px",
                            background: "white",
                            borderRadius: "14px",
                            overflow: "hidden",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
                            transition: "0.3s",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                        <img src={muahexanh} alt="Mùa hè xanh" style={{ width: "100%", height: "200px", objectFit: "cover" }} />

                        <div style={{ padding: "18px", textAlign: "left" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
                                Chiến Dịch Tình Nguyện – Mùa Hè Xanh 2025
                            </h3>
                            <p style={{ color: "#475569", fontSize: "14px", marginBottom: "12px" }}>
                                Hành trình lan tỏa tinh thần nhiệt huyết của sinh viên HCMUNRE tại TP.HCM,
                                Đồng Tháp và Đồng Nai với nhiều hoạt động ý nghĩa.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* STATISTICS SECTION - VIP UPGRADE */}
            <section
                style={{
                    background: "linear-gradient(to bottom, #ffffff, #f0f9ff)",
                    padding: "70px 20px",
                    textAlign: "center",
                }}
            >
                <h2
                    style={{
                        fontSize: "36px",
                        fontWeight: "800",
                        marginBottom: "40px",
                        color: "#0c4a6e",
                    }}
                >
                    HCMUNRE Event Manager – Những con số ấn tượng
                </h2>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "40px",
                        flexWrap: "wrap",
                        maxWidth: "1100px",
                        margin: "0 auto",
                    }}
                >
                    {[
                        { number: "100+", label: "Sự kiện mỗi năm" },
                        { number: "1000+", label: "Sinh viên tham gia" },
                        { number: "2000+", label: "Điểm rèn luyện ghi nhận" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            style={{
                                width: "260px",
                                padding: "28px 25px",
                                background: "white",
                                borderRadius: "18px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
                                transition: "0.35s",
                                cursor: "pointer",

                                /* Hiệu ứng 3D khi hover */
                                transform: "translateY(0)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-10px)";
                                e.currentTarget.style.boxShadow =
                                    "0 12px 28px rgba(0,150,255,0.25)";
                                e.currentTarget.style.border =
                                    "1px solid rgba(14,165,233,0.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 8px 18px rgba(0,0,0,0.10)";
                                e.currentTarget.style.border =
                                    "1px solid #e2e8f0";
                            }}
                        >
                            {/* Số lớn */}
                            <p
                                style={{
                                    fontSize: "48px",
                                    fontWeight: "800",
                                    color: "#0284c7",
                                    marginBottom: "8px",
                                    textShadow: "0px 3px 6px rgba(0,0,0,0.12)",
                                }}
                            >
                                {item.number}
                            </p>

                            {/* Label */}
                            <p
                                style={{
                                    fontSize: "18px",
                                    color: "#475569",
                                    fontWeight: "500",
                                }}
                            >
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TESTIMONIALS VIP LAYOUT FIXED */}
            <section
                style={{
                    padding: "70px 20px",
                    textAlign: "center",
                    background: "linear-gradient(to bottom, #f0f9ff, #ffffff)",
                }}
            >
                <h2
                    style={{
                        fontSize: "36px",
                        fontWeight: "800",
                        marginBottom: "45px",
                        color: "#0c4a6e",
                    }}
                >
                    Sinh viên nói gì về nền tảng?
                </h2>

                {/* LAYOUT 3 CỘT CÂN ĐẸP */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
                        gap: "35px",
                        maxWidth: "1100px",
                        margin: "0 auto",
                    }}
                >
                    {[
                        {
                            name: "Trần Minh Kỳ",
                            text: "“Điểm danh QR quá tiện! Đỡ phải ký giấy, đỡ chen hàng.”",
                            color: "#38bdf8",
                        },
                        {
                            name: "Nguyễn Thị Tú Nhi",
                            text: "“Theo dõi DRL rõ ràng, minh bạch. Không còn bị thiếu điểm nữa.”",
                            color: "#f472b6",
                        },
                        {
                            name: "Nguyễn Hoàng Anh",
                            text: "“Giao diện đẹp, dễ dùng, thông báo nhanh chóng.”",
                            color: "#a78bfa",
                        },
                    ].map((c, i) => (
                        <div
                            key={i}
                            style={{
                                padding: "28px",
                                borderRadius: "20px",
                                background: `linear-gradient(135deg, ${c.color}15, #ffffff)`,
                                border: `1.5px solid ${c.color}55`,
                                boxShadow: `0 10px 25px ${c.color}35`,
                                textAlign: "left",
                                transition: "0.35s",
                                cursor: "pointer",
                                minHeight: "200px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow = `0 14px 30px ${c.color}55`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = `0 10px 25px ${c.color}35`;
                            }}
                        >
                            {/* Avatar */}
                            <div
                                style={{
                                    width: "55px",
                                    height: "55px",
                                    borderRadius: "50%",
                                    background: c.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: "700",
                                    fontSize: "22px",
                                    marginBottom: "18px",
                                    boxShadow: `0 4px 12px ${c.color}55`,
                                }}
                            >
                                {c.name.split(" ").slice(-1)[0].charAt(0)}
                            </div>

                            {/* Nội dung */}
                            <p
                                style={{
                                    fontStyle: "italic",
                                    marginBottom: "15px",
                                    color: "#334155",
                                    fontSize: "16px",
                                }}
                            >
                                {c.text}
                            </p>

                            <p
                                style={{
                                    fontWeight: "700",
                                    color: c.color,
                                    fontSize: "16px",
                                    marginTop: "10px",
                                }}
                            >
                                — {c.name}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* MAIN CONTENT – LIGHT MODE BLUE THEME */}
            <div style={{ backgroundColor: "#E6F2FF", color: "#0f172a", fontFamily: "Arial, sans-serif" }}>

                {/* FEATURES */}
                <section
                    style={{
                        padding: "70px 20px",
                        textAlign: "center",
                        overflowX: "hidden"   // 🟦 CHẶN CUỘN NGANG
                    }}
                >
                    <h2 style={{ color: "#0284c7", marginBottom: "12px", fontSize: "18px" }}>TÍNH NĂNG</h2>
                    <h1 style={{ fontSize: "34px", fontWeight: "700", marginBottom: "45px" }}>
                        Mọi thứ bạn cần để kết nối cùng trường
                    </h1>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "20px",
                            flexWrap: "nowrap",        // luôn 1 hàng, không xuống dòng
                            overflowX: "hidden",       // ✨ quan trọng
                            width: "100%",
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
                                    minWidth: "250px",         // 🔥 Giữ cố định kích thước -> luôn 4 ô 1 hàng
                                    backgroundColor: "white",
                                    padding: "22px",
                                    borderRadius: "12px",
                                    border: "1px solid #cbd5e1",
                                    textAlign: "center",
                                    transition: "0.3s",
                                    cursor: "pointer",
                                    flexShrink: 0               // 🔥 Không co lại khi hẹp
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
