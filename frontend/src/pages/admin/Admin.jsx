import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ExportToExcel from "../../components/ExportToExcel";
import ScanQR from "./ScanQR";
import AdminDashboard from "./AdminDashboard";

function Admin() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [eventHistory, setEventHistory] = useState([]);
    const [events, setEvents] = useState([]);

    const [tab, setTab] = useState('account');

    useEffect(() => {

        // ========== LẤY DANH SÁCH NGƯỜI DÙNG ==========
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/admin/users");
                const data = await res.json();

                const mapped = data.map(u => ({
                    name: u.ho_ten,
                    studentId: u.mssv,
                    className: u.lop,
                    major: u.ma_nganh,
                    faculty: u.ma_khoa,
                    email: u.email,
                    phone: u.sdt,
                    role: u.vai_tro?.trim()
                }));

                setUsers(mapped);
            } catch (err) {
                console.error("❌ Lỗi tải danh sách:", err);
            }
        };

        fetchUsers();


        // ========== LẤY DANH SÁCH SỰ KIỆN ==========
        const fetchEvents = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/events");
                const data = await res.json();
                setEvents(data);
            } catch (err) {
                console.error("❌ Lỗi tải sự kiện:", err);
            }
        };

        fetchEvents();


        // ========== LẤY LỊCH SỬ CHECK-IN ==========
        const fetchEventHistory = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/admin/history");
                const data = await res.json();

                const mapped = data.map(e => ({
                    name: e.ho_ten,
                    mssv: e.mssv,
                    class: e.lop,
                    event: e.ten_su_kien,
                    diemRL: e.diem_cong,
                    timestamp: e.thoi_gian_checkin
                }));

                setEventHistory(mapped);
            } catch (err) {
                console.error("❌ Lỗi tải lịch sử:", err);
            }
        };

        fetchEventHistory();

    }, []);

    // ❌ CHỈ XÓA TRÊN GIAO DIỆN (CHƯA XÓA DB)
    const handleDeleteUser = (email) => {
        const filtered = users.filter((u) => u.email !== email);
        setUsers(filtered);
    };

    const handleDeleteEvent = (index) => {
        const updated = [...eventHistory];
        updated.splice(index, 1);
        setEventHistory(updated);
    };

    return (
        <div
            style={{
                padding: '40px',
                background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
                minHeight: '100vh',
                color: '#0f172a',
                fontFamily: "Inter, Segoe UI, sans-serif"
            }}
        >
            {/* Nút quay lại */}
            <button
                onClick={() => navigate("/")}
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    backgroundColor: "#90caf9",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "1px solid #42a5f5",
                    color: "#0f172a",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "0.25s",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#64b5f6"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#90caf9"}
            >
                ⬅️ Quay lại
            </button>

            <h2
                style={{
                    fontSize: "34px",
                    marginBottom: "32px",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#0f172a",
                    padding: "14px 28px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(144,202,249,0.6)",
                    boxShadow: "0 6px 20px rgba(144,202,249,0.25)",
                    display: "inline-block",
                    marginLeft: "50%",
                    transform: "translateX(-50%)",
                    backdropFilter: "blur(6px)"
                }}
            >
                🛠️ Trang quản trị Admin
            </h2>

            {/* TAB BUTTONS */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px',
                gap: '6px'
            }}>
                {[
                    { key: 'account', label: '👤 Quản lý tài khoản' },
                    { key: 'event', label: '📝 Lịch sử sự kiện' },
                    { key: 'events', label: '📅 Quản lý sự kiện' },
                    { key: 'qr', label: '📲 Quét QR' },
                    { key: 'dashboard', label: '📊 Dashboard' }
                ].map(btn => (
                    <button
                        key={btn.key}
                        onClick={() => setTab(btn.key)}
                        style={{
                            padding: "10px 18px",
                            borderRadius: 10,
                            border: "1px solid #90caf9",
                            background: tab === btn.key ? "#bbdefb" : "white",
                            color: "#0f172a",
                            cursor: "pointer",
                            fontWeight: 600,
                            transition: "0.25s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e3f2fd"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = tab === btn.key ? "#bbdefb" : "white"}
                    >
                        {btn.label}
                    </button>
                ))}

                {/* Tin nhắn user */}
                <Link
                    to="/admin/extend"
                    style={{
                        padding: "10px 18px",
                        borderRadius: 10,
                        border: "1px solid #90caf9",
                        background: "white",
                        color: "#0f172a",
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "0.25s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e3f2fd"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
                >
                    💬 Tin nhắn từ User
                </Link>
            </div>


            {/* ========== TAB 1: ACCOUNT ========== */}
            {tab === 'account' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                        <ExportToExcel
                            data={users}
                            fileName="DanhSachTaiKhoan"
                            headers={[
                                { key: 'name', label: 'Họ tên' },
                                { key: 'studentId', label: 'MSSV' },
                                { key: 'className', label: 'Lớp' },
                                { key: 'major', label: 'Ngành' },
                                { key: 'email', label: 'Email' },
                                { key: 'phone', label: 'SĐT' },
                                { key: 'role', label: 'Vai trò' }
                            ]}
                        />
                    </div>

                    <TableAccount users={users} onDelete={handleDeleteUser} />
                </div>
            )}


            {/* ========== TAB 2: EVENT HISTORY ========== */}
            {tab === 'event' && (
                <div>
                    <TableEventHistory eventHistory={eventHistory} onDelete={handleDeleteEvent} />
                </div>
            )}


            {/* ========== TAB 3: LIST EVENTS ========== */}
            {tab === 'events' && (
                <div>
                    <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>📅 Danh sách sự kiện</h3>

                    {events.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#64748b' }}>Không có sự kiện nào.</p>
                    ) : (
                        <table style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            background: "rgba(255,255,255,0.9)",
                            borderRadius: 12,
                            overflow: "hidden",
                            border: "1px solid #90caf9",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
                        }}>
                            <thead style={{ background: "#bbdefb" }}>
                                <tr>
                                    {["STT", "Tên sự kiện", "Địa điểm", "Bắt đầu", "Số lượng", "Trạng thái"].map((h, i) => (
                                        <th key={i} style={{
                                            padding: "12px 16px",
                                            textAlign: "left",
                                            color: "#0f172a",
                                            borderBottom: "1px solid #90caf9"
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {events.map((evt, i) => (
                                    <tr
                                        key={i}
                                        style={{
                                            borderBottom: "1px solid #e0e7ff",
                                            transition: "0.25s"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = "#e8f4ff"}
                                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                        <td style={td}>{i + 1}</td>
                                        <td style={td}>{evt.title}</td>
                                        <td style={td}>{evt.location}</td>
                                        <td style={td}>{evt.date || evt.ngay_bat_dau}</td>
                                        <td style={td}>{evt.attendees}/{evt.capacity}</td>

                                        <td style={td}>
                                            {evt.attendees >= evt.capacity
                                                ? <span style={{ color: "#ef4444" }}>Đã đủ</span>
                                                : <span style={{ color: "#22c55e" }}>Còn chỗ</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}


            {/* ========== TAB 4: SCAN QR ========== */}
            {tab === 'qr' && (
                <div>
                    <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>📲 Quét mã QR điểm danh</h3>

                    <div style={{
                        background: "rgba(255,255,255,0.85)",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid #90caf9",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.15)"
                    }}>
                        <ScanQR />
                    </div>
                </div>
            )}

            {/* ========== TAB 5: DASHBOARD ========== */}
            {tab === 'dashboard' && (
                <AdminDashboard events={events} />
            )}

        </div>
    );
}

// ========== STYLE ==========
const btn = {
    padding: '10px 20px',
    backgroundColor: '#e3f2fd',    // xanh pastel nhạt
    color: '#0f172a',              // chữ đen đậm
    border: '1px solid #90caf9',   // viền xanh sáng
    cursor: 'pointer',
    borderRadius: '8px',
    fontWeight: 600,
    transition: '0.25s ease',
};

const btnActive = {
    ...btn,
    backgroundColor: '#bbdefb',    // xanh highlight
    border: '1px solid #42a5f5',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(66,165,245,0.35)',
};

const table = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'rgba(255,255,255,0.8)',  // nền bảng trắng trong suốt
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #90caf9',
    boxShadow: '0 6px 20px rgba(144,202,249,0.25)',
};

const thead = {
    backgroundColor: '#bbdefb',   // xanh nhạt đồng bộ
};

const th = {
    padding: '14px 18px',
    textAlign: 'left',
    color: '#0f172a',             // chữ đen
    fontWeight: 700,
    borderBottom: '1px solid #90caf9'
};

const tr = {
    borderBottom: '1px solid #e0e7ff',
    transition: '0.25s',
};

const td = {
    padding: '12px 18px',
    color: '#1e293b',             // chữ xanh đậm
    fontWeight: 500
};

// ========== COMPONENTS ==========
function TableAccount({ users, onDelete }) {
    return (
        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "rgba(255,255,255,0.85)",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #90caf9",
                boxShadow: "0 6px 20px rgba(144,202,249,0.25)",
                fontFamily: "Inter, Segoe UI, sans-serif",
                color: "#0f172a"
            }}
        >
            <thead style={{ backgroundColor: "#bbdefb" }}>
                <tr>
                    {['STT', 'Họ tên', 'MSSV', 'Lớp', 'Ngành', 'Email', 'SĐT', 'Vai trò', 'Xóa'].map((header, i) => (
                        <th
                            key={i}
                            style={{
                                padding: "14px 18px",
                                textAlign: "left",
                                color: "#0f172a",
                                fontWeight: 700,
                                borderBottom: "1px solid #90caf9"
                            }}
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {users.map((u, i) => (
                    <tr
                        key={i}
                        style={{
                            borderBottom: "1px solid #e0e7ff",
                            transition: "0.25s"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#e8f4ff"; // xanh hover rất nhẹ
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <td style={{ padding: "12px 18px", color: "#1e293b", fontWeight: 500 }}>{i + 1}</td>
                        <td style={cell}>{u.name}</td>
                        <td style={cell}>{u.studentId}</td>
                        <td style={cell}>{u.className}</td>
                        <td style={cell}>{u.major}</td>
                        <td style={cell}>{u.email}</td>
                        <td style={cell}>{u.phone}</td>
                        <td style={cell}>{u.role}</td>

                        <td style={cell}>
                            <button
                                onClick={() => onDelete(u.email)}
                                style={{
                                    backgroundColor: "#ef4444",
                                    color: "#fff",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #dc2626",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "0.25s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#dc2626";
                                    e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#ef4444";
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                ❌
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const cell = {
    padding: "12px 18px",
    color: "#1e293b",
    fontWeight: 500
};

function TableEventHistory({ eventHistory, onDelete }) {
    return (
        <table
            style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                background: "rgba(255,255,255,0.65)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
            }}
        >
            <thead>
                <tr style={{ background: "#bbdefb" }}>
                    {['STT', 'Họ tên', 'MSSV', 'Lớp', 'Sự kiện', 'Điểm RL', 'Thời gian', 'Xóa'].map((header, i) => (
                        <th
                            key={i}
                            style={{
                                padding: "12px 16px",
                                textAlign: "left",
                                color: "#0f172a",
                                fontWeight: 600,
                                borderBottom: "2px solid #90caf9",
                                fontSize: 14
                            }}
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {eventHistory.map((e, i) => (
                    <tr
                        key={i}
                        style={{
                            transition: "0.25s",
                            borderBottom: "1px solid #e0e7ff"
                        }}
                        onMouseEnter={(row) => row.currentTarget.style.background = "#f0f9ff"}
                        onMouseLeave={(row) => row.currentTarget.style.background = "transparent"}
                    >
                        <td style={cellStyle}>{i + 1}</td>
                        <td style={cellStyle}>{e.name}</td>
                        <td style={cellStyle}>{e.mssv}</td>
                        <td style={cellStyle}>{e.class}</td>
                        <td style={cellStyle}>{e.event}</td>
                        <td style={cellStyle}>{e.diemRL}</td>
                        <td style={cellStyle}>{new Date(e.timestamp).toLocaleString()}</td>

                        <td style={cellStyle}>
                            <button
                                onClick={() => onDelete(i)}
                                style={{
                                    backgroundColor: "#ef4444",
                                    color: "#fff",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "0.2s"
                                }}
                                onMouseEnter={(btn) => btn.currentTarget.style.opacity = 0.85}
                                onMouseLeave={(btn) => btn.currentTarget.style.opacity = 1}
                            >
                                ❌
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const cellStyle = {
    padding: "12px 16px",
    color: "#0f172a",
    fontSize: 14,
    borderBottom: "1px solid #e2e8f0"
};

export default Admin;