const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");

// ========== LẤY DANH SÁCH NGƯỜI DÙNG ==========
router.get("/users", async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const rs = await pool.request().query(`
            SELECT 
                ma_nguoi_dung,
                ho_ten,
                mssv,
                lop,
                email,
                sdt,
                vai_tro,
                ma_nganh,
                ma_khoa
            FROM nguoi_dung
            ORDER BY ma_nguoi_dung DESC
        `);

        res.json(rs.recordset);

    } catch (err) {
        console.error("❌ Lỗi ADMIN /users:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
});


// ========== LẤY LỊCH SỬ CHECK-IN ==========
router.get("/history", async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const rs = await pool.request().query(`
            SELECT 
                dk.thoi_gian_checkin,
                dk.diem_cong,
                nd.ho_ten,
                nd.mssv,
                nd.lop,
                sk.title AS ten_su_kien
            FROM dang_ky_su_kien dk
            JOIN nguoi_dung nd ON nd.ma_nguoi_dung = dk.ma_nguoi_dung
            JOIN su_kien sk ON sk.id = dk.ma_su_kien
            WHERE dk.check_in = 1
            ORDER BY dk.thoi_gian_checkin DESC
        `);

        res.json(rs.recordset);

    } catch (err) {
        console.error("❌ Lỗi ADMIN /history:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
});


module.exports = router;
