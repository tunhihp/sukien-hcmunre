import React, { useState } from "react";

// Danh sách lớp cố định
const classOptions = [
    "07_ĐH_CNTT1", "07_ĐH_CNTT2", "07_ĐH_CNTT3", "07_ĐH_CNTT4", "07_ĐH_HTTT",
    "08_ĐH_CNPM", "08_ĐH_THMT", "08_ĐH_TTMT",
    "09_ĐH_CNPM1", "09_ĐH_CNPM2", "09_ĐH_CNPM3", "09_ĐH_THMT", "09_ĐH_TMĐT", "09_ĐH_TTMT",
    "10_ĐH_CNPM1", "10_ĐH_CNPM2", "10_ĐH_CNPM3", "10_ĐH_THMT1", "10_ĐH_THMT2", "10_ĐH_TMĐT", "10_ĐH_TTM"
];

const EventForm = ({ eventId, eventTitle, onSubmit, user: userFromProps }) => {
    const [loading, setLoading] = useState(false);

    // 🔹 Ưu tiên user từ props, nếu không có thì lấy trong localStorage
    const user = userFromProps || (() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    })();

    // 👉 Debug cho dễ nhìn trong Console
    console.log("User trong EventForm:", user);

    // 🔹 Tính sẵn 3 giá trị hiển thị
    const name = user ? (user.ho_ten ?? user.ten ?? "") : "";
    const mssv = user
        ? (
            user.mssv ??
            user.ma_sv ??
            user.ma_so_sinh_vien ??
            ""            // KHÔNG fallback về email nữa cho khỏi rối
        )
        : "";
    const lop = user ? (user.lop ?? user.ten_lop ?? "") : "";

    console.log("Giá trị mssv hiển thị:", mssv);

    const handleSubmit = async () => {
        if (!user) {
            alert("Bạn cần đăng nhập trước khi đăng ký sự kiện!");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("http://localhost:3001/api/event/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ma_su_kien: eventId,
                    ma_nguoi_dung: user.ma_nguoi_dung,
                    mssv: (mssv || "").replace(/[^0-9]/g, ""),
                    lop: (lop || "").replace(/[^a-zA-Z0-9_ĐÊÔƠƯđêôơư]/g, "")
                })
            });

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                alert(data.message || "Đăng ký thất bại, vui lòng thử lại!");
                return;
            }

            alert("🎉 Bạn đã đăng ký sự kiện thành công!");
            onSubmit && onSubmit();

        } catch (err) {
            console.error(err);
            setLoading(false);
            alert("Có lỗi kết nối server, thử lại sau nhé!");
        }
    };

    return (
        <div
            style={{
                background: "#1e1b4b",
                padding: 25,
                borderRadius: 14,
                color: "#fff",
                boxShadow: "0 0 20px rgba(0,0,0,0.2)",
                marginTop: 20
            }}
        >
            <h3 style={{ fontSize: 22, marginBottom: 15 }}>
                Đăng ký sự kiện: {eventTitle}
            </h3>

            {/* Họ tên – auto fill + không cho sửa */}
            <input
                value={name}
                readOnly
                style={{ ...inputStyle, background: "#e0e7ff" }}
                placeholder="Họ tên"
            />

            {/* MSSV – auto fill + không cho sửa */}
            <input
                value={mssv}
                readOnly
                style={{ ...inputStyle, background: "#e0e7ff" }}
                placeholder="MSSV"
            />

            {/* Lớp – auto fill + không cho sửa */}
            <select
                value={lop || ""}
                disabled
                style={{ ...inputStyle, background: "#e0e7ff" }}
            >
                <option value="">{lop || "Lớp"}</option>
                {classOptions.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </select>

            <button
                onClick={handleSubmit}
                style={buttonStyle}
                disabled={loading}
            >
                {loading ? "Đang gửi..." : "Xác nhận"}
            </button>
        </div>
    );
};

const inputStyle = {
    padding: "12px",
    marginBottom: "12px",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "8px",
    border: "1px solid #a5b4fc",
    background: "#eef2ff",
    color: "#111"
};

const buttonStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#6366f1",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
};

export default EventForm;
