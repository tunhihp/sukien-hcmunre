// frontend/src/pages/admin/RewardPointsManagement.jsx
// Trang quản lý điểm rèn luyện
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RewardPointsManagement() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        user_id: '',
        hoc_ky: '1',
        nam_hoc: '2025',
        tong_diem: '',
        action: 'add' // 'add' or 'set'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [currentPoints, setCurrentPoints] = useState(null);

    const fetchCurrentPoints = async () => {
        if (!formData.user_id) return;

        try {
            const res = await fetch(`http://localhost:3001/api/points/${formData.user_id}`);
            const data = await res.json();
            setCurrentPoints(data);
        } catch (err) {
            console.error("Lỗi lấy điểm:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.user_id || !formData.tong_diem) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3001/api/drl/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: parseInt(formData.user_id),
                    hoc_ky: formData.hoc_ky,
                    nam_hoc: formData.nam_hoc,
                    tong_diem: parseInt(formData.tong_diem),
                    action: formData.action
                })
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(`Cập nhật điểm thành công! Điểm mới: ${data.data?.tong_diem || 0}`);
                setFormData({ ...formData, tong_diem: '' });
                fetchCurrentPoints();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                alert(data.message || "Cập nhật điểm thất bại!");
            }

        } catch (err) {
            console.error("Lỗi cập nhật điểm:", err);
            alert("Không thể cập nhật điểm!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "40px 20px",
                background: "linear-gradient(to bottom, #e0f2fe, #bfdbfe, #93c5fd)",
                color: "#1e293b",
                fontFamily: "Inter, sans-serif"
            }}
        >
            <button
                onClick={() => navigate("/admin")}
                style={{
                    background: "linear-gradient(135deg, #a78bfa, #8b5cf6)",
                    color: "white",
                    border: "none",
                    padding: "12px 22px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontFamily: "Inter, sans-serif",
                    marginBottom: "28px",
                    boxShadow: "0 6px 18px rgba(139,92,246,0.35)",
                    transition: ".25s"
                }}
            >
                ⬅ Quay lại Admin
            </button>

            <h1
                style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    marginBottom: "35px",
                    textAlign: "center",
                    color: "#1e3a8a",
                    fontFamily: "Inter, sans-serif",
                    textShadow: "0 2px 10px rgba(30,58,138,0.15)"
                }}
            >
                ⭐ Quản lý Điểm Rèn Luyện
            </h1>

            <div
                style={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    background: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "24px",
                    padding: "40px",
                    border: "1px solid rgba(148,163,184,0.45)",
                    boxShadow: "0 12px 40px rgba(30,58,138,0.30)"
                }}
            >
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "24px" }}>

                        {/* LABEL */}
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: 600,
                                fontSize: 15,
                                color: "#334155",
                                fontFamily: "Inter, sans-serif"
                            }}
                        >
                            ID Người dùng *
                        </label>

                        <div style={{ display: "flex", gap: "12px" }}>

                            {/* INPUT USER ID */}
                            <input
                                type="number"
                                value={formData.user_id}
                                onChange={(e) => {
                                    setFormData({ ...formData, user_id: e.target.value });
                                    setCurrentPoints(null);
                                }}
                                required
                                style={{
                                    flex: 1,
                                    padding: "12px 14px",
                                    borderRadius: "14px",
                                    border: "1px solid rgba(148,163,184,0.45)",
                                    background: "rgba(255,255,255,0.85)",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 15,
                                    color: "#1e293b",
                                    backdropFilter: "blur(6px)",
                                    transition: ".25s"
                                }}
                            />

                            {/* BUTTON CHECK POINTS */}
                            <button
                                type="button"
                                onClick={fetchCurrentPoints}
                                style={{
                                    padding: "12px 20px",
                                    borderRadius: "14px",
                                    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    fontFamily: "Inter, sans-serif",
                                    boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
                                    transition: ".25s"
                                }}
                            >
                                🔍 Xem điểm
                            </button>
                        </div>

                        {/* CURRENT POINT BOX */}
                        {currentPoints && (
                            <div
                                style={{
                                    marginTop: "12px",
                                    padding: "14px",
                                    borderRadius: "14px",
                                    background: "rgba(59,130,246,0.15)",
                                    border: "1px solid rgba(96,165,250,0.45)",
                                    boxShadow: "0 4px 12px rgba(59,130,246,0.2)"
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        fontWeight: 700,
                                        color: "#1e40af",
                                        fontFamily: "Inter, sans-serif"
                                    }}
                                >
                                    Điểm hiện tại: {currentPoints.tong_diem || 0} điểm{" "}
                                    {currentPoints.hoc_ky && ` (HK${currentPoints.hoc_ky} - ${currentPoints.nam_hoc})`}
                                </p>
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "20px",
                            marginBottom: "24px",
                        }}
                    >
                        {/* HỌC KỲ */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: 600,
                                    fontSize: 15,
                                    color: "#334155",
                                    fontFamily: "Inter, sans-serif",
                                }}
                            >
                                Học kỳ
                            </label>

                            <select
                                value={formData.hoc_ky}
                                onChange={(e) => setFormData({ ...formData, hoc_ky: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "12px 14px",
                                    borderRadius: "14px",
                                    border: "1px solid rgba(148,163,184,0.45)",
                                    background: "rgba(255,255,255,0.85)",
                                    fontSize: 15,
                                    fontFamily: "Inter, sans-serif",
                                    color: "#1e293b",
                                    backdropFilter: "blur(6px)",
                                    transition: ".25s",
                                }}
                            >
                                <option value="1">Học kỳ 1</option>
                                <option value="2">Học kỳ 2</option>
                            </select>
                        </div>

                        {/* NĂM HỌC */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: 600,
                                    fontSize: 15,
                                    color: "#334155",
                                    fontFamily: "Inter, sans-serif",
                                }}
                            >
                                Năm học
                            </label>

                            <input
                                type="text"
                                required
                                value={formData.nam_hoc}
                                onChange={(e) => setFormData({ ...formData, nam_hoc: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "12px 14px",
                                    borderRadius: "14px",
                                    border: "1px solid rgba(148,163,184,0.45)",
                                    background: "rgba(255,255,255,0.85)",
                                    fontSize: 15,
                                    fontFamily: "Inter, sans-serif",
                                    color: "#1e293b",
                                    backdropFilter: "blur(6px)",
                                    transition: ".25s",
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: 600,
                                fontSize: 15,
                                color: "#334155",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            Hành động
                        </label>

                        <select
                            value={formData.action}
                            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                            style={{
                                width: "100%",
                                padding: "12px 14px",
                                borderRadius: "14px",
                                border: "1px solid rgba(148,163,184,0.45)",
                                background: "rgba(255,255,255,0.85)",
                                fontSize: 15,
                                fontFamily: "Inter, sans-serif",
                                color: "#1e293b",
                                backdropFilter: "blur(6px)",
                                transition: ".25s",
                            }}
                        >
                            <option value="add">Cộng thêm điểm</option>
                            <option value="set">Đặt điểm cụ thể</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: 600,
                                fontSize: 15,
                                color: "#334155",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            {formData.action === "add" ? "Số điểm cộng thêm *" : "Tổng điểm mới *"}
                        </label>

                        <input
                            type="number"
                            min="0"
                            required
                            value={formData.tong_diem}
                            onChange={(e) => setFormData({ ...formData, tong_diem: e.target.value })}
                            style={{
                                width: "100%",
                                padding: "12px 14px",
                                borderRadius: "14px",
                                border: "1px solid rgba(148,163,184,0.45)",
                                background: "rgba(255,255,255,0.85)",
                                fontSize: 15,
                                fontFamily: "Inter, sans-serif",
                                color: "#1e293b",
                                backdropFilter: "blur(6px)",
                                transition: ".25s",
                            }}
                        />
                    </div>

                    {success && (
                        <div
                            style={{
                                padding: "14px",
                                marginBottom: "24px",
                                borderRadius: "14px",
                                background: "rgba(16,185,129,0.18)",
                                border: "1px solid rgba(52,211,153,0.35)",
                                boxShadow: "0 4px 12px rgba(52,211,153,0.25)",
                                color: "#065f46",
                                fontWeight: 600,
                                textAlign: "center",
                                fontFamily: "Inter, sans-serif"
                            }}
                        >
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            fontSize: 16,
                            fontWeight: 700,
                            borderRadius: "14px",
                            border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontFamily: "Inter, sans-serif",

                            background: loading
                                ? "linear-gradient(135deg, rgba(167,139,250,0.45), rgba(139,92,246,0.45))"
                                : "linear-gradient(135deg, #a78bfa, #8b5cf6)",

                            color: "white",
                            boxShadow: loading
                                ? "0 4px 12px rgba(139,92,246,0.25)"
                                : "0 6px 18px rgba(139,92,246,0.35)",
                            transition: ".25s"
                        }}
                    >
                        {loading ? "⏳ Đang cập nhật..." : "💾 Cập nhật điểm"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default RewardPointsManagement;

