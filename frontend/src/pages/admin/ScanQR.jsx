import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3001";

export default function ScanQR() {
    const videoRef = useRef(null);
    const codeReaderRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [status, setStatus] = useState("Không có dữ liệu QR!");
    const navigate = useNavigate();

    const cleanupReader = () => {
        try {
            if (codeReaderRef.current) {
                codeReaderRef.current.reset();
            }
        } catch (e) {
            // ignore
        }
        const video = videoRef.current;
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach((t) => t.stop());
            video.srcObject = null;
        }
    };

    const startCamera = async () => {
        try {
            setError("");
            setSuccess("");
            setStatus("Đang chờ quét QR...");
            window.QR_LOCK = false;

            if (!codeReaderRef.current) {
                codeReaderRef.current = new BrowserMultiFormatReader();
            }

            // use default camera; library will handle device selection
            await codeReaderRef.current.decodeFromVideoDevice(
                null,
                videoRef.current,
                (result, err) => {
                    if (result) {
                        const text = result.getText ? result.getText() : result.text;
                        const qrValue = (text || "").trim();
                        if (qrValue) {
                            handleDecodedQR(qrValue);
                        } else {
                            setStatus("Không có dữ liệu QR!");
                        }
                    } else if (err) {
                        // do not spam errors; just keep waiting
                        setStatus("Không có dữ liệu QR!");
                    }
                }
            );

            setScanning(true);
        } catch (err) {
            console.error("Camera/ZXing error:", err);
            setError("Không mở được camera hoặc không thể khởi tạo trình quét QR.");
            setStatus("Không có dữ liệu QR!");
            cleanupReader();
            setScanning(false);
        }
    };

    const stopCamera = () => {
        cleanupReader();
        setScanning(false);
        if (!success && !error) {
            setStatus("Không có dữ liệu QR!");
        }
    };

    useEffect(() => {
        return () => {
            cleanupReader();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDecodedQR = async (qrValue) => {
        if (!qrValue || window.QR_LOCK || isCheckingIn) return;

        window.QR_LOCK = true; // Ngăn double-scan
        setIsCheckingIn(true);
        setError("");
        setSuccess("");
        setStatus(`Đã đọc QR: ${qrValue}`);

        try {
            // Dừng camera khi đã có mã hợp lệ
            cleanupReader();
            setScanning(false);

            // Gửi trực tiếp sang API checkin của Node
            const response = await axios.post(`${API_BASE}/api/checkin/scan`, {
                qr: qrValue,
            });

            if (response.data?.success) {
                const msg = response.data.message || "Điểm danh thành công";
                setSuccess(msg);
            } else {
                const msg = response.data?.message || "Check-in thất bại!";
                setError(msg);
                window.QR_LOCK = false;
            }
        } catch (err) {
            console.error("Check-in error:", err);
            const resMessage = err.response?.data?.message || "Lỗi khi gọi API check-in!";
            setError(resMessage);
            window.QR_LOCK = false;
        } finally {
            setIsCheckingIn(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
                color: "#0f172a",
                padding: "30px 20px",
                fontFamily: "Inter, sans-serif",
                position: "relative"
            }}
        >
            {/* BUTTON QUAY LẠI — Giữ góc trái */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    backgroundColor: "#90caf9",
                    color: "#0f172a",
                    border: "1px solid #64b5f6",
                    padding: "10px 20px",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "0.25s"
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#64b5f6")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#90caf9")}
            >
                ← Quay lại
            </button>

            {/* BỌC TOÀN KHỐI Ở GIỮA */}
            <div style={{
                maxWidth: 900,
                margin: "0 auto",
                textAlign: "center",
                marginTop: 40
            }}>
                <h2 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "8px" }}>
                    📸 Quét mã QR trực tiếp bằng Camera
                </h2>
                <p style={{ color: "#374151", marginBottom: "20px" }}>
                    Đưa mã QR của sinh viên vào khung hình. Hệ thống sẽ tự động nhận diện và điểm danh.
                </p>

                {/* CAMERA BOX CĂN GIỮA */}
                <div
                    style={{
                        backgroundColor: "rgba(255,255,255,0.75)",
                        borderRadius: "18px",
                        padding: "20px",
                        border: "2px solid #bbdefb",
                        width: "100%",
                        maxWidth: 420,
                        margin: "0 auto",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                        transition: "0.3s"
                    }}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        style={{
                            width: "100%",
                            borderRadius: 12,
                            backgroundColor: "black"
                        }}
                    />

                    {/* BUTTONS */}
                    <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                        <button
                            onClick={startCamera}
                            disabled={scanning}
                            style={{
                                flex: 1,
                                padding: "12px",
                                backgroundColor: scanning ? "#9ca3af" : "#42a5f5",
                                borderRadius: 10,
                                color: "white",
                                fontWeight: "bold",
                                border: "none",
                                cursor: scanning ? "not-allowed" : "pointer",
                                transition: "0.25s"
                            }}
                            onMouseEnter={(e) =>
                                !scanning && (e.target.style.backgroundColor = "#1e88e5")
                            }
                            onMouseLeave={(e) =>
                                !scanning && (e.target.style.backgroundColor = "#42a5f5")
                            }
                        >
                            {scanning ? "Đang quét..." : "🚀 Bật Camera"}
                        </button>

                        {scanning && (
                            <button
                                onClick={stopCamera}
                                style={{
                                    padding: 12,
                                    borderRadius: 10,
                                    border: "1px solid rgba(248,113,113,0.8)",
                                    backgroundColor: "transparent",
                                    color: "#b91c1c",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                ⏹ Dừng
                            </button>
                        )}
                    </div>

                    {/* STATUS */}
                    <div
                        style={{
                            marginTop: 12,
                            fontSize: 14,
                            color: "#0f172a"
                        }}
                    >
                        {status}
                    </div>

                    {isCheckingIn && (
                        <div
                            style={{
                                marginTop: 14,
                                padding: 10,
                                borderRadius: 10,
                                backgroundColor: "#e0f2fe",
                                color: "#0369a1",
                                fontSize: 14
                            }}
                        >
                            ⏳ Đang gửi dữ liệu check-in...
                        </div>
                    )}

                    {success && (
                        <div
                            style={{
                                marginTop: 14,
                                padding: 10,
                                borderRadius: 10,
                                backgroundColor: "#d1fae5",
                                color: "#065f46",
                                fontSize: 14,
                                fontWeight: 600
                            }}
                        >
                            {success}
                        </div>
                    )}

                    {error && (
                        <div
                            style={{
                                marginTop: 14,
                                padding: 10,
                                borderRadius: 10,
                                backgroundColor: "#fee2e2",
                                color: "#b91c1c",
                                fontSize: 14,
                                fontWeight: 600
                            }}
                        >
                            ❌ {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

