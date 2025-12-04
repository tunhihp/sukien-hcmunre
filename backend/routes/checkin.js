// backend/routes/checkin.js
const express = require("express");
const router = express.Router();
const { sql, config } = require("../db");


// ===============================
//  CHECK-IN V1 (CẢI THIỆN) - CHUẨN HÓA QR
// ===============================
router.post("/scan", async (req, res) => {
    try {
        // Yêu cầu mới: body.qr
        let qr = req.body.qr;

        // Hỗ trợ tương thích cũ: body.qr_code
        if (!qr && req.body.qr_code) {
            qr = req.body.qr_code;
        }

        if (!qr || typeof qr !== "string" || !qr.trim()) {
            return res.status(400).json({ success: false, code: "QR_INVALID", message: "QR không hợp lệ" });
        }

        qr = qr.trim();

        // Hỗ trợ linh hoạt các format có chứa EVENT:x và USER:y (với hoặc không có TIME:z)
        // Ví dụ chấp nhận:
        //  - EVENT:5:USER:10
        //  - EVENT:5|USER:10|TIME:123456
        //  - QR-EVENT:5;USER:10;TIME:123456 (miễn là chuỗi có các đoạn EVENT:x, USER:y)
        let eventId;
        let userId;
        let qrTime = null;

        const eventMatch = qr.match(/EVENT:(\d+)/);
        const userMatch = qr.match(/USER:(\d+)/);
        const timeMatch = qr.match(/TIME:(\d+)/);

        if (eventMatch) {
            eventId = parseInt(eventMatch[1]);
        }
        if (userMatch) {
            userId = parseInt(userMatch[1]);
        }
        if (timeMatch) {
            qrTime = parseInt(timeMatch[1]);
        }

        if (!eventId || !userId) {
            return res.status(400).json({ success: false, code: "QR_INVALID", message: "QR không hợp lệ" });
        }
        
        if (Number.isNaN(eventId) || Number.isNaN(userId)) {
            return res.status(400).json({ success: false, code: "QR_INVALID", message: "QR không hợp lệ" });
        }

        const pool = await sql.connect(config);

        // ===== VALIDATION 1: Kiểm tra QR expired (nếu có TIME) =====
        if (qrTime) {
            const now = Date.now();
            const qrAge = now - qrTime; // milliseconds
            const maxAge = 24 * 60 * 60 * 1000; // 24 giờ
            
            if (qrAge > maxAge) {
                console.log(`❌ QR expired: Age=${qrAge}ms, Max=${maxAge}ms`);
                return res.status(400).json({
                    success: false,
                    code: "QR_EXPIRED",
                    message: "QR code đã hết hạn! Vui lòng tải lại QR code mới."
                });
            }
        }

        // ===== VALIDATION 2: Kiểm tra sự kiện có tồn tại và lấy thông tin =====
        const eventCheck = await pool.request()
            .input("eid", sql.Int, eventId)
            .query(`SELECT id, title, date FROM su_kien WHERE id = @eid`);

        if (eventCheck.recordset.length === 0) {
            return res.status(404).json({ success: false, code: "EVENT_NOT_FOUND", message: "Sự kiện không tồn tại!" });
        }

        const eventInfo = eventCheck.recordset[0];

        // ===== VALIDATION 3: Kiểm tra event date (chỉ check-in trong khoảng hợp lệ) =====
        if (eventInfo.date) {
            const eventDate = new Date(eventInfo.date);
            const now = new Date();
            const oneDayBefore = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
            const oneDayAfter = new Date(eventDate.getTime() + 24 * 60 * 60 * 1000);

            if (now < oneDayBefore) {
                return res.status(400).json({
                    success: false,
                    code: "CHECKIN_TOO_EARLY",
                    message: `Chưa đến thời gian check-in! Sự kiện diễn ra vào ${eventDate.toLocaleString('vi-VN')}.`
                });
            }

            if (now > oneDayAfter) {
                return res.status(400).json({
                    success: false,
                    code: "CHECKIN_TOO_LATE",
                    message: `Đã quá thời gian check-in! Sự kiện đã kết thúc vào ${eventDate.toLocaleString('vi-VN')}.`
                });
            }
        }

        // ===== VALIDATION 4: Kiểm tra vé đăng ký =====
        const rs = await pool.request()
            .input("uid", sql.Int, userId)
            .input("eid", sql.Int, eventId)
            .query(`SELECT * FROM dang_ky_su_kien WHERE ma_nguoi_dung=@uid AND ma_su_kien=@eid`);

        if (rs.recordset.length === 0) {
            return res.status(404).json({ success: false, code: "TICKET_NOT_FOUND", message: "Không tìm thấy vé đăng ký cho sự kiện này!" });
        }

        const ticket = rs.recordset[0];
        
        // ===== VALIDATION 5: Kiểm tra đã check-in chưa =====
        if (ticket.check_in === true || ticket.check_in === 1 || ticket.check_in === '1') {
            return res.status(400).json({ success: false, code: "ALREADY_CHECKED_IN", message: "Vé đã được điểm danh rồi!" });
        }

        // Atomic update để chống double check-in
        const updateResult = await pool.request()
            .input("id", sql.Int, ticket.ma_dang_ky)
            .query(`
                UPDATE dang_ky_su_kien
                SET check_in = 1, 
                    thoi_gian_checkin = GETDATE(),
                    diem_cong = 5
                WHERE ma_dang_ky = @id AND check_in = 0;
                
                SELECT check_in FROM dang_ky_su_kien WHERE ma_dang_ky = @id;
            `);

        const newState = updateResult.recordset[0]?.check_in;
        // Kiểm tra nếu check_in vẫn là 0 (chưa được update)
        if (!newState || newState === 0 || newState === false || newState === '0') {
            return res.json({ success: false, code: "ALREADY_CHECKED_IN", message: "Vé đã được điểm danh trước đó!" });
        }

        // Cập nhật điểm rèn luyện với điều kiện hoc_ky/nam_hoc
        await pool.request()
            .input("uid", sql.Int, userId)
            .input("hky", sql.NVarChar, "1")
            .input("nh", sql.NVarChar, "2025")
            .query(`
                MERGE diem_ren_luyen AS target
                USING (SELECT @uid AS ma_nguoi_dung, @hky AS hoc_ky, @nh AS nam_hoc) AS src
                ON target.ma_nguoi_dung = src.ma_nguoi_dung
                   AND target.hoc_ky = src.hoc_ky
                   AND target.nam_hoc = src.nam_hoc
                WHEN MATCHED THEN
                    UPDATE SET tong_diem = tong_diem + 5, cap_nhat_cuoi = GETDATE()
                WHEN NOT MATCHED THEN
                    INSERT (ma_nguoi_dung, hoc_ky, nam_hoc, tong_diem, cap_nhat_cuoi)
                    VALUES (@uid, @hky, @nh, 5, GETDATE());
            `);

        // 🔔 GỬI THÔNG BÁO (thêm vào, không phá chức năng)
        try {
            await pool.request()
                .input("title", sql.NVarChar, "Điểm danh thành công")
                .input("content", sql.NVarChar, `Bạn đã điểm danh sự kiện "${eventInfo.title || eventId}".`)
                .input("uid", sql.Int, userId)
                .input("type", sql.NVarChar, "checkin")
                .input("eid", sql.Int, eventId)
                .input("icon", sql.NVarChar, "✔️")
                .query(`
                    INSERT INTO thong_bao (tieu_de, noi_dung, id_nguoi_nhan, loai_thong_bao, id_su_kien, icon, thoi_gian_tao, da_doc)
                    VALUES (@title, @content, @uid, @type, @eid, @icon, GETDATE(), 0)
                `);
        } catch (notiErr) {
            console.error("⚠️ Lỗi gửi thông báo (không ảnh hưởng check-in):", notiErr);
        }

        console.log(`✅ Check-in thành công: User ${userId} - Event ${eventId} - Ticket ${ticket.ma_dang_ky}`);
        return res.json({
            success: true,
            message: "CHECKIN_OK",
            event_title: eventInfo.title,
            checkin_time: new Date().toISOString()
        });

    } catch (err) {
        console.error("❌ CHECKIN ERROR:", err);
        return res.status(500).json({ success: false, message: "Lỗi server khi xử lý check-in!" });
    }
});


