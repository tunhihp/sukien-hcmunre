// backend/routes/chat.js
// Chat System - Student ↔ Admin
const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");
const authMiddleware = require("../middleware/auth");

// ============================================
// POST /api/chat/send - Gửi tin nhắn (student hoặc admin)
// ============================================
router.post("/send", authMiddleware, async (req, res) => {
    try {
        // Support both old format (message, user_id) and new format (sender_type, sender_id, receiver_id, content)
        const { 
            message,           // Old format
            user_id,           // Old format
            sender_type,       // New format: "admin" or "student"
            sender_id,         // New format
            receiver_id,       // New format
            content            // New format
        } = req.body;

        const currentUserId = req.user.id || req.user.ma_nguoi_dung;
        const currentRole = req.user.role || "student";

        // Determine which format is being used
        let messageContent, targetUserId, sender;

        if (content) {
            // New format
            messageContent = content.trim();
            sender = sender_type || (currentRole === "admin" ? "admin" : "student");
            targetUserId = receiver_id ? parseInt(receiver_id) : currentUserId;
        } else {
            // Old format (backward compatibility)
            messageContent = message ? message.trim() : "";
            sender = currentRole === "admin" ? "admin" : "student";
            targetUserId = (sender === "admin" && user_id) ? parseInt(user_id) : currentUserId;
        }

        // Validation
        if (!messageContent) {
            return res.status(400).json({ success: false, message: "Nội dung tin nhắn không được để trống!" });
        }

        if (Number.isNaN(targetUserId)) {
            return res.status(400).json({ success: false, message: "ID người dùng không hợp lệ!" });
        }

        // Validate sender_type if provided
        if (sender_type && sender_type !== "admin" && sender_type !== "student") {
            return res.status(400).json({ success: false, message: "sender_type phải là 'admin' hoặc 'student'!" });
        }

        const pool = await sql.connect(config);

        // Kiểm tra user có tồn tại không
        const userCheck = await pool.request()
            .input("uid", sql.Int, targetUserId)
            .query(`SELECT ma_nguoi_dung FROM nguoi_dung WHERE ma_nguoi_dung = @uid`);

        if (userCheck.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng!" });
        }

        // Lưu tin nhắn vào lich_su_chat
        const result = await pool.request()
            .input("user_id", sql.Int, targetUserId)
            .input("message", sql.NVarChar, messageContent)
            .input("sender", sql.VarChar, sender)
            .query(`
                INSERT INTO lich_su_chat (user_id, message, sender, created_at)
                OUTPUT INSERTED.*
                VALUES (@user_id, @message, @sender, GETDATE())
            `);

        console.log(`✅ Chat message sent: User ${targetUserId} - Sender: ${sender} - Message ID: ${result.recordset[0].id}`);

        res.status(201).json({
            success: true,
            message: "Gửi tin nhắn thành công!",
            data: result.recordset[0]
        });

    } catch (err) {
        console.error("❌ CHAT SEND ERROR:", err);
        res.status(500).json({ success: false, message: "Lỗi server khi gửi tin nhắn!" });
    }
});

// ============================================
// GET /api/chat/conversation/:user_id - Lấy cuộc hội thoại của user
// ============================================
router.get("/conversation/:user_id", authMiddleware, async (req, res) => {
    try {
        const { user_id } = req.params;
        const currentUserId = req.user.id || req.user.ma_nguoi_dung;
        const currentRole = req.user.role || "student";

        const targetUserId = parseInt(user_id);

        if (Number.isNaN(targetUserId)) {
            return res.status(400).json({ success: false, message: "ID người dùng không hợp lệ!" });
        }

        // Kiểm tra quyền: student chỉ xem được cuộc hội thoại của mình, admin xem được tất cả
        if (currentRole !== "admin" && currentUserId !== targetUserId) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền xem cuộc hội thoại này!" });
        }

        const pool = await sql.connect(config);

        // Lấy tất cả tin nhắn của user
        const result = await pool.request()
            .input("uid", sql.Int, targetUserId)
            .query(`
                SELECT 
                    c.id,
                    c.user_id,
                    c.message,
                    c.sender,
                    c.created_at,
                    nd.ho_ten,
                    nd.email
                FROM lich_su_chat c
                LEFT JOIN nguoi_dung nd ON c.user_id = nd.ma_nguoi_dung
                WHERE c.user_id = @uid
                ORDER BY c.created_at ASC
            `);

        res.json({
            success: true,
            user_id: targetUserId,
            total_messages: result.recordset.length,
            messages: result.recordset
        });

    } catch (err) {
        console.error("❌ CHAT CONVERSATION ERROR:", err);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// ============================================
// GET /api/admin/chat/conversations - Admin xem tất cả cuộc hội thoại
// ============================================
router.get("/admin/conversations", authMiddleware, async (req, res) => {
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
router.get("/admin/conversation/:user_id", authMiddleware, async (req, res) => {
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

