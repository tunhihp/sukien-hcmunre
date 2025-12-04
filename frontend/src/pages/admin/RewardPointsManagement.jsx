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
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1e1b4b, #2e1065, #312e81)',
            color: 'white',
            padding: '30px 20px'
        }}>
            <button
                onClick={() => navigate("/admin")}
                style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                ⬅ Quay lại Admin
            </button>

            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>
                ⭐ Quản lý Điểm Rèn Luyện
            </h1>

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(167,139,250,0.3)'
            }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            ID Người dùng *
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="number"
                                value={formData.user_id}
                                onChange={(e) => {
                                    setFormData({ ...formData, user_id: e.target.value });
                                    setCurrentPoints(null);
                                }}
                                required
                                style={{
                                    flex: '1',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(167, 139, 250, 0.3)',
                                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                    color: 'white',
                                    fontSize: '14px'
                                }}
                            />
                            <button
                                type="button"
                                onClick={fetchCurrentPoints}
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                            >
                                🔍 Xem điểm hiện tại
                            </button>
                        </div>
                        {currentPoints && (
                            <div style={{
                                marginTop: '12px',
                                padding: '12px',
                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                borderRadius: '8px',
                                border: '1px solid rgba(96, 165, 250, 0.4)'
                            }}>
                                <p style={{ margin: 0, color: '#60a5fa', fontWeight: 'bold' }}>
                                    Điểm hiện tại: {currentPoints.tong_diem || 0} điểm
                                    {currentPoints.hoc_ky && ` (HK${currentPoints.hoc_ky} - ${currentPoints.nam_hoc})`}
                                </p>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                Học kỳ
                            </label>
                            <select
                                value={formData.hoc_ky}
                                onChange={(e) => setFormData({ ...formData, hoc_ky: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(167, 139, 250, 0.3)',
                                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                    color: 'white',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="1">Học kỳ 1</option>
                                <option value="2">Học kỳ 2</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                Năm học
                            </label>
                            <input
                                type="text"
                                value={formData.nam_hoc}
                                onChange={(e) => setFormData({ ...formData, nam_hoc: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(167, 139, 250, 0.3)',
                                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                    color: 'white',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Hành động
                        </label>
                        <select
                            value={formData.action}
                            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(167, 139, 250, 0.3)',
                                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                color: 'white',
                                fontSize: '14px'
                            }}
                        >
                            <option value="add">Cộng thêm điểm</option>
                            <option value="set">Đặt điểm cụ thể</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            {formData.action === 'add' ? 'Số điểm cộng thêm' : 'Tổng điểm mới'} *
                        </label>
                        <input
                            type="number"
                            value={formData.tong_diem}
                            onChange={(e) => setFormData({ ...formData, tong_diem: e.target.value })}
                            required
                            min="0"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(167, 139, 250, 0.3)',
                                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                color: 'white',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    {success && (
                        <div style={{
                            padding: '12px',
                            backgroundColor: 'rgba(16, 185, 129, 0.3)',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            color: '#6ee7b7',
                            textAlign: 'center'
                        }}>
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: loading ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.8)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? '⏳ Đang cập nhật...' : '💾 Cập nhật điểm'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RewardPointsManagement;

