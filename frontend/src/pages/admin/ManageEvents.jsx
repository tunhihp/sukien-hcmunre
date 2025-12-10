// src/pages/admin/ManageEvents.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExportToExcel from "../../components/ExportToExcel";
import axios from "axios";

function ManageEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        date: "",
        type: "academic",
        capacity: 50,
        image: "",
        points: 5
    });

    /* =========================
       LẤY TOKEN TỪ LOCALSTORAGE
    ========================== */
    const getToken = () => localStorage.getItem("token");

    /* =========================
       FETCH EVENTS TỪ BACKEND
    ========================== */
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const res = await axios.get("http://localhost:3001/api/events", { headers });
            setEvents(res.data || []);
        } catch (err) {
            console.error("Lỗi tải sự kiện:", err);
            alert("Không thể tải danh sách sự kiện!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    /* =========================
       MỞ FORM THÊM MỚI
    ========================== */
    const handleAdd = () => {
        setEditingEvent(null);
        setFormData({
            title: "",
            description: "",
            location: "",
            date: "",
            type: "academic",
            capacity: 50,
            image: "",
            points: 5
        });
        setShowForm(true);
    };

    /* =========================
       MỞ FORM SỬA
    ========================== */
    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title || "",
            description: event.description || "",
            location: event.location || "",
            date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
            type: event.type || "academic",
            capacity: event.capacity || 50,
            image: event.image || "",
            points: event.points || 5
        });
        setShowForm(true);
    };

    /* =========================
       XÓA SỰ KIỆN
    ========================== */
    const handleDelete = async (eventId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) return;

        try {
            const token = getToken();
            if (!token) return alert("Bạn cần đăng nhập lại!");

            const headers = { Authorization: `Bearer ${token}` };

            const res = await axios.delete(`http://localhost:3001/api/events/${eventId}`, { headers });

            if (res.data.success) {
                alert("Đã xóa thành công!");
                fetchEvents();
            }
        } catch (err) {
            console.error("Lỗi xóa:", err);
            alert(err.response?.data?.message || "Lỗi xóa sự kiện!");
        }
    };

    /* =========================
       LƯU SỰ KIỆN (THÊM / SỬA)
    ========================== */
    const handleSave = async () => {
        if (!formData.title.trim()) return alert("Tên sự kiện không được để trống!");

        try {
            const token = getToken();
            if (!token) return alert("Bạn cần đăng nhập lại!");

            const headers = { Authorization: `Bearer ${token}` };

            // Không xử lý path ảnh!
            // Backend & Events.jsx sẽ tự lo parse đúng hình ảnh.
            const payload = { ...formData };

            let res;
            if (editingEvent) {
                res = await axios.put(
                    `http://localhost:3001/api/events/${editingEvent.id || editingEvent.ma_su_kien}`,
                    payload,
                    { headers }
                );
            } else {
                res = await axios.post(
                    "http://localhost:3001/api/events",
                    payload,
                    { headers }
                );
            }

            if (res.data.success) {
                alert(editingEvent ? "Cập nhật thành công!" : "Tạo mới thành công!");
                setShowForm(false);
                fetchEvents();
            }
        } catch (err) {
            console.error("Lỗi lưu:", err);
            alert(err.response?.data?.message || "Lỗi lưu sự kiện!");
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString("vi-VN") : "";

    /* =========================
       RENDER UI
    ========================== */

    return (
        <div
            style={{
                padding: 32,
                minHeight: "100vh",
                background: "linear-gradient(to bottom, #e0f2fe, #bfdbfe, #93c5fd)",
                color: "#1e293b",
                fontFamily: "Inter, sans-serif"
            }}
        >
            <h1
                style={{
                    fontSize: 30,
                    fontWeight: "700",
                    marginBottom: 20,
                    color: "#1e3a8a",
                    fontFamily: "Inter, sans-serif",
                    textShadow: "0 2px 10px rgba(30,58,138,0.25)"
                }}
            >
                📅 Quản lý sự kiện
            </h1>

            {/* Nút điều hướng */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    flexWrap: "wrap",
                    gap: 12
                }}
            >
                <button
                    onClick={() => navigate("/events")}
                    style={{
                        padding: "12px 20px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg,#93c5fd,#60a5fa)",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontFamily: "Inter, sans-serif",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.5)",
                        transition: ".25s",
                    }}
                >
                    ⬅ Trở lại trang Events
                </button>

                <button
                    onClick={handleAdd}
                    style={{
                        padding: "12px 20px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg,#34d399,#10b981)",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontFamily: "Inter, sans-serif",
                        boxShadow: "0 4px 12px rgba(16,185,129,0.4)",
                        transition: ".25s",
                    }}
                >
                    ➕ Thêm sự kiện
                </button>

                <ExportToExcel
                    data={events}
                    fileName="DanhSachSuKien"
                    headers={[
                        { key: "title", label: "Tên sự kiện" },
                        { key: "location", label: "Địa điểm" },
                        { key: "date", label: "Thời gian" },
                        { key: "capacity", label: "Số lượng" },
                        { key: "attendees", label: "Đã đăng ký" }
                    ]}
                    buttonStyle={{
                        padding: "12px 20px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontFamily: "Inter, sans-serif",
                        boxShadow: "0 4px 12px rgba(99,102,241,0.45)",
                        transition: ".25s",
                    }}
                />
            </div>

            {/* Bảng danh sách */}
            <div style={{ overflowX: "auto", marginTop: 20 }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "rgba(255,255,255,0.65)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 8px 25px rgba(30,58,138,0.25)"
                    }}
                >
                    <thead>
                        <tr style={{ background: "linear-gradient(135deg,#1e3a8a,#3b82f6)" }}>
                            {[
                                "STT",
                                "Tên sự kiện",
                                "Địa điểm",
                                "Thời gian",
                                "Số lượng",
                                "Trạng thái",
                                "Thao tác"
                            ].map((h, i) => (
                                <th
                                    key={i}
                                    style={{
                                        padding: 14,
                                        color: "white",
                                        textAlign: "left",
                                        fontWeight: 600,
                                        fontSize: 14,
                                        letterSpacing: 0.3,
                                        fontFamily: "Inter, sans-serif"
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {!loading &&
                            events.map((evt, i) => {
                                const id = evt.id || evt.ma_su_kien;

                                return (
                                    <tr
                                        key={id}
                                        style={{
                                            transition: ".2s",
                                            borderBottom: "1px solid rgba(148,163,184,0.3)",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(219,234,254,0.55)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <td style={td}>{i + 1}</td>
                                        <td style={td}>{evt.title}</td>
                                        <td style={td}>{evt.location || "-"}</td>
                                        <td style={td}>{formatDate(evt.date)}</td>
                                        <td style={td}>{evt.attendees || 0}/{evt.capacity || 0}</td>

                                        <td style={td}>
                                            <span
                                                style={{
                                                    padding: "4px 10px",
                                                    borderRadius: "8px",
                                                    fontWeight: 600,
                                                    color: evt.attendees >= evt.capacity ? "#ef4444" : "#059669",
                                                    background:
                                                        evt.attendees >= evt.capacity
                                                            ? "rgba(239,68,68,0.15)"
                                                            : "rgba(16,185,129,0.15)"
                                                }}
                                            >
                                                {evt.attendees >= evt.capacity ? "Đã đủ" : "Còn chỗ"}
                                            </span>
                                        </td>

                                        <td style={td}>
                                            <div style={{ display: "flex", gap: 10 }}>
                                                <button
                                                    onClick={() => handleEdit(evt)}
                                                    style={{
                                                        padding: "8px 12px",
                                                        borderRadius: "10px",
                                                        background: "linear-gradient(135deg,#60a5fa,#3b82f6)",
                                                        color: "white",
                                                        fontWeight: 600,
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontFamily: "Inter, sans-serif",
                                                        boxShadow: "0 4px 10px rgba(59,130,246,0.35)",
                                                    }}
                                                >
                                                    ✏️ Sửa
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(id)}
                                                    style={{
                                                        padding: "8px 12px",
                                                        borderRadius: "10px",
                                                        background: "linear-gradient(135deg,#f87171,#ef4444)",
                                                        color: "white",
                                                        fontWeight: 600,
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontFamily: "Inter, sans-serif",
                                                        boxShadow: "0 4px 10px rgba(239,68,68,0.3)",
                                                    }}
                                                >
                                                    🗑 Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        }

                        {!loading && events.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    style={{
                                        padding: 20,
                                        textAlign: "center",
                                        color: "#6b7280",
                                        fontFamily: "Inter, sans-serif"
                                    }}
                                >
                                    Không có sự kiện nào.
                                </td>
                            </tr>
                        )}

                        {loading && (
                            <tr>
                                <td
                                    colSpan={7}
                                    style={{
                                        padding: 20,
                                        textAlign: "center",
                                        color: "#6b7280",
                                        fontFamily: "Inter, sans-serif"
                                    }}
                                >
                                    Đang tải...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Form thêm/sửa */}
            {showForm && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: 520,
                            background: "rgba(255,255,255,0.75)",
                            backdropFilter: "blur(20px)",
                            borderRadius: 22,
                            padding: 28,
                            boxShadow: "0 10px 35px rgba(30,58,138,0.35)",
                            border: "1px solid rgba(148,163,184,0.4)",
                            animation: "fadeUp .25s ease"
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 26,
                                fontWeight: 700,
                                marginBottom: 20,
                                color: "#1e3a8a",
                                textAlign: "center",
                                fontFamily: "Inter, sans-serif",
                                textShadow: "0 1px 8px rgba(30,58,138,0.15)"
                            }}
                        >
                            {editingEvent ? "✏️ Sửa sự kiện" : "➕ Tạo sự kiện"}
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                            {/* Tên */}
                            <Input
                                label="Tên sự kiện *"
                                value={formData.title}
                                onChange={(v) => setFormData({ ...formData, title: v })}
                            />

                            {/* Mô tả */}
                            <Textarea
                                label="Mô tả"
                                value={formData.description}
                                onChange={(v) => setFormData({ ...formData, description: v })}
                            />

                            {/* Địa điểm */}
                            <Input
                                label="Địa điểm"
                                value={formData.location}
                                onChange={(v) => setFormData({ ...formData, location: v })}
                            />

                            {/* Thời gian */}
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: 6,
                                        fontWeight: 600,
                                        fontFamily: "Inter, sans-serif",
                                        color: "#334155"
                                    }}
                                >
                                    Thời gian
                                </label>

                                <input
                                    type="datetime-local"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, date: e.target.value })
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: 12,
                                        border: "1px solid rgba(148,163,184,0.6)",
                                        fontSize: 15,
                                        fontFamily: "Inter, sans-serif",
                                        background: "rgba(255,255,255,0.8)",
                                    }}
                                />
                            </div>

                            {/* Loại */}
                            <Select
                                label="Loại sự kiện"
                                value={formData.type}
                                options={[
                                    ["academic", "Học thuật"],
                                    ["sports", "Thể thao"],
                                    ["community", "Cộng đồng"],
                                    ["cultural", "Văn hóa"],
                                    ["environment", "Môi trường"],
                                    ["workshop", "Hoạt động truyền thông"]
                                ]}
                                onChange={(v) => setFormData({ ...formData, type: v })}
                            />

                            {/* Số lượng */}
                            <Select
                                label="Số lượng tối đa"
                                value={formData.capacity}
                                options={[
                                    [10, "10 người"],
                                    [50, "50 người"],
                                    [100, "100 người"],
                                    [150, "150 người"],
                                    [200, "200 người"]
                                ]}
                                onChange={(v) =>
                                    setFormData({ ...formData, capacity: parseInt(v) })
                                }
                            />

                            {/* Điểm */}
                            <Input
                                type="number"
                                label="Điểm rèn luyện"
                                value={formData.points}
                                onChange={(v) =>
                                    setFormData({
                                        ...formData,
                                        points: parseInt(v) || 0
                                    })
                                }
                            />

                            {/* Ảnh */}
                            <Input
                                label="Đường dẫn hình ảnh"
                                placeholder="/uploads/event.jpg hoặc URL"
                                value={formData.image}
                                onChange={(v) => setFormData({ ...formData, image: v })}
                            />
                        </div>

                        {/* BUTTONS */}
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                            <button
                                onClick={() => setShowForm(false)}
                                style={{
                                    padding: "12px 20px",
                                    borderRadius: 12,
                                    background: "rgba(148,163,184,0.25)",
                                    color: "#475569",
                                    fontWeight: 600,
                                    border: "none",
                                    cursor: "pointer",
                                    fontFamily: "Inter, sans-serif"
                                }}
                            >
                                Hủy
                            </button>

                            <button
                                onClick={handleSave}
                                style={{
                                    padding: "12px 20px",
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                                    color: "white",
                                    fontWeight: 700,
                                    border: "none",
                                    cursor: "pointer",
                                    fontFamily: "Inter, sans-serif",
                                    boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
                                }}
                            >
                                {editingEvent ? "💾 Cập nhật" : "➕ Tạo mới"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

/* =========================
   COMPONENTS GỌN NHẸ
========================= */

const Input = ({ label, value, onChange, type = "text", placeholder }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={labelStyle}>{label}</label>

        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={input}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, input)}
        />
    </div>
);

const Textarea = ({ label, value, onChange }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={labelStyle}>{label}</label>

        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            style={textarea}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, textarea)}
        />
    </div>
);

