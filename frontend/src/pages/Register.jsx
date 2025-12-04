// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/background.png';

const classOptions = [
    '07_ĐH_CNTT1', '07_ĐH_CNTT2', '07_ĐH_CNTT3', '07_ĐH_CNTT4', '07_ĐH_HTTT',
    '08_ĐH_CNPM', '08_ĐH_THMT', '08_ĐH_TTMT',
    '09_ĐH_CNPM1', '09_ĐH_CNPM2', '09_ĐH_CNPM3', '09_ĐH_THMT', '09_ĐH_TMĐT', '09_ĐH_TTMT',
    '10_ĐH_CNPM1', '10_ĐH_CNPM2', '10_ĐH_CNPM3', '10_ĐH_THMT1', '10_ĐH_THMT2', '10_ĐH_TMĐT', '10_ĐH_TTM'
];

const facultyOptions = [
    { ma_khoa: "CNTT", ten_khoa: "Khoa Công nghệ thông tin" },
    { ma_khoa: "MT", ten_khoa: "Khoa Môi trường" },
    { ma_khoa: "QLDD", ten_khoa: "Khoa Quản lý đất đai" },
    { ma_khoa: "KT", ten_khoa: "Khoa Kinh tế" },
    { ma_khoa: "KTTB", ten_khoa: "Khoa Khí tượng Thủy văn & BĐKH" },
    { ma_khoa: "TDBDVT", ten_khoa: "Khoa Trắc địa Bản đồ & Viễn thám" },
];

const majorByFaculty = {
    CNTT: [
        { ma_nganh: "CNTT01", ten_nganh: "Công nghệ thông tin" },
        { ma_nganh: "CNTT02", ten_nganh: "Hệ thống thông tin" },
    ],
    MT: [
        { ma_nganh: "MT01", ten_nganh: "Công nghệ Kỹ thuật Môi trường" },
        { ma_nganh: "MT02", ten_nganh: "Quản lý Tài nguyên và Môi trường" },
        { ma_nganh: "MT03", ten_nganh: "Kỹ thuật Cấp thoát nước" },
        { ma_nganh: "MT04", ten_nganh: "Tài nguyên & Môi trường Biển Đảo" },
    ],
    QLDD: [
        { ma_nganh: "QLDD01", ten_nganh: "Quản lý Đất đai" },
    ],
    KT: [
        { ma_nganh: "KT01", ten_nganh: "Kinh tế Tài nguyên Môi trường" },
    ],
    KTTB: [
        { ma_nganh: "KTTB01", ten_nganh: "Khí tượng học" },
    ],
    TDBDVT: [
        { ma_nganh: "TDBDVT01", ten_nganh: "Trắc địa Bản đồ & Viễn thám" },
    ],
};

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        studentId: '',
        faculty: '',
        className: '',
        major: '',
        email: '',
        phone: '',
        password: '',
        role: 'user'
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1️⃣ Kiểm tra MSSV phải là 10 số
        if (!/^[0-9]{10}$/.test(form.studentId)) {
            alert("Mã số sinh viên phải gồm đúng 10 số!");
            return;
        }

        // 2️⃣ Email phải đúng dạng: MSSV + @sv.hcmunre.edu.vn
        const expectedEmail = `${form.studentId}@sv.hcmunre.edu.vn`;

        if (form.email !== expectedEmail) {
            alert(`Email không hợp lệ! Email đúng phải là: ${expectedEmail}`);
            return;
        }

        // 3️⃣ Mật khẩu phải >= 8 ký tự
        if (form.password.length < 8) {
            alert("Mật khẩu phải có ít nhất 8 ký tự!");
            return;
        }

        // 4️⃣ Admin chỉ được dùng mật khẩu mặc định
        if (form.role === "admin" && form.password !== "hcmunre") {
            alert("Admin chỉ được dùng mật khẩu mặc định: hcmunre");
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ho_ten: form.name,
                    mssv: form.studentId,
                    email: form.email,
                    mat_khau: form.password,
                    vai_tro: form.role === "admin" ? "admin" : "sinhvien",
                    ma_khoa: form.faculty,
                    ma_nganh: form.major,
                    lop: form.className,
                    sdt: form.phone
                })
            });

            let data = {};
            try {
                data = await res.json();
            } catch (e) {
                console.error("❌ Lỗi parse JSON:", e);
            }

            if (res.ok && data.success === true) {
                alert(data.message || "Đăng ký thành công!");
                return navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
            }

            alert(data.message || "Đăng ký thất bại!");

        } catch (err) {
            console.error(err);
            alert("⚠️ Không thể kết nối server!");
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    borderRadius: '16px',
                    padding: '40px',
                    width: '100%',
                    maxWidth: '500px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                    color: '#fff',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    Tạo tài khoản của bạn
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Họ và tên đầy đủ"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="text"
                        name="studentId"
                        placeholder="Mã số sinh viên"
                        value={form.studentId}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    <select
                        name="faculty"
                        value={form.faculty}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    >
                        <option value="">Chọn khoa</option>
                        {facultyOptions.map((k) => (
                            <option key={k.ma_khoa} value={k.ma_khoa}>{k.ten_khoa}</option>
                        ))}
                    </select>

                    <select
                        name="major"
                        value={form.major}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                        disabled={!form.faculty}
                    >
                        <option value="">Chọn ngành</option>
                        {form.faculty &&
                            majorByFaculty[form.faculty].map((ng) => (
                                <option key={ng.ma_nganh} value={ng.ma_nganh}>
                                    {ng.ten_nganh}
                                </option>
                            ))}
                    </select>

                    <select
                        name="className"
                        value={form.className}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    >
                        <option value="">Chọn lớp</option>
                        {classOptions.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>

                    <input
                        type="email"
                        name="email"
                        placeholder="Địa chỉ email sinh viên"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                            required
                            style={{
                                ...inputStyle,
                                width: "100%",
                                paddingRight: "40px", // chừa chỗ cho icon mắt
                                boxSizing: "border-box",
                            }}
                        />

                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                fontSize: "18px",
                                color: "#94a3b8",
                                userSelect: "none"
                            }}
                        >
                            {showPassword ? "👁‍🗨" : "👁"}
                        </span>
                    </div>

                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    >
                        <option value="user">Sinh viên</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button type="submit" style={buttonStyle}>
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    outline: 'none',
};

const buttonStyle = {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
};
