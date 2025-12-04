const jwt = require("jsonwebtoken");
const SECRET = "ECOEVENT_SECRET_KEY";

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Không có token!" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // chứa ma_nguoi_dung
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ!" });
    }
};