// ==============================================
//  CHECK-IN SAFE V2 (AN TOÀN, CORRECT, KHÔNG DOUBLE)
// ==============================================
router.post("/scan-safe", async (req, res) => {
    try {
        const { qr_code } = req.body;
        if (!qr_code) return res.status(400).json({ success: false, message: "QR trống!" });

        const match = qr_code.match(/^EVENT:(\d+)\|USER:(\d+)\|TIME:(\d+)$/);
        if (!match) return res.status(400).json({ success: false, message: "QR sai định dạng chuẩn! Cần format: EVENT:id|USER:id|TIME:timestamp" });

        const eventId = parseInt(match[1]);
        const userId = parseInt(match[2]);
        const qrTime = parseInt(match[3]);

        if (Number.isNaN(eventId) || Number.isNaN(userId) || Number.isNaN(qrTime)) {
            return res.status(400).json({ success: false, message: "QR không hợp lệ! ID hoặc timestamp không đúng." });
        }

        const pool = await sql.connect(config);

        // ===== VALIDATION 1: Kiểm tra QR expired =====
        const now = Date.now();
        const qrAge = now - qrTime; // milliseconds
        const maxAge = 24 * 60 * 60 * 1000; // 24 giờ
        
        if (qrAge > maxAge) {
            console.log(`❌ QR expired: Age=${qrAge}ms, Max=${maxAge}ms`);
            return res.status(400).json({ 
                success: false, 
                message: "QR code đã hết hạn! Vui lòng tải lại QR code mới." 
            });
        }

        // ===== VALIDATION 2: Kiểm tra sự kiện có tồn tại và lấy thông tin =====
        const eventCheck = await pool.request()
            .input("eid", sql.Int, eventId)
            .query(`SELECT id, title, date FROM su_kien WHERE id = @eid`);

        if (eventCheck.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Sự kiện không tồn tại!" });
        }

        const eventInfo = eventCheck.recordset[0];

        // ===== VALIDATION 3: Kiểm tra event date =====
        if (eventInfo.date) {
            const eventDate = new Date(eventInfo.date);
            const oneDayBefore = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
            const oneDayAfter = new Date(eventDate.getTime() + 24 * 60 * 60 * 1000);

            if (now < oneDayBefore.getTime()) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Chưa đến thời gian check-in! Sự kiện diễn ra vào ${eventDate.toLocaleString('vi-VN')}.` 
                });
            }

            if (now > oneDayAfter.getTime()) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Đã quá thời gian check-in! Sự kiện đã kết thúc vào ${eventDate.toLocaleString('vi-VN')}.` 
                });
            }
        }

        // ===== VALIDATION 4: Kiểm tra vé đăng ký =====
        const rs = await pool.request()
            .input("uid", sql.Int, userId)
            .input("eid", sql.Int, eventId)
            .query(`SELECT TOP 1 * FROM dang_ky_su_kien WHERE ma_nguoi_dung=@uid AND ma_su_kien=@eid`);

        if (rs.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Không có vé tham gia sự kiện này!" });
        }

        const ticket = rs.recordset[0];

        // ===== VALIDATION 5: Kiểm tra đã check-in chưa =====
        if (ticket.check_in === true || ticket.check_in === 1 || ticket.check_in === '1') {
            return res.status(400).json({ success: false, message: "Vé đã được check-in trước đó!" });
        }

        // ===== ATOMIC CHECK-IN (chống double scan) =====
        const updateResult = await pool.request()
            .input("id", sql.Int, ticket.ma_dang_ky)
            .query(`
                UPDATE dang_ky_su_kien
                SET check_in = 1, 
                    thoi_gian_checkin = GETDATE(),
                    diem_cong = 5
                WHERE ma_dang_ky=@id AND check_in=0;

                SELECT check_in FROM dang_ky_su_kien WHERE ma_dang_ky=@id;
            `);

        const newState = updateResult.recordset[0]?.check_in;

        // Kiểm tra nếu check_in vẫn là 0 (chưa được update)
        if (!newState || newState === 0 || newState === false || newState === '0') {
            return res.status(400).json({ success: false, message: "Vé đã check-in trước đó!" });
        }

        // ==== Cập nhật điểm V2 ====
        const newScore = await updateTrainingPointSafe(userId);

        // 🔔 GỬI THÔNG BÁO
        try {
            await pool.request()
                .input("title", sql.NVarChar, "Điểm danh thành công")
                .input("content", sql.NVarChar, `Bạn đã điểm danh sự kiện "${eventInfo.title || eventId}".`)
                .input("uid", sql.Int, userId)
                .input("type", sql.NVarChar, "checkin")
                .input("eid", sql.Int, eventId)
                .input("icon", sql.NVarChar, "✔️")
                .query(`
                    INSERT INTO thong_bao (tieu_de, noi_dung, id_nguoi_nhan, loai_thong_bao, id_su_kien, icon, thoi_gian_tao, da_doc)
                    VALUES (@title, @content, @uid, @type, @eid, @icon, GETDATE(), 0)
                `);
        } catch (notiErr) {
            console.error("⚠️ Lỗi gửi thông báo (không ảnh hưởng check-in):", notiErr);
        }

        console.log(`✅ Check-in SAFE thành công: User ${userId} - Event ${eventId} - Ticket ${ticket.ma_dang_ky}`);

        return res.json({
            success: true,
            message: "Điểm danh thành công!",
            event_title: eventInfo.title,
            tong_diem_moi: newScore,
            checkin_time: new Date().toISOString()
        });

    } catch (err) {
        console.error("❌ CHECKIN SAFE ERROR:", err);
        return res.status(500).json({ success: false, message: "Lỗi server khi xử lý check-in!" });
    }
});


