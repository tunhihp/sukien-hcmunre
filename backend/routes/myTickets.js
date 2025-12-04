const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");

/*
=====================================================
   API 1: /api/tickets/my/:user_id  → Lấy vé đã đăng ký
=====================================================
*/
router.get("/my/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const pool = await sql.connect(config);

        const rs = await pool.request()
            .input("uid", sql.Int, user_id)
            .query(`
                SELECT 
                    dk.ma_dang_ky,
                    dk.qr_code,
                    dk.ngay_dang_ky,
                    dk.check_in,
                    dk.thoi_gian_checkin,
                    dk.co_mat,
                    dk.duoc_duyet,
                    dk.diem_cong,

                    sk.id AS ma_su_kien,
                    sk.title,
                    sk.location,
                    sk.date,
                    sk.points
                FROM dang_ky_su_kien dk
                JOIN su_kien sk ON sk.id = dk.ma_su_kien
                WHERE dk.ma_nguoi_dung = @uid
                ORDER BY dk.ngay_dang_ky DESC
            `);

        res.json(rs.recordset);
    } catch (err) {
        console.error("❌ Lỗi /api/tickets/my:", err);
        res.status(500).json({ message: "Lỗi server lấy vé" });
    }
});

/*
=========================================================
   API 2: /api/tickets/history/:user_id  → Lịch sử đã check-in
=========================================================
*/
router.get("/history/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const pool = await sql.connect(config);

        const rs = await pool.request()
            .input("uid", sql.Int, user_id)
            .query(`
                SELECT 
                    dk.ma_dang_ky,
                    dk.thoi_gian_checkin,
                    dk.diem_cong,

                    sk.id AS ma_su_kien,
                    sk.title,
                    sk.location,
                    sk.date,
                    sk.points
                FROM dang_ky_su_kien dk
                JOIN su_kien sk ON sk.id = dk.ma_su_kien
                WHERE dk.ma_nguoi_dung = @uid 
                  AND dk.check_in = 1
                ORDER BY dk.thoi_gian_checkin DESC
            `);

        res.json(rs.recordset);
    } catch (err) {
        console.error("❌ Lỗi /api/tickets/history:", err);
        res.status(500).json({ message: "Lỗi server lịch sử" });
    }
});

module.exports = router;
