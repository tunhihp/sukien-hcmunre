// backend/routes/adminChat.js
// Admin Chat Routes - Mounted at /api/admin/chat
const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");
const authMiddleware = require("../middleware/auth");

// ============================================
// GET /api/admin/chat/conversations - Admin xem tất cả cuộc hội thoại
// ============================================
router.get("/conversations", authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Chỉ admin mới được xem tất cả cuộc hội thoại!" });
        }

        const pool = await sql.connect(config);

        // Lấy tất cả cuộc hội thoại, nhóm theo user_id
        const result = await pool.request()
            .query(`
                SELECT 
                    c.user_id,
                    nd.ho_ten,
                    nd.email,
                    nd.mssv,
                    nd.lop,
                    COUNT(c.id) AS so_tin_nhan,
                    MAX(c.created_at) AS tin_nhan_cuoi
                FROM lich_su_chat c
                INNER JOIN nguoi_dung nd ON c.user_id = nd.ma_nguoi_dung
                GROUP BY c.user_id, nd.ho_ten, nd.email, nd.mssv, nd.lop
                ORDER BY tin_nhan_cuoi DESC
            `);

        res.json({
            success: true,
            total_conversations: result.recordset.length,
            conversations: result.recordset
        });

    } catch (err) {
        console.error("❌ ADMIN CHAT CONVERSATIONS ERROR:", err);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// ============================================
// GET /api/admin/chat/conversation/:user_id - Admin xem chi tiết cuộc hội thoại
// ============================================
router.get("/conversation/:user_id", authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Chỉ admin mới được xem cuộc hội thoại!" });
        }

        const { user_id } = req.params;
        const targetUserId = parseInt(user_id);

        if (Number.isNaN(targetUserId)) {
            return res.status(400).json({ success: false, message: "ID người dùng không hợp lệ!" });
        }

        const pool = await sql.connect(config);

        // Lấy thông tin user
        const userInfo = await pool.request()
            .input("uid", sql.Int, targetUserId)
            .query(`
                SELECT ma_nguoi_dung, ho_ten, email, mssv, lop
                FROM nguoi_dung
                WHERE ma_nguoi_dung = @uid
            `);

        if (userInfo.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng!" });
        }

        // Lấy tất cả tin nhắn
        const messages = await pool.request()
            .input("uid", sql.Int, targetUserId)
            .query(`
                SELECT 
                    c.id,
                    c.user_id,
                    c.message,
                    c.sender,
                    c.created_at
                FROM lich_su_chat c
                WHERE c.user_id = @uid
                ORDER BY c.created_at ASC
            `);

        res.json({
            success: true,
            user: userInfo.recordset[0],
            total_messages: messages.recordset.length,
            messages: messages.recordset
        });

    } catch (err) {
        console.error("❌ ADMIN CHAT CONVERSATION ERROR:", err);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

module.exports = router;

