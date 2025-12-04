const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");

router.get("/:uid", async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const rs = await pool.request()
            .input("uid", sql.Int, req.params.uid)
            .query(`
                SELECT 
                    dk.ma_dang_ky,
                    sk.title,
                    sk.location,
                    sk.date,
                    sk.points,
                    dk.thoi_gian_checkin,
                    dk.diem_cong
                FROM dang_ky_su_kien dk
                JOIN su_kien sk ON sk.id = dk.ma_su_kien
                WHERE dk.ma_nguoi_dung = @uid AND dk.check_in = 1
                ORDER BY dk.thoi_gian_checkin DESC
            `);

        res.json(rs.recordset);

    } catch (err) {
        console.log("History error:", err);
        res.status(500).json({ message: "Lỗi tải lịch sử!" });
    }
});

module.exports = router;
