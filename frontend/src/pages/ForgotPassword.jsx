import React, { useState } from "react";
import axios from "axios";
import backgroundImage from "../assets/images/background.png";
import { Link } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const submitForm = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:3001/api/auth/forgot-password",
                { email }
            );

            setMessage(res.data.message);

        } catch (err) {
            setMessage(err.response?.data?.message || "Có lỗi xảy ra!");
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
                    backgroundColor: "rgba(15, 23, 42, 0.8)",
                    borderRadius: "16px",
                    padding: "40px",
                    width: "100%",
                    maxWidth: "420px",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
                    color: "#fff",
                }}
            >
                <h2
                    style={{
                        fontSize: "24px",
                        marginBottom: "10px",
                        textAlign: "center",
                        fontWeight: "700",
                    }}
                >
                    Lấy lại mật khẩu
                </h2>

                <p
                    style={{
                        fontSize: "14px",
                        textAlign: "center",
                        marginBottom: "16px",
                        color: "#d1d5db",
                    }}
                >
                    Nhập Gmail mà bạn đã dùng để đăng ký tài khoản.
                </p>

                <form
                    onSubmit={submitForm}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <input
                        type="email"
                        placeholder="Nhập Gmail đã đăng ký"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            outline: "none",
                            fontSize: "15px",
                            color: "#000",
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#6366f1",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "15px",
                        }}
                    >
                        Gửi mật khẩu mới
                    </button>
                </form>

                {message && (
                    <p
                        style={{
                            textAlign: "center",
                            marginTop: "16px",
                            color: "#4ade80",
                            fontSize: "15px",
                            fontWeight: "500",
                        }}
                    >
                        {message}
                    </p>
                )}

                <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <Link
                        to="/login"
                        style={{
                            fontSize: "14px",
                            color: "#c4b5fd",
                            textDecoration: "underline",
                        }}
                    >
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
