// frontend/src/pages/admin/EventRegistrations.jsx
// Trang quản lý danh sách đăng ký sự kiện
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ExportToExcel from '../../components/ExportToExcel';

function EventRegistrations() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [eventInfo, setEventInfo] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [checkins, setCheckins] = useState([]);
    const [activeTab, setActiveTab] = useState('registrations'); // 'registrations' or 'checkins'

    useEffect(() => {
        if (!user || user.vai_tro !== 'admin') {
            navigate('/admin');
            return;
        }

        fetchData();
    }, [id, user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            // Lấy danh sách đăng ký
            const regRes = await fetch(`http://localhost:3001/api/events/${id}/registrations`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const regData = await regRes.json();
            if (regData.success) {
                setEventInfo({ title: regData.event_title, id: regData.event_id });
                setRegistrations(regData.registrations || []);
            }

            // Lấy danh sách check-in
            const checkinRes = await fetch(`http://localhost:3001/api/events/${id}/checkins`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const checkinData = await checkinRes.json();
            if (checkinData.success) {
                setCheckins(checkinData.checkins || []);
            }

        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            alert("Không thể tải dữ liệu!");
        } finally {
            setLoading(false);
        }
    };

    const exportData = activeTab === 'registrations' ? registrations : checkins;
    const exportHeaders = activeTab === 'registrations' ? [
        { key: 'ho_ten', label: 'Họ tên' },
        { key: 'mssv', label: 'MSSV' },
        { key: 'email', label: 'Email' },
        { key: 'lop', label: 'Lớp' },
        { key: 'ngay_dang_ky', label: 'Ngày đăng ký' },
        { key: 'check_in', label: 'Trạng thái' }
    ] : [
        { key: 'ho_ten', label: 'Họ tên' },
        { key: 'mssv', label: 'MSSV' },
        { key: 'email', label: 'Email' },
        { key: 'thoi_gian_checkin', label: 'Thời gian check-in' },
        { key: 'diem_cong', label: 'Điểm cộng' }
    ];

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
                    <p>Đang tải dữ liệu...</p>
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
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <span>⬅</span> Quay lại Admin
                </button>

                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    textAlign: 'center'
                }}>
                    📋 Quản lý Đăng ký Sự kiện
                </h1>
                {eventInfo && (
                    <p style={{
                        textAlign: 'center',
                        color: '#cbd5e1',
                        fontSize: '16px',
                        marginBottom: '20px'
                    }}>
                        {eventInfo.title}
                    </p>
                )}
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '30px'
            }}>
                <button
                    onClick={() => setActiveTab('registrations')}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        backgroundColor: activeTab === 'registrations' 
                            ? 'rgba(139, 92, 246, 0.8)' 
                            : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: `1px solid ${activeTab === 'registrations' ? 'rgba(167, 139, 250, 0.6)' : 'rgba(255, 255, 255, 0.2)'}`
                    }}
                >
                    📝 Đăng ký ({registrations.length})
                </button>
                <button
                    onClick={() => setActiveTab('checkins')}
                    style={{
                                padding: '12px 24px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                backgroundColor: activeTab === 'registrations'
                                    ? 'rgba(139, 92, 246, 0.8)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: `1px solid ${
                                    activeTab === 'registrations'
                                    ? 'rgba(167, 139, 250, 0.6)'
                                    : 'rgba(255, 255, 255, 0.2)'
                                }`
                            }}
                >
                    ✅ Check-in ({checkins.length})
                </button>
            </div>

            {/* Export button */}
            {exportData.length > 0 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '20px',
                    maxWidth: '1200px',
                    margin: '0 auto 20px'
                }}>
                    <ExportToExcel
                        data={exportData}
                        fileName={`${activeTab === 'registrations' ? 'DanhSachDangKy' : 'DanhSachCheckin'}_Event${id}`}
                        headers={exportHeaders}
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
                {activeTab === 'registrations' ? (
                    registrations.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
                            <p>Chưa có người đăng ký nào.</p>
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
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Lớp</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Ngày đăng ký</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((reg, index) => (
                                    <tr key={reg.ma_dang_ky} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <td style={{ padding: '12px' }}>{index + 1}</td>
                                        <td style={{ padding: '12px' }}>{reg.ho_ten || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>{reg.mssv || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>{reg.email || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>{reg.lop || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>
                                            {reg.ngay_dang_ky ? new Date(reg.ngay_dang_ky).toLocaleString('vi-VN') : 'N/A'}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                backgroundColor: reg.check_in 
                                                    ? 'rgba(16, 185, 129, 0.3)' 
                                                    : 'rgba(251, 191, 36, 0.3)',
                                                color: reg.check_in ? '#6ee7b7' : '#fcd34d',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {reg.check_in ? '✅ Đã check-in' : '⏳ Chưa check-in'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : (
                    checkins.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
                            <p>Chưa có ai check-in.</p>
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
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Thời gian check-in</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Điểm cộng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checkins.map((checkin, index) => (
                                    <tr key={checkin.ma_dang_ky} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <td style={{ padding: '12px' }}>{index + 1}</td>
                                        <td style={{ padding: '12px' }}>{checkin.ho_ten || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>{checkin.mssv || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>{checkin.email || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>
                                            {checkin.thoi_gian_checkin 
                                                ? new Date(checkin.thoi_gian_checkin).toLocaleString('vi-VN') 
                                                : 'N/A'}
                                        </td>
                                        <td style={{ padding: '12px', color: '#60a5fa', fontWeight: 'bold' }}>
                                            ⭐ {checkin.diem_cong || 0} điểm
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                )}
            </div>
        </div>
    );
}

export default EventRegistrations;

