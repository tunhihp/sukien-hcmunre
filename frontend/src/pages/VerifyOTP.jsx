// src/pages/VerifyOTP.jsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import backgroundImage from "../assets/images/background.png";

export default function VerifyOTP() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const [otp, setOtp] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            alert("Thiếu email. Vui lòng đăng ký lại.");
            return navigate("/register");
        }

        if (!otp.trim()) {
            alert("Vui lòng nhập mã OTP.");
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp: Number(otp)
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || "Xác thực OTP thành công!");
                // 👉 Sau khi xác thực xong, chuyển sang trang Đăng nhập
                navigate("/login");
            } else {
                alert(data.message || "OTP không đúng hoặc đã hết hạn!");
            }

        } catch (err) {
            console.error(err);
            alert("⚠️ Không thể kết nối server OTP!");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
            }}
        >
            <div
                style={{
                    backgroundColor: "rgba(15, 23, 42, 0.85)",
                    borderRadius: "16px",
                    padding: "32px",
                    width: "100%",
                    maxWidth: "420px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                    color: "#fff",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "12px" }}>
                    Xác thực tài khoản
                </h2>
                <p style={{ textAlign: "center", fontSize: "14px", marginBottom: "20px" }}>
                    Mã OTP đã được gửi tới email: <br />
                    <strong>{email || "(không có email)"}</strong>
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input
                        type="text"
                        placeholder="Nhập mã OTP gồm 6 số"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            outline: "none",
                            textAlign: "center",
                            letterSpacing: "4px",
                            fontSize: "18px",
                        }}
                        maxLength={6}
                    />

                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#22c55e",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        Xác nhận OTP
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        style={{
                            marginTop: "4px",
                            backgroundColor: "transparent",
                            color: "#e5e7eb",
                            border: "1px solid #4b5563",
                            borderRadius: "6px",
                            padding: "8px",
                            fontSize: "13px",
                            cursor: "pointer",
                        }}
                    >
                        Quay lại đăng ký
                    </button>
                </form>
            </div>
        </div>
    );
}