// ===================================
//  V2: Cập nhật điểm rèn luyện an toàn
// ===================================
async function updateTrainingPointSafe(userId) {
    const pool = await sql.connect(config);

    await pool.request()
        .input("uid", sql.Int, userId)
        .input("hky", sql.NVarChar, "1")
        .input("nh", sql.NVarChar, "2025")
        .query(`
            MERGE diem_ren_luyen AS target
            USING (SELECT @uid AS ma_nguoi_dung, @hky AS hoc_ky, @nh AS nam_hoc) AS src
            ON target.ma_nguoi_dung = src.ma_nguoi_dung
               AND target.hoc_ky = src.hoc_ky
               AND target.nam_hoc = src.nam_hoc
            WHEN MATCHED THEN
                UPDATE SET tong_diem = tong_diem + 5, cap_nhat_cuoi = GETDATE()
            WHEN NOT MATCHED THEN
                INSERT (ma_nguoi_dung, hoc_ky, nam_hoc, tong_diem, cap_nhat_cuoi)
                VALUES (@uid, @hky, @nh, 5, GETDATE());
        `);

    const result = await pool.request()
        .input("uid", sql.Int, userId)
        .query(`SELECT tong_diem FROM diem_ren_luyen WHERE ma_nguoi_dung=@uid`);

    return result.recordset[0]?.tong_diem || 0;
}

module.exports = router;
