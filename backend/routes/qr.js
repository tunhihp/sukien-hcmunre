const express = require("express");
const router = express.Router();

// Route cũ dùng Python decode + port 5000 đã được loại bỏ.
// Để tránh lỗi 404 cho các client cũ, ta trả về thông báo rõ ràng.
router.post("/upload", async (req, res) => {
    return res.status(410).json({
        success: false,
        code: "QR_UPLOAD_DEPRECATED",
        message: "API /api/qr/upload không còn được hỗ trợ. Vui lòng sử dụng tính năng quét QR trực tiếp trên frontend.",
    });
});

module.exports = router;
