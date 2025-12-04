import React from "react";
import logo from "../assets/images/logo.jpg";

function AboutPage() {
    return (
        <div
            style={{
                background: "#dff1ff",
                minHeight: "100vh",
                padding: "60px 20px",
                color: "#000",
                fontFamily: "Inter, Poppins, sans-serif",
            }}
        >
            {/* Animation */}
            <style>
                {`
                @keyframes fadeDownSmooth {
                    0% {
                        opacity: 0;
                        transform: translateY(-35px);
                    }
                    60% {
                        opacity: 0.7;
                        transform: translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                `}
            </style>

            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    background: "#ffffff",
                    padding: "40px",
                    borderRadius: "22px",
                    border: "2px solid rgba(46,134,193,0.35)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.12), 0 0 18px rgba(46,134,193,0.25)",
                    backdropFilter: "blur(4px)",
                    animation: "fadeDown 0.6s ease",
                }}
            >
                {/* TITLE */}
                <h1
                    style={{
                        fontSize: '38px',
                        fontWeight: '800',
                        marginBottom: '16px',
                        textAlign: 'center',
                        color: '#0f172a',
                        textShadow: '0 2px 6px rgba(0,0,0,0.08)',
                        borderBottom: '2px solid rgba(59,130,246,0.3)',
                        paddingBottom: '10px'
                    }}
                >
                    Chính sách bảo mật & Giới thiệu
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        fontSize: "17px",
                        marginBottom: "30px",
                        color: "#0f172a",
                        fontWeight: 500,
                    }}
                >
                    HCMUNRE Event Manager cam kết bảo vệ quyền riêng tư của Sinh viên
                </p>

                {/* CONTENT */}
                <div style={{ lineHeight: "1.8", fontSize: "16px", color: "#0f172a" }}>
                    <p style={{ fontWeight: 500 }}>
                        Nhà trường trân trọng sự tin tưởng mà sinh viên dành cho nền tảng HCMUNRE Event Manager.
                    </p>

                    <p style={{ marginTop: "12px", color: "#0f172a", fontWeight: 500 }}>
                        Chính sách này mô tả cách Nhà trường thu thập, xử lý và bảo vệ dữ liệu nhằm mang lại trải nghiệm an toàn nhất.
                    </p>

                    {/* MỤC 1 */}
                    <SectionTitle text="🔍 1. Thông tin chúng tôi thu thập" />
                    <ul style={ulStyle}>
                        <li>Họ tên, email trường, số điện thoại</li>
                        <li>MSSV, khoa, lớp</li>
                        <li>Thông tin đăng ký tham gia sự kiện</li>
                    </ul>

                    {/* MỤC 2 */}
                    <SectionTitle text="💡 2. Mục đích sử dụng dữ liệu" />
                    <ul style={ulStyle}>
                        <li>Xử lý đăng ký sự kiện</li>
                        <li>Gửi thông báo & cập nhật</li>
                        <li>Cải tiến giao diện và tính năng</li>
                        <li>Đảm bảo an toàn – chống gian lận</li>
                        <li>Hỗ trợ kỹ thuật</li>
                    </ul>

                    {/* MỤC 3 */}
                    <SectionTitle text="🔐 3. Bảo mật thông tin" />
                    <p style={{ fontWeight: 500, color: "#333" }}>
                        Hệ thống áp dụng mã hóa và xác thực nhiều lớp. Tuy nhiên, Sinh viên cũng nên tự bảo vệ tài khoản cá nhân.
                    </p>

                    {/* MỤC 4 */}
                    <SectionTitle text="🧑‍🎓 4. Quyền của Sinh viên" />
                    <ul style={{ marginLeft: '22px', marginTop: '8px' }}>
                        <li>Quyền xem thông tin cá nhân.</li>
                        <li>Quyền xem và đăng ký tham gia sự kiện.</li>
                        <li>Quyền theo dõi điểm rèn luyện tích lũy cá nhân.</li>
                        <li>Quyền nhận thông báo khi có sự kiện mới hoặc kết quả điểm rèn luyện.</li>
                    </ul>

                    {/* MỤC 5 */}
                    <SectionTitle text="📬 5. Liên hệ hỗ trợ" />
                    <p style={{ fontWeight: 500 }}>
                        Mọi hỗ trợ vui lòng liên hệ:
                        <strong> 1050080149@sv.hcmunre.edu.vn</strong>.
                    </p>

                    {/* GIỚI THIỆU */}
                    <h2
                        style={{
                            fontSize: "28px",
                            fontWeight: "800",
                            marginTop: "40px",
                            color: "#000",
                        }}
                    >
                        🏫 Giới thiệu về HCMUNRE Event Manager
                    </h2>

                    <SectionTitle text="🌟 Sứ mệnh" />
                    <p style={{ fontWeight: 500, color: "#0f172a" }}>
                        Đem lại trải nghiệm số hóa sự kiện hiện đại – nhanh – tiện lợi cho sinh viên.
                    </p>

                    <SectionTitle text="🚀 Tính năng nổi bật" />
                    <ul style={ulStyle}>
                        <li>Đăng ký sự kiện nhanh</li>
                        <li>Quản lý vé & điểm rèn luyện</li>
                        <li>Thông báo realtime</li>
                        <li>Thống kê – báo cáo thuận tiện</li>
                    </ul>

                    <SectionTitle text="👨‍💻 Đội ngũ phát triển" />
                    <p style={{ fontWeight: 500, color: "#0f172a" }}>
                        Nền tảng được phát triển bởi sinh viên Công nghệ thông tin – phối hợp cùng giảng viên trường HCMUNRE.
                    </p>

                    <p
                        style={{
                            fontStyle: "italic",
                            color: "#1e40af",
                            marginTop: "20px",
                            textAlign: "center",
                            fontWeight: 600,
                        }}
                    >
                        “Sự kiện là nhịp sống của sinh viên – và Nhà trường đồng hành cùng bạn.”
                    </p>
                </div>
            </div>

            {/* FOOTER */}
            <footer
                style={{
                    marginTop: "60px",
                    padding: "35px 20px",
                    background: "rgba(255, 255, 255, 0.6)",
                    borderTop: "2px solid #cce7ff",
                    fontFamily: "Inter, Poppins, sans-serif",
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
                        <p style={{ fontWeight: "700", fontSize: "20px", color: "#0f172a", marginBottom: "6px" }}>
                            HCMUNRE Event Manager
                        </p>

                        <p style={{ fontSize: "14px", color: "#1e293b", marginBottom: "12px" }}>
                            Nền tảng hỗ trợ đăng ký sự kiện – quét mã QR – và quản lý điểm rèn luyện dành cho sinh viên.
                        </p>

                        <p style={{ fontWeight: "700", fontSize: "15px", color: "#0d9488", marginBottom: "6px" }}>
                            Thông tin liên hệ
                        </p>

                        <p style={contactStyle}>📍 236B Lê Văn Sỹ, Phường Tân Sơn Hòa, TP. Hồ Chí Minh</p>
                        <p style={contactStyle}>✉️ 1050080149@hcmunre.edu.vn</p>

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

export default AboutPage;
