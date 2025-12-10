import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';   // ⭐ THÊM Navigate VÀO ĐÂY
import { useAuth } from '../context/AuthContext';
import backgroundImage from '../assets/images/background.png';

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const { login, isAuthenticated } = useAuth();   // ⭐ CHỈ GIỮ 1 DÒNG NÀY – KHÔNG TRÙNG
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // ⭐ Nếu đã đăng nhập → chuyển hướng
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
           const API_URL = import.meta.env.VITE_API_URL;
            
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    mat_khau: form.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Đăng nhập thất bại!");
                setLoading(false);
                return;
            }

            // ⭐ Lưu token
            localStorage.setItem("token", data.token);

            // ⭐ Chuẩn hóa user
            const userData = {
                ma_nguoi_dung: data.user.ma_nguoi_dung,
                ho_ten: data.user.ho_ten || "",
                mssv: data.user.mssv || "",
                lop: data.user.lop || "",
                email: data.user.email,
                vai_tro: data.user.vai_tro,
                ma_nganh: data.user.ma_nganh,
                ma_khoa: data.user.ma_khoa,
                avatar: data.user.avatar || null  // ✅ Thêm avatar từ backend
            };

            localStorage.setItem("user", JSON.stringify(userData));
            login(userData);

            alert("Đăng nhập thành công!");
            navigate("/events");

        } catch (error) {
            console.error("Lỗi:", error);
            alert("Lỗi kết nối server!");
        } finally {
            setLoading(false);
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
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: '16px',
                    padding: '40px',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                    color: '#fff'
                }}
            >
                <h2 style={{ fontSize: '24px', marginBottom: '10px', textAlign: 'center' }}>
                    Đăng nhập vào tài khoản của bạn
                </h2>

                <p style={{ fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
                    Chưa có tài khoản?{' '}
                    <Link to="/register" style={{ color: '#a5b4fc', textDecoration: 'underline' }}>
                        Tạo một tài khoản mới
                    </Link>
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Địa chỉ email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            outline: 'none'
                        }}
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
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                outline: "none",
                                width: "100%",
                                paddingRight: "40px",
                                boxSizing: "border-box"
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
                            {showPassword ? "👁🗨" : "👁"}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <div style={{ marginTop: '14px', textAlign: 'right' }}>
                    <Link to="/forgot-password" style={{ fontSize: '13px', color: '#c4b5fd', textDecoration: 'underline' }}>
                        Quên mật khẩu?
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
