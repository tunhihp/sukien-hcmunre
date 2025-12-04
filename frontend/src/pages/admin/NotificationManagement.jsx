// frontend/src/pages/admin/NotificationManagement.jsx
// Trang quản lý thông báo
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function NotificationManagement() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        tieu_de: '',
        noi_dung: '',
        id_nguoi_nhan: '',
        loai_thong_bao: 'general',
        id_su_kien: '',
        icon: '🔔'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.tieu_de.trim() || !formData.noi_dung.trim()) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3001/api/notifications/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    id_nguoi_nhan: formData.id_nguoi_nhan ? parseInt(formData.id_nguoi_nhan) : null,
                    id_su_kien: formData.id_su_kien ? parseInt(formData.id_su_kien) : null
                })
            });

            const data = await res.json();

            if (data.success) {
                setSuccess("Tạo thông báo thành công!");
                setFormData({
                    tieu_de: '',
                    noi_dung: '',
                    id_nguoi_nhan: '',
                    loai_thong_bao: 'general',
                    id_su_kien: '',
                    icon: '🔔'
                });
                setTimeout(() => setSuccess(''), 3000);
            } else {
                alert(data.message || "Tạo thông báo thất bại!");
            }

        } catch (err) {
            console.error("Lỗi tạo thông báo:", err);
            alert("Không thể tạo thông báo!");
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
                🔔 Quản lý Thông báo
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
                            Tiêu đề *
                        </label>
                        <input
                            type="text"
                            value={formData.tieu_de}
                            onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })}
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

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Nội dung *
                        </label>
                        <textarea
                            value={formData.noi_dung}
                            onChange={(e) => setFormData({ ...formData, noi_dung: e.target.value })}
                            required
                            rows={5}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(167, 139, 250, 0.3)',
                                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                color: 'white',
                                fontSize: '14px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                ID Người nhận (để trống = tất cả)
                            </label>
                            <input
                                type="number"
                                value={formData.id_nguoi_nhan}
                                onChange={(e) => setFormData({ ...formData, id_nguoi_nhan: e.target.value })}
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

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                ID Sự kiện (tùy chọn)
                            </label>
                            <input
                                type="number"
                                value={formData.id_su_kien}
                                onChange={(e) => setFormData({ ...formData, id_su_kien: e.target.value })}
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                Loại thông báo
                            </label>
                            <select
                                value={formData.loai_thong_bao}
                                onChange={(e) => setFormData({ ...formData, loai_thong_bao: e.target.value })}
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
                                <option value="general">Thông thường</option>
                                <option value="checkin">Check-in</option>
                                <option value="register">Đăng ký</option>
                                <option value="event">Sự kiện</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                Icon
                            </label>
                            <input
                                type="text"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="🔔"
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
                        {loading ? '⏳ Đang tạo...' : '📤 Gửi thông báo'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NotificationManagement;

