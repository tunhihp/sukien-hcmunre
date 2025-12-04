// backend/routes/events.js
const express = require("express");
const router = express.Router();

// Dùng chung cách import như các route khác
const { sql, config } = require("../db");
const authMiddleware = require("../middleware/auth");

// GET /api/events - Lấy tất cả sự kiện
router.get("/", async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT
                id AS ma_su_kien,
                title,
                description,
                location,
                date,
                type,
                capacity,
                image,
                points,
                (
                    SELECT COUNT(*)
                    FROM dang_ky_su_kien dk
                    WHERE dk.ma_su_kien = su_kien.id
                ) AS attendees
            FROM su_kien
            ORDER BY date DESC
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error("❌ Lỗi server /api/events:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// GET /api/events/recent - Lấy 5 sự kiện gần nhất (PHẢI ĐẶT TRƯỚC /:id)
router.get("/recent", async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT TOP 5
                sk.*,
                (
                    SELECT COUNT(*)
                    FROM dang_ky_su_kien dk
                    WHERE dk.ma_su_kien = sk.id      -- ✅ sk.id là PK của su_kien
                ) AS attendees
            FROM su_kien sk
            ORDER BY sk.[date] DESC
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error("❌ Lỗi API /events/recent:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// GET /api/events/:id - Lấy chi tiết sự kiện theo ID (PHẢI ĐẶT SAU /recent)
router.get("/:id", async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const id = req.params.id;

        const rs = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM su_kien WHERE id = @id");

        if (rs.recordset.length === 0)
            return res.status(404).json({ message: "Không tìm thấy sự kiện" });

        res.json(rs.recordset[0]);

    } catch (err) {
        console.error("❌ Lỗi server /api/events/:id:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// ============================================
// ADMIN ROUTES - CẦN AUTHENTICATION
// ============================================

// POST /api/events - Tạo sự kiện mới (Chỉ admin)
router.post("/", authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ admin mới được tạo sự kiện!" });
        }

        const { title, description, location, date, type, capacity, image, points } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Tiêu đề sự kiện không được để trống!" });
        }

        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("title", sql.NVarChar, title.trim())
            .input("description", sql.NVarChar, description || null)
            .input("location", sql.NVarChar, location || null)
            .input("date", sql.DateTime, date || null)
            .input("type", sql.NVarChar, type || null)
            .input("capacity", sql.Int, capacity || null)
            .input("image", sql.NVarChar, image || null)
            .input("points", sql.Int, points || null)
            .query(`
                INSERT INTO su_kien (title, description, location, date, type, capacity, image, points, attendees)
                OUTPUT INSERTED.*
                VALUES (@title, @description, @location, @date, @type, @capacity, @image, @points, 0)
            `);

        res.status(201).json({
            success: true,
            message: "Tạo sự kiện thành công!",
            event: result.recordset[0]
        });

    } catch (err) {
        console.error("❌ Lỗi tạo sự kiện:", err);
        res.status(500).json({ message: "Lỗi server khi tạo sự kiện!" });
    }
});

// PUT /api/events/:id - Cập nhật sự kiện (Chỉ admin)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ admin mới được cập nhật sự kiện!" });
        }

        const { id } = req.params;
        const { title, description, location, date, type, capacity, image, points } = req.body;

        const pool = await sql.connect(config);

        // Kiểm tra sự kiện có tồn tại không
        const checkEvent = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT id FROM su_kien WHERE id = @id");

        if (checkEvent.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
        }

        // Validation
        if (title !== undefined && (!title || !title.trim())) {
            return res.status(400).json({ message: "Tiêu đề sự kiện không được để trống!" });
        }

        // Xây dựng query UPDATE động (chỉ update các field được gửi lên)
        const updateFields = [];
        const request = pool.request().input("id", sql.Int, id);

        if (title !== undefined) {
            updateFields.push("title = @title");
            request.input("title", sql.NVarChar, title.trim());
        }
        if (description !== undefined) {
            updateFields.push("description = @description");
            request.input("description", sql.NVarChar, description || null);
        }
        if (location !== undefined) {
            updateFields.push("location = @location");
            request.input("location", sql.NVarChar, location || null);
        }
        if (date !== undefined) {
            updateFields.push("date = @date");
            request.input("date", sql.DateTime, date || null);
        }
        if (type !== undefined) {
            updateFields.push("type = @type");
            request.input("type", sql.NVarChar, type || null);
        }
        if (capacity !== undefined) {
            updateFields.push("capacity = @capacity");
            request.input("capacity", sql.Int, capacity || null);
        }
        if (image !== undefined) {
            updateFields.push("image = @image");
            request.input("image", sql.NVarChar, image || null);
        }
        if (points !== undefined) {
            updateFields.push("points = @points");
            request.input("points", sql.Int, points || null);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật!" });
        }

        // Cập nhật sự kiện
        const result = await request.query(`
            UPDATE su_kien
            SET ${updateFields.join(", ")}
            WHERE id = @id;
            
            SELECT * FROM su_kien WHERE id = @id;
        `);

        res.json({
            success: true,
            message: "Cập nhật sự kiện thành công!",
            event: result.recordset[0]
        });

    } catch (err) {
        console.error("❌ Lỗi cập nhật sự kiện:", err);
        res.status(500).json({ message: "Lỗi server khi cập nhật sự kiện!" });
    }
});

