const express = require("express");
const router = express.Router();

// Simple decode API used by frontend / tools
// Accepts either:
//  - { qr: "<already decoded string>" }
//  - { image: "<base64 or binary data>" }  (hiện chưa hỗ trợ giải mã, sẽ trả lỗi QR_INVALID)
router.post("/decode", async (req, res) => {
    try {
        const { qr, image } = req.body || {};

        if (qr && typeof qr === "string" && qr.trim()) {
            // Nếu đã có chuỗi QR → trả thẳng về cho client
            return res.json({
                success: true,
                qr: qr.trim(),
            });
        }

        // Chưa triển khai decode từ ảnh trên backend
        if (image) {
            return res.status(400).json({
                success: false,
                code: "QR_INVALID",
                message: "Không thể giải mã QR từ ảnh trên server. Vui lòng gửi chuỗi QR.",
            });
        }

        return res.status(400).json({
            success: false,
            code: "QR_INVALID",
            message: "QR_INVALID",
        });
    } catch (err) {
        console.error("❌ DECODE ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi decode QR",
        });
    }
});

module.exports = router;


