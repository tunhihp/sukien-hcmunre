// frontend/src/pages/admin/CheckinHistory.jsx
// Trang lịch sử check-in chi tiết (tất cả sự kiện)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ExportToExcel from '../../components/ExportToExcel';

function CheckinHistory() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month'
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user || user.vai_tro !== 'admin') {
            navigate('/admin');
            return;
        }

        fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3001/api/admin/history", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Lỗi tải lịch sử!");
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

    // Lọc dữ liệu
    const filteredHistory = history.filter(item => {
        // Lọc theo thời gian
        if (filter !== 'all') {
            const itemDate = new Date(item.thoi_gian_checkin || item.timestamp);
            const now = new Date();
            switch (filter) {
                case 'today':
                    return itemDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return itemDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return itemDate >= monthAgo;
                default:
                    return true;
            }
        }

        // Tìm kiếm
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
                        fontSize: '14px',
                        marginBottom: '20px'
                    }}
                >
                    ⬅ Quay lại Admin
                </button>

                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
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
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none'
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
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    backgroundColor: filter === f
                                        ? 'rgba(139, 92, 246, 0.8)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    border: `1px solid ${
                                        filter === f 
                                        ? 'rgba(167, 139, 250, 0.6)' 
                                        : 'rgba(255, 255, 255, 0.2)'
                                    }`
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

            {/* Export button */}
            {filteredHistory.length > 0 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '20px',
                    maxWidth: '1200px',
                    margin: '0 auto 20px'
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
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(167,139,250,0.3)'
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
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(139, 92, 246, 0.3)' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>STT</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Họ tên</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>MSSV</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Sự kiện</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Thời gian check-in</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Điểm RL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <td style={{ padding: '12px' }}>{index + 1}</td>
                                    <td style={{ padding: '12px' }}>{item.ho_ten || item.name || 'N/A'}</td>
                                    <td style={{ padding: '12px' }}>{item.mssv || 'N/A'}</td>
                                    <td style={{ padding: '12px' }}>{item.event || item.ten_su_kien || 'N/A'}</td>
                                    <td style={{ padding: '12px' }}>
                                        {item.thoi_gian_checkin || item.timestamp
                                            ? new Date(item.thoi_gian_checkin || item.timestamp).toLocaleString('vi-VN')
                                            : 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px', color: '#60a5fa', fontWeight: 'bold' }}>
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

