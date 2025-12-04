// backend/routes/points.js
// Reward Points (DRL) Management APIs
const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");
const authMiddleware = require("../middleware/auth");

// ============================================
// GET /api/points/:user_id - Lấy điểm rèn luyện của user
// ============================================
router.get("/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const pool = await sql.connect(config);

        const rs = await pool.request()
            .input("uid", sql.Int, user_id)
            .query(`
                SELECT TOP 1 tong_diem, cap_nhat_cuoi, hoc_ky, nam_hoc
                FROM diem_ren_luyen
                WHERE ma_nguoi_dung = @uid
                ORDER BY nam_hoc DESC, hoc_ky DESC, cap_nhat_cuoi DESC
            `);

        if (rs.recordset.length === 0) {
            return res.json({
                tong_diem: 0,
                cap_nhat_cuoi: null,
                hoc_ky: null,
                nam_hoc: null
            });
        }

        res.json(rs.recordset[0]);

    } catch (err) {
        console.error("❌ POINTS ERROR:", err);
        res.status(500).json({ message: "Lỗi server điểm rèn luyện!" });
    }
});

// ============================================
// GET /api/drl/user/:id - Alias cho /api/points/:user_id
// ============================================
router.get("/drl/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);

        const rs = await pool.request()
            .input("uid", sql.Int, id)
            .query(`
                SELECT TOP 1 tong_diem, cap_nhat_cuoi, hoc_ky, nam_hoc
                FROM diem_ren_luyen
                WHERE ma_nguoi_dung = @uid
                ORDER BY nam_hoc DESC, hoc_ky DESC, cap_nhat_cuoi DESC
            `);

        if (rs.recordset.length === 0) {
            return res.json({
                tong_diem: 0,
                cap_nhat_cuoi: null,
                hoc_ky: null,
                nam_hoc: null
            });
        }

        res.json(rs.recordset[0]);

    } catch (err) {
        console.error("❌ DRL GET ERROR:", err);
        res.status(500).json({ message: "Lỗi server điểm rèn luyện!" });
    }
});

