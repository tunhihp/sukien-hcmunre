const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");

// LỊCH SỬ CHECK-IN + CỘNG ĐIỂM
router.get("/history", async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const rs = await pool.request().query(`
            SELECT 
                dk.ma_dang_ky,
                nd.ho_ten,
                nd.mssv,
                nd.lop,
                sk.title AS ten_su_kien,
                dk.diem_cong,
                dk.thoi_gian_checkin
            FROM dang_ky_su_kien dk
            JOIN nguoi_dung nd ON dk.ma_nguoi_dung = nd.ma_nguoi_dung
            JOIN su_kien sk ON dk.ma_su_kien = sk.id
            WHERE dk.check_in = 1
            ORDER BY dk.thoi_gian_checkin DESC
        `);

        res.json(rs.recordset);

    } catch (err) {
        console.error("❌ Lỗi ADMIN history:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;
