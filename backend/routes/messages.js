// backend/routes/messages.js
const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");
const authMiddleware = require("../middleware/auth");

// POST /api/messages - User gửi tin nhắn (giữ lại cho tương thích cũ)
// ⭐ Đồng thời đồng bộ sang bảng lich_su_chat để hệ thống chat 2 chiều sử dụng
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { noi_dung } = req.body;
        // Token có id, không phải ma_nguoi_dung
        const ma_nguoi_dung = req.user.id || req.user.ma_nguoi_dung;

        if (!noi_dung || !noi_dung.trim()) {
            return res.status(400).json({ message: "Nội dung tin nhắn không được để trống!" });
        }

        if (!ma_nguoi_dung) {
            return res.status(401).json({ message: "Vui lòng đăng nhập!" });
        }

        const pool = await sql.connect(config);
        const now = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
        );
        // 1️⃣ Lưu vào bảng messages (giữ nguyên hành vi cũ)
        const messageResult = await pool.request()
            .input("ma_nguoi_dung", sql.Int, ma_nguoi_dung)
            .input("noi_dung", sql.NVarChar, noi_dung.trim())
            .input("thoi_gian", sql.DateTime, now)
            .query(`
                INSERT INTO messages (ma_nguoi_dung, noi_dung, thoi_gian)
                OUTPUT INSERTED.*
                VALUES (@ma_nguoi_dung, @noi_dung, @thoi_gian)
    `);


        // 2️⃣ Đồng bộ sang bảng lich_su_chat để admin có thể xem trong hộp thư 2 chiều
        //    user_id  : mã sinh viên
        //    sender   : "student" để phân biệt với "admin"
        try {
            await pool.request()
                .input("user_id", sql.Int, ma_nguoi_dung)
                .input("message", sql.NVarChar, noi_dung.trim())
                .input("sender", sql.VarChar, "student")
                .input("created_at", sql.DateTime, now)
                .query(`
                    INSERT INTO lich_su_chat (user_id, message, sender, created_at)
                    VALUES (@user_id, @message, @sender, @created_at)
                `);
        } catch (syncErr) {
            // Không được phép làm hỏng request gốc nếu phần sync phụ trợ lỗi
            console.error("⚠️ Lỗi đồng bộ lich_su_chat từ /api/messages:", syncErr);
        }

        res.status(201).json({
            success: true,
            message: "Gửi tin nhắn thành công!",
            data: messageResult.recordset[0]
        });

    } catch (err) {
        console.error("❌ Lỗi gửi tin nhắn:", err);
        res.status(500).json({ message: "Lỗi server khi gửi tin nhắn!" });
    }
});

// GET /api/messages/my - User xem tin nhắn của mình
router.get("/my", authMiddleware, async (req, res) => {
    try {
        // Token có id, không phải ma_nguoi_dung
        const ma_nguoi_dung = req.user.id || req.user.ma_nguoi_dung;

        if (!ma_nguoi_dung) {
            return res.status(401).json({ message: "Vui lòng đăng nhập!" });
        }

        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("ma_nguoi_dung", sql.Int, ma_nguoi_dung)
            .query(`
                SELECT 
                    m.id,
                    m.noi_dung,
                    m.thoi_gian,
                    m.ma_nguoi_dung,
                    nd.ho_ten,
                    nd.email
                FROM messages m
                INNER JOIN nguoi_dung nd ON m.ma_nguoi_dung = nd.ma_nguoi_dung
                WHERE m.ma_nguoi_dung = @ma_nguoi_dung
                ORDER BY m.thoi_gian DESC
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error("❌ Lỗi lấy tin nhắn:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;

