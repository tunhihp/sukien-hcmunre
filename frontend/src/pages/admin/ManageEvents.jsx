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
        <div style={{ padding: 32, minHeight: "100vh", backgroundColor: "#0f172a", color: "#e5e7eb" }}>
            <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
                📅 Quản lý sự kiện
            </h1>

            {/* Nút điều hướng */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 12
            }}>
                <button
                    onClick={() => navigate("/events")}
                    style={btnBlue}
                >
                    ⬅ Trở lại trang Events
                </button>

                <button
                    onClick={handleAdd}
                    style={btnGreen}
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
                />
            </div>

            {/* Bảng danh sách */}
            <div style={{ overflowX: "auto" }}>
                <table style={table}>
                    <thead style={{ backgroundColor: "#111827" }}>
                        <tr>
                            {["STT", "Tên sự kiện", "Địa điểm", "Thời gian", "Số lượng", "Trạng thái", "Thao tác"]
                                .map((h, i) => (
                                    <th key={i} style={th}>{h}</th>
                                ))}
                        </tr>
                    </thead>

                    <tbody>
                        {!loading &&
                            events.map((evt, i) => {
                                const id = evt.id || evt.ma_su_kien;
                                return (
                                    <tr key={id} style={tr}>
                                        <td style={td}>{i + 1}</td>
                                        <td style={td}>{evt.title}</td>
                                        <td style={td}>{evt.location || "-"}</td>
                                        <td style={td}>{formatDate(evt.date)}</td>
                                        <td style={td}>{evt.attendees || 0}/{evt.capacity || 0}</td>

                                        <td style={td}>
                                            <span style={{
                                                color: (evt.attendees >= evt.capacity) ? "#ef4444" : "#4ade80",
                                                fontWeight: "bold"
                                            }}>
                                                {(evt.attendees >= evt.capacity) ? "Đã đủ" : "Còn chỗ"}
                                            </span>
                                        </td>

                                        <td style={td}>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button
                                                    onClick={() => handleEdit(evt)}
                                                    style={btnBlueSmall}
                                                >
                                                    ✏️ Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(id)}
                                                    style={btnRedSmall}
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
                                <td colSpan={7} style={{ padding: 16, textAlign: "center", color: "#9ca3af" }}>
                                    Không có sự kiện nào.
                                </td>
                            </tr>
                        )}

                        {loading && (
                            <tr>
                                <td colSpan={7} style={{ padding: 16, textAlign: "center", color: "#9ca3af" }}>
                                    Đang tải...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Form thêm/sửa */}
            {showForm && (
                <div style={modalOverlay}>
                    <div style={modal}>
                        <h2 style={modalTitle}>
                            {editingEvent ? "✏️ Sửa sự kiện" : "➕ Tạo sự kiện"}
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {/* Tên */}
                            <Input label="Tên sự kiện *" value={formData.title}
                                onChange={(v) => setFormData({ ...formData, title: v })}
                            />

                            {/* Mô tả */}
                            <Textarea label="Mô tả" value={formData.description}
                                onChange={(v) => setFormData({ ...formData, description: v })}
                            />

                            {/* Địa điểm */}
                            <Input label="Địa điểm" value={formData.location}
                                onChange={(v) => setFormData({ ...formData, location: v })}
                            />

                            {/* Thời gian */}
                            <div>
                                <label style={label}>Thời gian</label>
                                <input
                                    type="datetime-local"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    style={input}
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
                                    ["workshop", "Workshop"]
                                ]}
                                onChange={(v) => setFormData({ ...formData, type: v })}
                            />

                            {/* Số lượng */}
                            <Select
                                label="Số lượng tối đa"
                                value={formData.capacity}
                                options={[
                                    [50, "50 người"],
                                    [100, "100 người"],
                                    [150, "150 người"],
                                    [200, "200 người"]
                                ]}
                                onChange={(v) => setFormData({ ...formData, capacity: parseInt(v) })}
                            />

                            {/* Điểm */}
                            <Input
                                type="number"
                                label="Điểm rèn luyện"
                                value={formData.points}
                                onChange={(v) => setFormData({ ...formData, points: parseInt(v) || 0 })}
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
                            <button onClick={() => setShowForm(false)} style={btnGray}>Hủy</button>
                            <button onClick={handleSave} style={btnGreen}>
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
    <div>
        <label style={labelStyle}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={input}
        />
    </div>
);

const Textarea = ({ label, value, onChange }) => (
    <div>
        <label style={labelStyle}>{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            style={textarea}
        />
    </div>
);

const Select = ({ label, value, options, onChange }) => (
    <div>
        <label style={labelStyle}>{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={input}>
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
    padding: "8px 12px",
    fontSize: 13,
};

const th = {
    padding: "10px 12px",
    fontSize: 13,
    textAlign: "left",
    color: "#e5e7eb"
};

const tr = { borderBottom: "1px solid #374151" };

const table = {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1e293b",
};

const labelStyle = {
    display: "block",
    marginBottom: 6,
    fontWeight: "bold",
    fontSize: 14
};

const label = labelStyle;

const input = {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #374151",
    backgroundColor: "#111827",
    color: "white",
    fontSize: 14
};

const textarea = {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #374151",
    backgroundColor: "#111827",
    color: "white",
    fontSize: 14
};

const modalOverlay = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
};

const modal = {
    width: "90%",
    maxWidth: 600,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 24,
    maxHeight: "90vh",
    overflowY: "auto",
    color: "white"
};

const modalTitle = {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20
};

const btnBlue = {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold"
};

const btnGreen = {
    backgroundColor: "#10b981",
    color: "white",
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold"
};

const btnGray = {
    backgroundColor: "#6b7280",
    color: "white",
    padding: "10px 20px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer"
};

const btnBlueSmall = {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 12
};

const btnRedSmall = {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 12
};

export default ManageEvents;
