const express = require("express");
const router = express.Router();
const { sql, connectDB } = require("../db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("path");
const SECRET = "ECOEVENT_SECRET_KEY";
const upload = require("../middleware/upload");

/* =========================================================
   1️⃣ Cấu hình Gmail gửi OTP
========================================================= */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tunhihp@gmail.com",
        pass: "iqzg gart imwh ivhz"
    }
});

transporter.verify((err) => {
    if (err) console.log("❌ SMTP lỗi:", err);
    else console.log("✔ Gmail OTP sẵn sàng!");
});

/* =========================================================
   3️⃣ API ĐĂNG KÝ + GỬI OTP
========================================================= */
router.post("/register", async (req, res) => {
    const { ho_ten, email, mat_khau, vai_tro, ma_nganh, ma_khoa, lop, sdt, mssv } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        const pool = await connectDB();

        const check = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT ma_nguoi_dung FROM nguoi_dung WHERE email = @email");

        if (check.recordset.length > 0) {
            return res.status(400).json({ message: "Email này đã được đăng ký." });
        }

        await pool.request()
            .input("ho_ten", sql.NVarChar, ho_ten)
            .input("email", sql.VarChar, email)
            .input("mat_khau", sql.VarChar, mat_khau)
            .input("vai_tro", sql.NVarChar, vai_tro || "sinhvien")
            .input("ma_nganh", sql.VarChar, ma_nganh)
            .input("ma_khoa", sql.VarChar, ma_khoa)
            .input("lop", sql.VarChar, lop)
            .input("sdt", sql.VarChar, sdt)
            .input("mssv", sql.VarChar, mssv)
            .input("otp_code", sql.Int, otp)
            .query(`
                INSERT INTO nguoi_dung 
                (ho_ten, email, mat_khau, vai_tro, ma_nganh, ma_khoa, lop, sdt, mssv,
                ngay_tao, otp_code, otp_expire, is_verified)
                VALUES (
                    @ho_ten, @email, @mat_khau, @vai_tro, @ma_nganh, @ma_khoa, @lop, @sdt, @mssv,
                    GETDATE(), @otp_code, 
                    DATEADD(MINUTE, 5, DATEADD(HOUR, 7, GETUTCDATE())),
                    0
                )
            `);

        await transporter.sendMail({
            from: "EcoEvent HCMUNRE <tunhihp@gmail.com>",
            to: email,
            subject: "Mã OTP xác thực tài khoản EcoEvent",
            text: `Mã OTP của bạn là: ${otp}. Có hiệu lực 5 phút.`
        });

        res.json({ success: true, message: "Đăng ký thành công! Vui lòng kiểm tra email." });

    } catch (err) {
        console.log("❌ Lỗi Register:", err);
        res.status(500).json({ message: "Lỗi server đăng ký." });
    }
});

/* =========================================================
   4️⃣ API XÁC THỰC OTP
========================================================= */
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    try {
        const pool = await connectDB();

        const rs = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT otp_code, otp_expire FROM nguoi_dung WHERE email = @email");

        if (rs.recordset.length === 0)
            return res.status(400).json({ message: "Email không tồn tại!" });

        const user = rs.recordset[0];

        if (user.otp_code !== parseInt(otp))
            return res.status(400).json({ message: "OTP sai!" });

        if (new Date() > new Date(user.otp_expire))
            return res.status(400).json({ message: "OTP đã hết hạn!" });

        await pool.request()
            .input("email", sql.VarChar, email)
            .query("UPDATE nguoi_dung SET is_verified = 1 WHERE email = @email");

        res.json({ success: true, message: "Xác thực OTP thành công!" });

    } catch (err) {
        console.log("❌ Lỗi OTP:", err);
        res.status(500).json({ message: "Lỗi server OTP." });
    }
});