// DELETE /api/events/:id - Xóa sự kiện (Chỉ admin)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ admin mới được xóa sự kiện!" });
        }

        const { id } = req.params;
        const pool = await sql.connect(config);

        // Kiểm tra sự kiện có tồn tại không
        const checkEvent = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT id, title FROM su_kien WHERE id = @id");

        if (checkEvent.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
        }

        // Kiểm tra xem có người đã đăng ký sự kiện này không
        const checkRegistrations = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT COUNT(*) AS so_luong FROM dang_ky_su_kien WHERE ma_su_kien = @id");

        const soLuongDangKy = checkRegistrations.recordset[0].so_luong;

        if (soLuongDangKy > 0) {
            return res.status(400).json({ 
                message: `Không thể xóa sự kiện! Đã có ${soLuongDangKy} người đăng ký tham gia.` 
            });
        }

        // Xóa sự kiện
        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM su_kien WHERE id = @id");

        res.json({
            success: true,
            message: "Xóa sự kiện thành công!",
            deletedEvent: checkEvent.recordset[0]
        });

    } catch (err) {
        console.error("❌ Lỗi xóa sự kiện:", err);
        res.status(500).json({ message: "Lỗi server khi xóa sự kiện!" });
    }
});

// ============================================
// EVENT REGISTRATION MANAGEMENT APIs
// ============================================

// GET /api/events/:id/registrations - Danh sách người đã đăng ký sự kiện
router.get("/:id/registrations", async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);

        // Kiểm tra sự kiện có tồn tại không
        const eventCheck = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT id, title FROM su_kien WHERE id = @id");

        if (eventCheck.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
        }

        // Lấy danh sách đăng ký với thông tin user
        const result = await pool.request()
            .input("eid", sql.Int, id)
            .query(`
                SELECT 
                    dk.ma_dang_ky,
                    dk.ngay_dang_ky,
                    dk.check_in,
                    dk.thoi_gian_checkin,
                    dk.diem_cong,
                    dk.duoc_duyet,
                    dk.co_mat,
                    nd.ma_nguoi_dung,
                    nd.ho_ten,
                    nd.email,
                    nd.mssv,
                    nd.lop,
                    nd.sdt,
                    sk.title AS ten_su_kien
                FROM dang_ky_su_kien dk
                INNER JOIN nguoi_dung nd ON dk.ma_nguoi_dung = nd.ma_nguoi_dung
                INNER JOIN su_kien sk ON dk.ma_su_kien = sk.id
                WHERE dk.ma_su_kien = @eid
                ORDER BY dk.ngay_dang_ky DESC
            `);

        res.json({
            success: true,
            event_id: id,
            event_title: eventCheck.recordset[0].title,
            total_registrations: result.recordset.length,
            registrations: result.recordset
        });

    } catch (err) {
        console.error("❌ Lỗi lấy danh sách đăng ký:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// GET /api/events/:id/checkins - Danh sách người đã check-in sự kiện
router.get("/:id/checkins", async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);

        // Kiểm tra sự kiện có tồn tại không
        const eventCheck = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT id, title FROM su_kien WHERE id = @id");

        if (eventCheck.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
        }

        // Lấy danh sách check-in với thông tin user
        const result = await pool.request()
            .input("eid", sql.Int, id)
            .query(`
                SELECT 
                    dk.ma_dang_ky,
                    dk.ngay_dang_ky,
                    dk.thoi_gian_checkin,
                    dk.diem_cong,
                    nd.ma_nguoi_dung,
                    nd.ho_ten,
                    nd.email,
                    nd.mssv,
                    nd.lop,
                    nd.sdt,
                    sk.title AS ten_su_kien
                FROM dang_ky_su_kien dk
                INNER JOIN nguoi_dung nd ON dk.ma_nguoi_dung = nd.ma_nguoi_dung
                INNER JOIN su_kien sk ON dk.ma_su_kien = sk.id
                WHERE dk.ma_su_kien = @eid AND dk.check_in = 1
                ORDER BY dk.thoi_gian_checkin DESC
            `);

        res.json({
            success: true,
            event_id: id,
            event_title: eventCheck.recordset[0].title,
            total_checkins: result.recordset.length,
            checkins: result.recordset
        });

    } catch (err) {
        console.error("❌ Lỗi lấy danh sách check-in:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// GET /api/admin/events/:id/export-registrations - Export danh sách đăng ký (JSON format cho Excel)
router.get("/:id/export-registrations", authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ admin mới được export!" });
        }

        const { id } = req.params;
        const pool = await sql.connect(config);

        // Kiểm tra sự kiện có tồn tại không
        const eventCheck = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT id, title FROM su_kien WHERE id = @id");

        if (eventCheck.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
        }

        // Lấy danh sách đăng ký với thông tin đầy đủ
        const result = await pool.request()
            .input("eid", sql.Int, id)
            .query(`
                SELECT 
                    nd.ho_ten AS 'Họ tên',
                    nd.mssv AS 'MSSV',
                    nd.email AS 'Email',
                    nd.lop AS 'Lớp',
                    nd.sdt AS 'SĐT',
                    dk.ngay_dang_ky AS 'Ngày đăng ký',
                    CASE WHEN dk.check_in = 1 THEN 'Đã check-in' ELSE 'Chưa check-in' END AS 'Trạng thái',
                    dk.thoi_gian_checkin AS 'Thời gian check-in',
                    dk.diem_cong AS 'Điểm cộng'
                FROM dang_ky_su_kien dk
                INNER JOIN nguoi_dung nd ON dk.ma_nguoi_dung = nd.ma_nguoi_dung
                WHERE dk.ma_su_kien = @eid
                ORDER BY dk.ngay_dang_ky DESC
            `);

        res.json({
            success: true,
            event_id: id,
            event_title: eventCheck.recordset[0].title,
            export_date: new Date().toISOString(),
            data: result.recordset
        });

    } catch (err) {
        console.error("❌ Lỗi export danh sách đăng ký:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;
