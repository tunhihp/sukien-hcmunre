const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");

router.get("/count/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);

        const rs = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT  
                    (SELECT COUNT(*) 
                     FROM dang_ky_su_kien 
                     WHERE ma_su_kien = @id) AS registered,

                    (SELECT capacity 
                     FROM su_kien 
                     WHERE id = @id) AS capacity
            `);

        res.json(rs.recordset[0]);

    } catch (err) {
        console.error("❌ Lỗi API /event/count:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;
