import React from 'react';
import logo from "../assets/images/logo.jpg";

const Community = () => {
    return (
        <div
            style={{
                background: '#dff1ff',
                color: '#1e293b',
                minHeight: '100vh',
                padding: '20px 20px',
                fontFamily: "Inter, Segoe UI, sans-serif"
            }}
        >
            {/* ==== TIÊU ĐỀ ==== */}
            <h1
                style={{
                    fontSize: "34px",
                    marginBottom: "32px",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#0f172a",
                    padding: "14px 28px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(144,202,249,0.6)",
                    boxShadow: "0 6px 20px rgba(144,202,249,0.25)",
                    display: "inline-block",
                    marginLeft: "50%",
                    transform: "translateX(-50%)",
                    backdropFilter: "blur(6px)"
                }}
            >
                Chính sách bảo mật
            </h1>
            <div
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    backgroundColor: '#ffffff',
                    padding: '40px',
                    borderRadius: '24px',
                    border: '2px solid rgba(59,130,246,0.35)',
                    boxShadow:
                        '0 8px 25px rgba(0,0,0,0.05), 0 0 18px rgba(59,130,246,0.25)',
                    backdropFilter: 'blur(4px)',
                    transition: '0.3s',
                }}
            >
               
                <p
                    style={{
                        textAlign: 'center',
                        color: "#0f172a",
                        fontSize: '17px',
                        marginBottom: '30px',
                        fontWeight: 500
                    }}
                >
                    HCMUNRE Event Manager cam kết bảo vệ sự riêng tư & dữ liệu Sinh viên
                </p>

                {/* ==== NỘI DUNG ==== */}
                <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#1e293b' }}>

                    <p>
                        Nhà trường trân trọng sự tin tưởng mà sinh viên dành cho nền tảng HCMUNRE Event Manager.
                    </p>

                    <p style={{ marginTop: '12px' }}>
                        Chính sách này mô tả cách Nhà trường thu thập, xử lý và bảo vệ dữ liệu nhằm mang lại trải nghiệm an toàn nhất.
                    </p>

                    {/* MỤC 1 */}
                    <h3 style={{
                        color: '#0f172a',
                        marginTop: '24px',
                        fontWeight: 700,
                        background: 'rgba(59,130,246,0.12)',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #3b82f6'
                    }}>
                        🔍 1. Thông tin Nhà trường thu thập
                    </h3>

                    <ul style={{ marginLeft: '22px', marginTop: '8px' }}>
                        <li>Họ tên, email trường, số điện thoại</li>
                        <li>Mã số sinh viên, khoa, lớp</li>
                        <li>Thông tin khi đăng ký tham gia sự kiện</li>
                    </ul>

                    {/* MỤC 2 */}
                    <h3 style={{
                        color: '#0f172a',
                        marginTop: '24px',
                        fontWeight: 700,
                        background: 'rgba(59,130,246,0.12)',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #3b82f6'
                    }}>
                        💡 2. Mục đích sử dụng dữ liệu
                    </h3>

                    <ul style={{ marginLeft: '22px', marginTop: '8px' }}>
                        <li>Xử lý đăng ký sự kiện</li>
                        <li>Gửi thông báo & cập nhật</li>
                        <li>Cải tiến giao diện và tính năng</li>
                        <li>Đảm bảo an toàn – chống gian lận</li>
                        <li>Hỗ trợ kỹ thuật</li>
                    </ul>

                    {/* MỤC 3 */}
                    <h3 style={{
                        color: '#0f172a',
                        marginTop: '24px',
                        fontWeight: 700,
                        background: 'rgba(59,130,246,0.12)',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #3b82f6'
                    }}>
                        🔐 3. Bảo mật thông tin
                    </h3>

                    <p style={{ marginTop: '6px' }}>
                        Nền tảng áp dụng mã hóa, tường lửa và xác thực nhiều lớp.
                        Tuy nhiên, người dùng cũng nên tự bảo vệ dữ liệu cá nhân của mình.
                    </p>

                    {/* MỤC 4 */}
                    <h3 style={{
                        color: '#0f172a',
                        marginTop: '24px',
                        fontWeight: 700,
                        background: 'rgba(59,130,246,0.12)',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #3b82f6'
                    }}>
                        🧑‍🎓 4. Quyền của Sinh viên
                    </h3>

                    <ul style={{ marginLeft: '22px', marginTop: '8px' }}>
                        <li>Quyền xem thông tin cá nhân.</li>
                        <li>Quyền xem và đăng ký tham gia sự kiện.</li>
                        <li>Quyền theo dõi điểm rèn luyện tích lũy cá nhân.</li>
                        <li>Quyền nhận thông báo khi có sự kiện mới hoặc kết quả điểm rèn luyện.</li>
                    </ul>
                    
                    {/* MỤC 5 */}
                    <h3 style={{
                        color: '#0f172a',
                        marginTop: '24px',
                        fontWeight: 700,
                        background: 'rgba(59,130,246,0.12)',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #3b82f6'
                    }}>
                        📬 5. Liên hệ hỗ trợ
                    </h3>

                    <p style={{ marginTop: '6px' }}>
                        Mọi hỗ trợ vui lòng email:
                        <strong> 1050080149@sv.hcmunre.edu.vn</strong>.
                    </p>

                    <p
                        style={{
                            marginTop: '20px',
                            color: '#1e40af',
                            textAlign: 'center',
                            fontStyle: 'italic',
                            fontWeight: 600
                        }}
                    >
                        “Bảo mật của bạn là sự ưu tiên của Nhà trường.”
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
                        <p style={{
                            fontWeight: "700", fontSize: "20px", color: "#0f172a", marginBottom: "6px" }}>
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
};

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

export default Community;
