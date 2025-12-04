const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");
const axios = require("axios");

// POST /api/event/register
router.post("/register", async (req, res) => {
    const { ma_su_kien, ma_nguoi_dung } = req.body;

    try {
        const pool = await sql.connect(config);

        // 1) Kiểm tra sự kiện
        const event = await pool.request()
            .input("id", sql.Int, ma_su_kien)
            .query("SELECT * FROM su_kien WHERE id = @id");

        if (event.recordset.length === 0) {
            return res.status(404).json({ message: "Sự kiện không tồn tại!" });
        }

        const eventInfo = event.recordset[0];

        // 2) Kiểm tra capacity (số lượng đã đăng ký)
        const countResult = await pool.request()
            .input("sid", sql.Int, ma_su_kien)
            .query(`
                SELECT COUNT(*) AS so_luong_da_dang_ky
                FROM dang_ky_su_kien
                WHERE ma_su_kien = @sid
            `);

        const soLuongDaDangKy = countResult.recordset[0].so_luong_da_dang_ky;
        if (soLuongDaDangKy >= eventInfo.capacity) {
            return res.status(400).json({ message: "Sự kiện đã đầy! Không thể đăng ký thêm." });
        }

        // 3) Kiểm tra trùng đăng ký
        const check = await pool.request()
            .input("sid", sql.Int, ma_su_kien)
            .input("uid", sql.Int, ma_nguoi_dung)
            .query(`
                SELECT * FROM dang_ky_su_kien
                WHERE ma_su_kien = @sid AND ma_nguoi_dung = @uid
            `);

        if (check.recordset.length > 0) {
            return res.status(400).json({ message: "Bạn đã đăng ký rồi!" });
        }

        // 4) Tạo QR
        const qrValue = `EVENT:${ma_su_kien}|USER:${ma_nguoi_dung}|TIME:${Date.now()}`;

        // 5) Lưu vào DB
        await pool.request()
            .input("sid", sql.Int, ma_su_kien)
            .input("uid", sql.Int, ma_nguoi_dung)
            .input("date", sql.DateTime, new Date())
            .input("qr", sql.NVarChar, qrValue)
            .query(`
                INSERT INTO dang_ky_su_kien 
                    (ma_su_kien, ma_nguoi_dung, ngay_dang_ky, qr_code, check_in)
                VALUES (@sid, @uid, @date, @qr, 0)
            `);

        // TẠO THÔNG BÁO CHO USER
        await pool.request()
            .input("title", sql.NVarChar, "Đăng ký sự kiện thành công")
            .input("content", sql.NVarChar, `Bạn đã đăng ký thành công sự kiện ID ${ma_su_kien}.`)
            .input("uid", sql.Int, ma_nguoi_dung)
            .input("type", sql.NVarChar, "register")
            .input("eid", sql.Int, ma_su_kien)
            .input("icon", sql.NVarChar, "📢")
            .query(`
        INSERT INTO thong_bao (tieu_de, noi_dung, id_nguoi_nhan, loai_thong_bao, id_su_kien, icon, thoi_gian_tao, da_doc)
        VALUES (@title, @content, @uid, @type, @eid, @icon, GETDATE(), 0)
    `);

        return res.json({
            success: true,
            message: "Đăng ký thành công!",
            qr_code: qrValue
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;