// ============================================
// POST /api/drl/update - Admin cập nhật điểm rèn luyện thủ công
// ============================================
router.post("/drl/update", authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Chỉ admin mới được cập nhật điểm rèn luyện!" });
        }

        const { user_id, hoc_ky, nam_hoc, tong_diem, action } = req.body;

        // Validation
        if (!user_id || Number.isNaN(parseInt(user_id))) {
            return res.status(400).json({ success: false, message: "ID người dùng không hợp lệ!" });
        }

        if (!hoc_ky || !nam_hoc) {
            return res.status(400).json({ success: false, message: "Học kỳ và năm học không được để trống!" });
        }

        const pool = await sql.connect(config);

        // Kiểm tra user có tồn tại không
        const userCheck = await pool.request()
            .input("uid", sql.Int, user_id)
            .query(`SELECT ma_nguoi_dung FROM nguoi_dung WHERE ma_nguoi_dung = @uid`);

        if (userCheck.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng!" });
        }

        // Xử lý cập nhật điểm
        if (action === "set") {
            // Set điểm cụ thể
            if (tong_diem === undefined || Number.isNaN(parseInt(tong_diem))) {
                return res.status(400).json({ success: false, message: "Tổng điểm không hợp lệ!" });
            }

            await pool.request()
                .input("uid", sql.Int, user_id)
                .input("hky", sql.NVarChar, hoc_ky)
                .input("nh", sql.NVarChar, nam_hoc)
                .input("diem", sql.Int, parseInt(tong_diem))
                .query(`
                    MERGE diem_ren_luyen AS target
                    USING (SELECT @uid AS ma_nguoi_dung, @hky AS hoc_ky, @nh AS nam_hoc) AS src
                    ON target.ma_nguoi_dung = src.ma_nguoi_dung
                       AND target.hoc_ky = src.hoc_ky
                       AND target.nam_hoc = src.nam_hoc
                    WHEN MATCHED THEN
                        UPDATE SET tong_diem = @diem, cap_nhat_cuoi = GETDATE()
                    WHEN NOT MATCHED THEN
                        INSERT (ma_nguoi_dung, hoc_ky, nam_hoc, tong_diem, cap_nhat_cuoi)
                        VALUES (@uid, @hky, @nh, @diem, GETDATE());
                `);

        } else if (action === "add") {
            // Cộng thêm điểm
            const diemCong = parseInt(tong_diem) || 0;
            if (diemCong === 0) {
                return res.status(400).json({ success: false, message: "Số điểm cộng không hợp lệ!" });
            }

            await pool.request()
                .input("uid", sql.Int, user_id)
                .input("hky", sql.NVarChar, hoc_ky)
                .input("nh", sql.NVarChar, nam_hoc)
                .input("diem", sql.Int, diemCong)
                .query(`
                    MERGE diem_ren_luyen AS target
                    USING (SELECT @uid AS ma_nguoi_dung, @hky AS hoc_ky, @nh AS nam_hoc) AS src
                    ON target.ma_nguoi_dung = src.ma_nguoi_dung
                       AND target.hoc_ky = src.hoc_ky
                       AND target.nam_hoc = src.nam_hoc
                    WHEN MATCHED THEN
                        UPDATE SET tong_diem = tong_diem + @diem, cap_nhat_cuoi = GETDATE()
                    WHEN NOT MATCHED THEN
                        INSERT (ma_nguoi_dung, hoc_ky, nam_hoc, tong_diem, cap_nhat_cuoi)
                        VALUES (@uid, @hky, @nh, @diem, GETDATE());
                `);

        } else {
            return res.status(400).json({ success: false, message: "Action không hợp lệ! Chỉ chấp nhận 'set' hoặc 'add'." });
        }

        // Lấy điểm mới sau khi cập nhật
        const newPoints = await pool.request()
            .input("uid", sql.Int, user_id)
            .input("hky", sql.NVarChar, hoc_ky)
            .input("nh", sql.NVarChar, nam_hoc)
            .query(`
                SELECT tong_diem, cap_nhat_cuoi, hoc_ky, nam_hoc
                FROM diem_ren_luyen
                WHERE ma_nguoi_dung = @uid AND hoc_ky = @hky AND nam_hoc = @nh
            `);

        console.log(`✅ DRL updated: User ${user_id} - Action: ${action} - New points: ${newPoints.recordset[0]?.tong_diem || 0}`);

        res.json({
            success: true,
            message: `Cập nhật điểm rèn luyện thành công!`,
            data: newPoints.recordset[0] || null
        });

    } catch (err) {
        console.error("❌ DRL UPDATE ERROR:", err);
        res.status(500).json({ success: false, message: "Lỗi server khi cập nhật điểm rèn luyện!" });
    }
});

// ============================================
// GET /api/points/summary - Tổng quan điểm rèn luyện
// ============================================
router.get("/summary", async (_req, res) => {
    try {
        const pool = await sql.connect(config);

        const semesterQuery = await pool.request().query(`
            SELECT nam_hoc, hoc_ky, SUM(tong_diem) AS total_points
            FROM diem_ren_luyen
            GROUP BY nam_hoc, hoc_ky
            ORDER BY TRY_CAST(nam_hoc AS INT) DESC, hoc_ky DESC
        `);

        const topStudentsQuery = await pool.request().query(`
            SELECT TOP 6 
                nd.ho_ten,
                nd.lop,
                drl.tong_diem
            FROM diem_ren_luyen drl
            INNER JOIN nguoi_dung nd ON drl.ma_nguoi_dung = nd.ma_nguoi_dung
            ORDER BY drl.tong_diem DESC, nd.ho_ten ASC
        `);

        const semesterSeries = semesterQuery.recordset.map((row) => ({
            label: `HK${row.hoc_ky} ${row.nam_hoc}`,
            value: row.total_points || 0
        }));

        const totalPoints = semesterSeries.reduce((sum, item) => sum + (item.value || 0), 0);

        res.json({
            success: true,
            totalPoints,
            semesterSeries,
            topStudents: topStudentsQuery.recordset || []
        });

    } catch (err) {
        console.error("❌ DRL SUMMARY ERROR:", err);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy tổng quan điểm rèn luyện!" });
    }
});

module.exports = router;