const Select = ({ label, value, options, onChange }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={labelStyle}>{label}</label>

        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={input}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, input)}
        >
            {options.map(([val, text]) => (
                <option key={val} value={val}>{text}</option>
            ))}
        </select>
    </div>
);


/* =========================
   STYLE OBJECTS
========================= */

const td = {
    padding: "12px 16px",
    fontSize: 14,
    fontFamily: "Inter, sans-serif",
    color: "#1e293b"
};

const th = {
    padding: "14px 16px",
    fontSize: 14,
    textAlign: "left",
    color: "white",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif"
};

const tr = {
    transition: ".25s",
    borderBottom: "1px solid rgba(148,163,184,0.35)"
};

const table = {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: 16,
    overflow: "hidden",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(30,58,138,0.25)"
};

const labelStyle = {
    display: "block",
    marginBottom: 6,
    fontWeight: 600,
    fontSize: 14,
    color: "#334155",
    fontFamily: "Inter, sans-serif"
};

const label = labelStyle;

const input = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.55)",
    background: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontFamily: "Inter, sans-serif",
    color: "#1e293b",
    transition: ".25s"
};

const textarea = {
    ...input,
    minHeight: 90,
    resize: "vertical"
};

const modalOverlay = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(3px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: 20
};

const modal = {
    width: "90%",
    maxWidth: 550,
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(20px)",
    borderRadius: 22,
    padding: 28,
    maxHeight: "90vh",
    overflowY: "auto",
    color: "#1e293b",
    border: "1px solid rgba(148,163,184,0.4)",
    boxShadow: "0 10px 35px rgba(30,58,138,0.35)"
};

const modalTitle = {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 20,
    color: "#1e3a8a",
    fontFamily: "Inter, sans-serif",
    textAlign: "center",
    textShadow: "0 2px 10px rgba(30,58,138,0.2)"
};

const btnBlue = {
    background: "linear-gradient(135deg,#60a5fa,#3b82f6)",
    color: "white",
    padding: "12px 20px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
    transition: ".25s"
};

const btnGreen = {
    background: "linear-gradient(135deg,#34d399,#10b981)",
    color: "white",
    padding: "12px 20px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: "Inter, sans-serif",
    boxShadow: "0 4px 12px rgba(16,185,129,0.35)",
    transition: ".25s"
};

const btnGray = {
    background: "rgba(148,163,184,0.35)",
    color: "#475569",
    padding: "12px 20px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif"
};

const btnBlueSmall = {
    background: "linear-gradient(135deg,#60a5fa,#3b82f6)",
    color: "white",
    padding: "8px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    boxShadow: "0 3px 8px rgba(59,130,246,0.35)"
};

const btnRedSmall = {
    background: "linear-gradient(135deg,#f87171,#ef4444)",
    color: "white",
    padding: "8px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    boxShadow: "0 3px 8px rgba(239,68,68,0.35)"
};


export default ManageEvents;
