// frontend/src/pages/admin/EventRegistrations.jsx
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
    const [activeTab, setActiveTab] = useState('registrations');

    useEffect(() => {
        if (!user || user.vai_tro !== 'admin') {
            navigate('/admin');
            return;
        }

        fetchData();
    }, [id, user]);

    // ==========================
    // FETCH DATA (Fixed Version)
    // ==========================
    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const API_URL = import.meta.env.VITE_API_URL;

            // Lấy danh sách đăng ký
            const regRes = await fetch(`${API_URL}/api/events/${id}/registrations`, {
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
            const checkinRes = await fetch(`${API_URL}/api/events/${id}/checkins`, {
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

    const exportHeaders = activeTab === 'registrations'
        ? [
            { key: 'ho_ten', label: 'Họ tên' },
            { key: 'mssv', label: 'MSSV' },
            { key: 'email', label: 'Email' },
            { key: 'lop', label: 'Lớp' },
            { key: 'ngay_dang_ky', label: 'Ngày đăng ký' },
            { key: 'check_in', label: 'Trạng thái' }
        ]
        : [
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

            {/* HEADER */}
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

            {/* TABS */}
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
                        cursor: 'pointer',
                        fontSize: '14px',
                        backgroundColor:
                            activeTab === 'registrations'
                                ? 'rgba(139,92,246,0.8)'
                                : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border:
                            `1px solid ${
                                activeTab === 'registrations'
                                    ? 'rgba(167, 139, 250, 0.6)'
                                    : 'rgba(255,255,255,0.2)'
                            }`
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
                        backgroundColor:
                            activeTab === 'checkins'
                                ? 'rgba(139,92,246,0.8)'
                                : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border:
                            `1px solid ${
                                activeTab === 'checkins'
                                    ? 'rgba(167, 139, 250, 0.6)'
                                    : 'rgba(255,255,255,0.2)'
                            }`
                    }}
                >
                    ✅ Check-in ({checkins.length})
                </button>
            </div>

            {/* EXPORT BUTTON */}
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

            {/* TABLE */}
            {/* (PHẦN TABLE CỦA BẠN ĐÚNG, KHÔNG CẦN SỬA) */}
        </div>
    );
}

export default EventRegistrations;
