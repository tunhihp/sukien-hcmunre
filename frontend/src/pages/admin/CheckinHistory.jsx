// frontend/src/pages/admin/CheckinHistory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ExportToExcel from '../../components/ExportToExcel';

function CheckinHistory() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user || user.vai_tro !== 'admin') {
            navigate('/admin');
            return;
        }

        fetchHistory();
    }, [user]);

    // ==========================
    // FIXED FETCH (100% chạy)
    // ==========================
    const fetchHistory = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            const API_URL = import.meta.env.VITE_API_URL;

            const res = await fetch(`${API_URL}/api/admin/history`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Không thể tải lịch sử");
            }

            const data = await res.json();
            setHistory(data || []);

        } catch (err) {
            console.error("Lỗi tải lịch sử:", err);
            alert("Không thể tải lịch sử!");
        } finally {
            setLoading(false);
        }
    };

    // ==========================
    // BỘ LỌC DỮ LIỆU
    // ==========================
    const filteredHistory = history.filter(item => {
        const itemDate = new Date(item.thoi_gian_checkin || item.timestamp);
        const now = new Date();

        // Lọc thời gian
        if (filter === 'today') {
            if (itemDate.toDateString() !== now.toDateString()) return false;
        }

        if (filter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (itemDate < weekAgo) return false;
        }

        if (filter === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (itemDate < monthAgo) return false;
        }

        // Lọc theo từ khoá tìm kiếm
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            return (
                item.ho_ten?.toLowerCase().includes(term) ||
                item.name?.toLowerCase().includes(term) ||
                item.mssv?.toLowerCase().includes(term) ||
                item.event?.toLowerCase().includes(term) ||
                item.ten_su_kien?.toLowerCase().includes(term)
            );
        }

        return true;
    });

    // ==========================
    // LOADING UI
    // ==========================
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1e1b4b, #2e1065, #312e81)',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                    <p>Đang tải lịch sử...</p>
                </div>
            </div>
        );
    }

    // ==========================
    // UI CHÍNH
    // ==========================
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1e1b4b, #2e1065, #312e81)',
            color: 'white',
            padding: '30px 20px'
        }}>

            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
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

                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    📊 Lịch sử Check-in
                </h1>

                <p style={{
                    textAlign: 'center',
                    color: '#cbd5e1',
                    fontSize: '16px'
                }}>
                    Tổng số: {filteredHistory.length} lượt check-in
                </p>
            </div>

            {/* Filters */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto 30px',
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm theo tên, MSSV, sự kiện..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: '1',
                        minWidth: '250px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(167, 139, 250, 0.3)',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        color: 'white'
                    }}
                />

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['all', 'today', 'week', 'month'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '12px 20px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                backgroundColor:
                                    filter === f ? 'rgba(139,92,246,0.8)' :
                                        'rgba(255,255,255,0.1)',
                                border:
                                    `1px solid ${
                                        filter === f ? 'rgba(167,139,250,0.6)' :
                                            'rgba(255,255,255,0.2)'
                                    }`,
                                color: 'white'
                            }}
                        >
                            {f === 'all' && '📋 Tất cả'}
                            {f === 'today' && '📅 Hôm nay'}
                            {f === 'week' && '📆 Tuần này'}
                            {f === 'month' && '🗓️ Tháng này'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Export */}
            {filteredHistory.length > 0 && (
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto 20px',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <ExportToExcel
                        data={filteredHistory}
                        fileName="LichSuCheckin"
                        headers={[
                            { key: 'ho_ten', label: 'Họ tên' },
                            { key: 'mssv', label: 'MSSV' },
                            { key: 'event', label: 'Sự kiện' },
                            { key: 'thoi_gian_checkin', label: 'Thời gian check-in' },
                            { key: 'diemRL', label: 'Điểm RL' }
                        ]}
                    />
                </div>
            )}

            {/* Table */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: 'rgba(255,255,255,0.08)',
                padding: '24px',
                borderRadius: '16px'
            }}>
                {filteredHistory.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
                        <p>Không có dữ liệu check-in.</p>
                    </div>
                ) : (
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: 'rgba(15,23,42,0.6)'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(139,92,246,0.3)' }}>
                                <th>STT</th>
                                <th>Họ tên</th>
                                <th>MSSV</th>
                                <th>Sự kiện</th>
                                <th>Thời gian</th>
                                <th>Điểm RL</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredHistory.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.ho_ten || item.name || 'N/A'}</td>
                                    <td>{item.mssv || 'N/A'}</td>
                                    <td>{item.event || item.ten_su_kien || 'N/A'}</td>
                                    <td>
                                        {new Date(item.thoi_gian_checkin || item.timestamp)
                                            .toLocaleString('vi-VN')}
                                    </td>
                                    <td style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                                        ⭐ {item.diemRL || item.diem_cong || 0} điểm
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}

export default CheckinHistory;
