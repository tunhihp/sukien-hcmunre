const express = require("express");
const multer = require("multer");
const { sql, connectDB } = require("../db");

const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/avatars",
    filename: (req, file, cb) => {
        cb(null, Date.now() + ".jpg");
    },
});

const upload = multer({ storage });

router.post("/upload", upload.single("avatar"), async (req, res) => {
    try {
        const { userId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Không nhận được file!" });
        }

        const avatarPath = "/uploads/avatars/" + req.file.filename;

        const pool = await connectDB();

        await pool.request()
            .input("id", sql.Int, userId)
            .input("avatar", sql.NVarChar, avatarPath)
            .query(`UPDATE nguoi_dung SET avatar = @avatar WHERE ma_nguoi_dung = @id`);

        return res.json({
            success: true,
            avatar: avatarPath
        });

    } catch (err) {
        console.error("❌ Lỗi update avatar:", err);
        res.status(500).json({ message: "Lỗi server khi update avatar" });
    }
});

module.exports = router;
