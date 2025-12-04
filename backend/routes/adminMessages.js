// backend/routes/adminMessages.js
const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");
const authMiddleware = require("../middleware/auth");

// GET /api/admin/messages - Admin xem tất cả tin nhắn từ user
router.get("/messages", authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ admin mới được xem tin nhắn!" });
        }

        const pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT 
                m.id,
                m.noi_dung,
                m.thoi_gian,
                m.ma_nguoi_dung,
                nd.ho_ten,
                nd.email,
                nd.mssv,
                nd.lop
            FROM messages m
            INNER JOIN nguoi_dung nd ON m.ma_nguoi_dung = nd.ma_nguoi_dung
            ORDER BY m.thoi_gian DESC
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error("❌ Lỗi lấy tin nhắn admin:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// GET /api/admin/messages/:userId - Admin xem tin nhắn của một user cụ thể
router.get("/messages/:userId", authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ admin mới được xem tin nhắn!" });
        }

        const { userId } = req.params;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("userId", sql.Int, userId)
            .query(`
                SELECT 
                    m.id,
                    m.noi_dung,
                    m.thoi_gian,
                    m.ma_nguoi_dung,
                    nd.ho_ten,
                    nd.email,
                    nd.mssv,
                    nd.lop
                FROM messages m
                INNER JOIN nguoi_dung nd ON m.ma_nguoi_dung = nd.ma_nguoi_dung
                WHERE m.ma_nguoi_dung = @userId
                ORDER BY m.thoi_gian DESC
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error("❌ Lỗi lấy tin nhắn user:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// DELETE /api/admin/messages/:id - Admin xóa tin nhắn
router.delete("/messages/:id", authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ admin mới được xóa tin nhắn!" });
        }

        const { id } = req.params;
        const pool = await sql.connect(config);

        // Kiểm tra tin nhắn có tồn tại không
        const checkMsg = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT id FROM messages WHERE id = @id");

        if (checkMsg.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy tin nhắn!" });
        }

        // Xóa tin nhắn
        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM messages WHERE id = @id");

        res.json({
            success: true,
            message: "Xóa tin nhắn thành công!"
        });

    } catch (err) {
        console.error("❌ Lỗi xóa tin nhắn:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;

