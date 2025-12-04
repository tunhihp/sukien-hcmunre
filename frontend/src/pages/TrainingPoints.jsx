import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const TrainingPoints = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        axios
            .get(`http://localhost:3001/api/points/${user.ma_nguoi_dung}`)
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log("ERR:", err);
                setLoading(false);
            });
    }, [user]);

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "40px",
                background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
                fontFamily: "Inter, sans-serif",
                color: "#0f172a"
            }}
        >
            <h2
                style={{
                    fontSize: "36px",
                    marginBottom: "24px",
                    textAlign: "center",
                    fontWeight: "800",
                    background: "linear-gradient(135deg, #1e3a8a, #0f172a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}
            >
                ⭐ Điểm rèn luyện
            </h2>

            <div
                style={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    padding: "28px",
                    borderRadius: "16px",
                    maxWidth: "600px",
                    margin: "0 auto",
                    border: "2px solid #90caf9",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    transition: "0.3s"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                }}
            >
                {loading ? (
                    <p style={{ textAlign: "center", color: "#475569", fontSize: "16px" }}>
                        Đang tải dữ liệu...
                    </p>
                ) : !data ? (
                    <p style={{ textAlign: "center", color: "#475569", fontSize: "16px" }}>
                        Chưa có dữ liệu điểm rèn luyện.
                    </p>
                ) : (
                    <>
                        <h3
                            style={{
                                fontSize: "26px",
                                marginBottom: "14px",
                                fontWeight: "700",
                                color: "#1e3a8a"
                            }}
                        >
                            Tổng điểm: {data.tong_diem}
                        </h3>

                        <div
                            style={{
                                backgroundColor: "rgba(227,242,253,0.8)",
                                padding: "18px",
                                borderRadius: "10px",
                                border: "1px solid #90caf9"
                            }}
                        >
                            <p
                                style={{
                                    marginBottom: "6px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#0f172a"
                                }}
                            >
                                📌 Cập nhật gần nhất:
                            </p>

                            <p style={{ color: "#475569", fontSize: "15px" }}>
                                {data.cap_nhat_cuoi
                                    ? new Date(data.cap_nhat_cuoi).toLocaleString("vi-VN")
                                    : "Không có dữ liệu"}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TrainingPoints;
