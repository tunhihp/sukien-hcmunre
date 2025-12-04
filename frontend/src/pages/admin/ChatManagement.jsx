// frontend/src/pages/admin/ChatManagement.jsx
// Trang quản lý chat với students
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ChatManagement() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.vai_tro !== 'admin') {
            navigate('/admin');
            return;
        }

        fetchConversations();
    }, [user]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3001/api/chat/admin/conversations", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (data.success) {
                setConversations(data.conversations || []);
            }

        } catch (err) {
            console.error("Lỗi tải cuộc hội thoại:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:3001/api/chat/admin/conversation/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (data.success) {
                setSelectedUser(data.user);
                setMessages(data.messages || []);
            }

        } catch (err) {
            console.error("Lỗi tải tin nhắn:", err);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3001/api/chat/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: newMessage.trim(),
                    user_id: selectedUser.ma_nguoi_dung
                })
            });

            const data = await res.json();
            if (data.success) {
                setNewMessage('');
                fetchMessages(selectedUser.ma_nguoi_dung);
            } else {
                alert(data.message || "Gửi tin nhắn thất bại!");
            }

        } catch (err) {
            console.error("Lỗi gửi tin nhắn:", err);
            alert("Không thể gửi tin nhắn!");
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1e1b4b, #2e1065, #312e81)',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                    <p>Đang tải...</p>
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
            <button
                onClick={() => navigate(-1)}
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
                ⬅ Quay lại
            </button>

            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>
                💬 Quản lý Chat
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '300px 1fr',
                gap: '20px',
                maxWidth: '1400px',
                margin: '0 auto',
                height: 'calc(100vh - 200px)'
            }}>
                {/* Danh sách cuộc hội thoại */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(167,139,250,0.3)',
                    overflowY: 'auto'
                }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Cuộc hội thoại</h3>
                    {conversations.length === 0 ? (
                        <p style={{ color: '#94a3b8', textAlign: 'center' }}>Chưa có cuộc hội thoại nào</p>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.user_id}
                                onClick={() => fetchMessages(conv.user_id)}
                                style={{
                                    padding: '12px',
                                    marginBottom: '8px',
                                    borderRadius: '8px',
                                    backgroundColor: selectedUser?.ma_nguoi_dung === conv.user_id
                                        ? 'rgba(139, 92, 246, 0.3)'
                                        : 'rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    border: selectedUser?.ma_nguoi_dung === conv.user_id
                                        ? '1px solid rgba(167, 139, 250, 0.6)'
                                        : '1px solid transparent'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                    {conv.ho_ten || 'N/A'}
                                </div>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                    {conv.so_tin_nhan} tin nhắn
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Chat window */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(167,139,250,0.3)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {selectedUser ? (
                        <>
                            <div style={{
                                paddingBottom: '16px',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                marginBottom: '16px'
                            }}>
                                <h3 style={{ marginBottom: '8px' }}>{selectedUser.ho_ten}</h3>
                                <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                                    {selectedUser.email} {selectedUser.mssv && `• ${selectedUser.mssv}`}
                                </div>
                            </div>

                            <div style={{
                                flex: '1',
                                overflowY: 'auto',
                                marginBottom: '16px',
                                padding: '16px',
                                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                                borderRadius: '12px'
                            }}>
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        style={{
                                            marginBottom: '12px',
                                            textAlign: msg.sender === 'admin' ? 'right' : 'left'
                                        }}
                                    >
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '10px 16px',
                                            borderRadius: '12px',
                                            backgroundColor: msg.sender === 'admin'
                                                ? 'rgba(139, 92, 246, 0.4)'
                                                : 'rgba(255,255,255,0.1)',
                                            maxWidth: '70%'
                                        }}>
                                            <div style={{ marginBottom: '4px' }}>{msg.message}</div>
                                            <div style={{
                                                fontSize: '11px',
                                                color: '#94a3b8',
                                                opacity: 0.7
                                            }}>
                                                {new Date(msg.created_at).toLocaleString('vi-VN')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Nhập tin nhắn..."
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
                                    onClick={sendMessage}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: 'rgba(139, 92, 246, 0.8)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Gửi
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            color: '#94a3b8'
                        }}>
                            Chọn một cuộc hội thoại để bắt đầu chat
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatManagement;

