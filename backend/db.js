const sql = require("mssql");

const config = {
    user: "sa",
    password: "123456",
    server: "localhost",
    database: "EcoEventHCMUNRE",
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        useUTC: true,
        connectionIsolationLevel: sql.ISOLATION_LEVEL.READ_COMMITTED,
        tdsVersion: "7_4"      // ⭐ GIỮ UNICODE CHUẨN, KHÔNG LỖI "Đ"
    }
};

async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log("✔ SQL Server connected");
        return pool;
    } catch (err) {
        console.error("❌ SQL Error:", err);
        throw err;
    }
}

module.exports = { sql, connectDB, config };
