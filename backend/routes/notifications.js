const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");

// ========================
// 1) LẤY THÔNG BÁO CỦA USER
// ========================
router.get("/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (Number.isNaN(userId)) {
            return res.status(400).json({ message: "ID người dùng không hợp lệ!" });
        }

        const pool = await sql.connect(config);

        const rs = await pool.request()
            .input("uid", sql.Int, userId)
            .query(`
                SELECT TOP 50 *
                FROM thong_bao
                WHERE id_nguoi_nhan = @uid OR id_nguoi_nhan IS NULL
                ORDER BY thoi_gian_tao DESC
            `);

        res.json(rs.recordset);

    } catch (err) {
        console.error("❌ NOTIFICATION ERROR:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// ========================
// 1b) LẤY THÔNG BÁO CỦA USER (Route rõ ràng hơn)
// ========================
router.get("/user/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (Number.isNaN(userId)) {
            return res.status(400).json({ message: "ID người dùng không hợp lệ!" });
        }

        const pool = await sql.connect(config);

        const rs = await pool.request()
            .input("uid", sql.Int, userId)
            .query(`
                SELECT TOP 50 *
                FROM thong_bao
                WHERE id_nguoi_nhan = @uid OR id_nguoi_nhan IS NULL
                ORDER BY thoi_gian_tao DESC
            `);

        res.json(rs.recordset);

    } catch (err) {
        console.error("❌ NOTIFICATION ERROR:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});


// ========================
// 2) ĐÁNH DẤU ĐÃ ĐỌC (PATCH - RESTful)
// ========================
router.patch("/read/:id", async (req, res) => {
    try {
        const notiId = parseInt(req.params.id);
        
        if (Number.isNaN(notiId)) {
            return res.status(400).json({ success: false, message: "ID thông báo không hợp lệ!" });
        }

        const pool = await sql.connect(config);

        // Kiểm tra thông báo có tồn tại không
        const checkNoti = await pool.request()
            .input("nid", sql.Int, notiId)
            .query(`SELECT id_thong_bao FROM thong_bao WHERE id_thong_bao = @nid`);

        if (checkNoti.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông báo!" });
        }

        // Cập nhật trạng thái đã đọc
        await pool.request()
            .input("nid", sql.Int, notiId)
            .query(`
                UPDATE thong_bao SET da_doc = 1 WHERE id_thong_bao = @nid
            `);

        res.json({ success: true, message: "Đã đánh dấu đã đọc!" });

    } catch (err) {
        console.error("❌ READ NOTI ERROR:", err);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// ========================
// 2b) ĐÁNH DẤU ĐÃ ĐỌC (PUT - Giữ lại để backward compatibility)
// ========================
router.put("/read/:id", async (req, res) => {
    try {
        const notiId = parseInt(req.params.id);
        
        if (Number.isNaN(notiId)) {
            return res.status(400).json({ success: false, message: "ID thông báo không hợp lệ!" });
        }

        const pool = await sql.connect(config);

        // Kiểm tra thông báo có tồn tại không
        const checkNoti = await pool.request()
            .input("nid", sql.Int, notiId)
            .query(`SELECT id_thong_bao FROM thong_bao WHERE id_thong_bao = @nid`);

        if (checkNoti.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông báo!" });
        }

        // Cập nhật trạng thái đã đọc
        await pool.request()
            .input("nid", sql.Int, notiId)
            .query(`
                UPDATE thong_bao SET da_doc = 1 WHERE id_thong_bao = @nid
            `);

        res.json({ success: true, message: "Đã đánh dấu đã đọc!" });

    } catch (err) {
        console.error("❌ READ NOTI ERROR:", err);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});


// ========================
// 3) TẠO THÔNG BÁO
// ========================
router.post("/create", async (req, res) => {
    try {
        const { tieu_de, noi_dung, id_nguoi_nhan, loai_thong_bao, id_su_kien, icon } = req.body;

        // Validation
        if (!tieu_de || !tieu_de.trim()) {
            return res.status(400).json({ success: false, message: "Tiêu đề không được để trống!" });
        }

        if (!noi_dung || !noi_dung.trim()) {
            return res.status(400).json({ success: false, message: "Nội dung không được để trống!" });
        }

        if (!id_nguoi_nhan || Number.isNaN(parseInt(id_nguoi_nhan))) {
            return res.status(400).json({ success: false, message: "ID người nhận không hợp lệ!" });
        }

        const pool = await sql.connect(config);

        // Kiểm tra user có tồn tại không (nếu có id_nguoi_nhan)
        if (id_nguoi_nhan) {
            const userCheck = await pool.request()
                .input("uid", sql.Int, id_nguoi_nhan)
                .query(`SELECT ma_nguoi_dung FROM nguoi_dung WHERE ma_nguoi_dung = @uid`);

            if (userCheck.recordset.length === 0) {
                return res.status(404).json({ success: false, message: "Không tìm thấy người nhận!" });
            }
        }

        // Kiểm tra sự kiện có tồn tại không (nếu có id_su_kien)
        if (id_su_kien) {
            const eventCheck = await pool.request()
                .input("eid", sql.Int, id_su_kien)
                .query(`SELECT id FROM su_kien WHERE id = @eid`);

            if (eventCheck.recordset.length === 0) {
                return res.status(404).json({ success: false, message: "Không tìm thấy sự kiện!" });
            }
        }

        const result = await pool.request()
            .input("title", sql.NVarChar, tieu_de.trim())
            .input("content", sql.NVarChar, noi_dung.trim())
            .input("uid", sql.Int, id_nguoi_nhan || null)
            .input("type", sql.NVarChar, loai_thong_bao || "general")
            .input("eid", sql.Int, id_su_kien || null)
            .input("icon", sql.NVarChar, icon || "🔔")
            .query(`
                INSERT INTO thong_bao (tieu_de, noi_dung, id_nguoi_nhan, loai_thong_bao, id_su_kien, icon, thoi_gian_tao, da_doc)
                OUTPUT INSERTED.*
                VALUES (@title, @content, @uid, @type, @eid, @icon, GETDATE(), 0)
            `);

        res.json({ 
            success: true, 
            message: "Đã tạo thông báo thành công!",
            notification: result.recordset[0]
        });

    } catch (err) {
        console.error("❌ CREATE NOTI ERROR:", err);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

module.exports = router;