/* =========================================================
   5️⃣ API ĐĂNG NHẬP
========================================================= */
router.post("/login", async (req, res) => {
    const { email, mat_khau } = req.body;

    try {
        const pool = await connectDB();

        const rs = await pool.request()
            .input("email", sql.VarChar, email)
            .query(`
                SELECT 
                        ma_nguoi_dung,
                        ho_ten,
                        email,
                        lop,
                        mssv,
                        sdt,
                        vai_tro,
                        avatar,
                        mat_khau,
                        is_verified
                    FROM nguoi_dung
                    WHERE email = @email

            `);

        if (rs.recordset.length === 0)
            return res.status(400).json({ message: "Email không tồn tại!" });

        const user = rs.recordset[0];

        if (user.mat_khau !== mat_khau)
            return res.status(400).json({ message: "Sai mật khẩu!" });

        if (!user.is_verified)
            return res.status(400).json({ message: "Tài khoản chưa xác thực OTP!" });

        const token = jwt.sign(
            { id: user.ma_nguoi_dung, role: user.vai_tro },
            SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            message: "Đăng nhập thành công!",
            token,
            user: {
                ma_nguoi_dung: user.ma_nguoi_dung,
                ho_ten: user.ho_ten,
                email: user.email,
                lop: user.lop,
                mssv: user.mssv,
                sdt: user.sdt,
                vai_tro: user.vai_tro,
                avatar:
                    (!user.avatar || user.avatar === "NULL" || user.avatar === "null")
                        ? "/uploads/avatars/default.png"
                        : (user.avatar.startsWith("/") ? user.avatar : "/" + user.avatar)
            }
        });

    } catch (err) {
        console.log("❌ Lỗi Login:", err);
        res.status(500).json({ message: "Lỗi server đăng nhập." });
    }
});

/* =========================================================
   6️⃣ API ĐỔI MẬT KHẨU
========================================================= */
router.post("/change-password", async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        const pool = await connectDB();

        const rs = await pool.request()
            .input("userId", sql.Int, userId)
            .query("SELECT mat_khau FROM nguoi_dung WHERE ma_nguoi_dung = @userId");

        if (rs.recordset.length === 0)
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });

        const currentPw = rs.recordset[0].mat_khau;

        if (currentPw !== oldPassword)
            return res.status(400).json({ message: "Mật khẩu cũ không đúng!" });

        await pool.request()
            .input("newPassword", sql.VarChar, newPassword)
            .input("userId", sql.Int, userId)
            .query("UPDATE nguoi_dung SET mat_khau = @newPassword WHERE ma_nguoi_dung = @userId");

        res.json({ success: true, message: "Đổi mật khẩu thành công!" });

    } catch (err) {
        console.log("❌ Lỗi Change Password:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

/* =========================================================
   🔄 API QUÊN MẬT KHẨU - GỬI MẬT KHẨU MỚI QUA GMAIL
========================================================= */
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const pool = await connectDB();

        // 1) Kiểm tra email có tồn tại trong hệ thống
        const rs = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT ma_nguoi_dung FROM nguoi_dung WHERE email = @email");

        if (rs.recordset.length === 0) {
            return res.status(400).json({ message: "Gmail của bạn chưa đăng ký!" });
        }

        // 2) Tạo mật khẩu mới ngẫu nhiên 8 ký tự
        const newPassword = Math.random().toString(36).slice(-8);

        // 3) Cập nhật mật khẩu mới vào database
        await pool.request()
            .input("email", sql.VarChar, email)
            .input("mat_khau", sql.VarChar, newPassword)
            .query(`
                UPDATE nguoi_dung
                SET mat_khau = @mat_khau
                WHERE email = @email
            `);

        // 4) Gửi mật khẩu mới qua email
        await transporter.sendMail({
            from: "EcoEvent HCMUNRE <tunhihp@gmail.com>",
            to: email,
            subject: "Mật khẩu mới của bạn - EcoEvent",
            html: `
                <h3>Xin chào!</h3>
                <p>Bạn vừa yêu cầu lấy lại mật khẩu tài khoản EcoEvent.</p>
                <p>Dưới đây là mật khẩu mới của bạn:</p>
                <div style="
                    background:#f1f5f9;
                    padding:10px;
                    border-radius:8px;
                    display:inline-block;
                    font-size:20px;
                    font-weight:bold;
                ">
                    ${newPassword}
                </div>
                <p>Hãy đăng nhập và đổi lại mật khẩu ngay khi có thể.</p>
            `
        });

        return res.json({
            success: true,
            message: "Mật khẩu mới đã được gửi vào Gmail của bạn!"
        });

    } catch (err) {
        console.log("❌ Lỗi Forgot Password:", err);
        return res.status(500).json({ message: "Lỗi server khi lấy lại mật khẩu!" });
    }
});

module.exports = router;
