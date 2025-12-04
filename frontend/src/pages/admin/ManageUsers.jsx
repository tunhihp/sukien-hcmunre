// src/pages/admin/ManageUsers.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExportToExcel from "../../components/ExportToExcel";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const res = await fetch("http://localhost:3001/api/admin/users", { headers });
                const data = await res.json();

                const mapped = (data || []).map((u) => ({
                    name: u.ho_ten,
                    studentId: u.mssv,
                    className: u.lop,
                    major: u.ma_nganh,
                    faculty: u.ma_khoa,
                    email: u.email,
                    phone: u.sdt,
                    role: u.vai_tro,
                }));

                setUsers(mapped);
            } catch (err) {
                console.error("Lỗi tải danh sách người dùng:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUserClientOnly = (email) => {
        // chỉ xoá trên giao diện cho đẹp, không ảnh hưởng DB
        setUsers((prev) => prev.filter((u) => u.email !== email));
    };

    return (
        <div
            style={{
                padding: 32,
                minHeight: "100vh",
                background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
                color: "#0f172a",
                fontFamily: "Inter, sans-serif"
            }}
        >
            {/* 🔙 Nút quay lại */}
            <button
                onClick={() => navigate("/admin")}
                style={{
                    backgroundColor: "#90caf9",
                    color: "#0f172a",
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: "1px solid #64b5f6",
                    cursor: "pointer",
                    marginBottom: 16,
                    fontWeight: 600,
                    transition: "0.25s"
                }}
                onMouseEnter={e => e.target.style.backgroundColor = "#64b5f6"}
                onMouseLeave={e => e.target.style.backgroundColor = "#90caf9"}
            >
                ⬅ Quay lại bảng điều khiển
            </button>

            <h1
                style={{
                    fontSize: 26,
                    fontWeight: 700,
                    marginBottom: 20,
                    color: "#0f172a"
                }}
            >
                👥 Quản lý tài khoản người dùng
            </h1>

            {/* Excel Export */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <ExportToExcel
                    data={users}
                    fileName="DanhSachTaiKhoan"
                    headers={[
                        { key: "name", label: "Họ tên" },
                        { key: "studentId", label: "MSSV" },
                        { key: "className", label: "Lớp" },
                        { key: "major", label: "Ngành" },
                        { key: "faculty", label: "Khoa" },
                        { key: "email", label: "Email" },
                        { key: "phone", label: "SĐT" },
                        { key: "role", label: "Vai trò" },
                    ]}
                />
            </div>

            {/* TABLE */}
            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "rgba(255,255,255,0.85)",
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                        border: "2px solid #bbdefb"
                    }}
                >
                    <thead style={{ backgroundColor: "#bbdefb" }}>
                        <tr>
                            {["STT", "Họ tên", "MSSV", "Lớp", "Ngành", "Khoa", "Email", "SĐT", "Vai trò", "Xóa"].map(
                                (h, i) => (
                                    <th
                                        key={i}
                                        style={{
                                            padding: "12px 14px",
                                            textAlign: "left",
                                            fontSize: 14,
                                            color: "#0f172a",
                                            fontWeight: 600,
                                            borderBottom: "1px solid #90caf9"
                                        }}
                                    >
                                        {h}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={10} style={{ padding: 16, textAlign: "center", color: "#555" }}>
                                    Đang tải...
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            users.map((u, i) => (
                                <tr
                                    key={u.email}
                                    style={{
                                        borderBottom: "1px solid #e0e7ff",
                                        transition: "0.2s"
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e3f2fd"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                    <td style={td}>{i + 1}</td>
                                    <td style={td}>{u.name}</td>
                                    <td style={td}>{u.studentId}</td>
                                    <td style={td}>{u.className}</td>
                                    <td style={td}>{u.major}</td>
                                    <td style={td}>{u.faculty}</td>
                                    <td style={td}>{u.email}</td>
                                    <td style={td}>{u.phone}</td>
                                    <td
                                        style={{
                                            ...td,
                                            fontWeight: 700,
                                            color: u.role === "admin" ? "#d97706" : "#0284c7"
                                        }}
                                    >
                                        {u.role}
                                    </td>

                                    <td style={td}>
                                        <button
                                            onClick={() => handleDeleteUserClientOnly(u.email)}
                                            style={{
                                                backgroundColor: "#ef4444",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 6,
                                                padding: "6px 10px",
                                                cursor: "pointer",
                                                transition: "0.2s"
                                            }}
                                            onMouseEnter={e => e.target.style.backgroundColor = "#dc2626"}
                                            onMouseLeave={e => e.target.style.backgroundColor = "#ef4444"}
                                        >
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))}

                        {!loading && users.length === 0 && (
                            <tr>
                                <td colSpan={10} style={{ padding: 16, textAlign: "center", color: "#64748b" }}>
                                    Không có người dùng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const td = {
    padding: "8px 12px",
    fontSize: 13,
};

export default ManageUsers;
