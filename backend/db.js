const sql = require("mssql");

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,     // ví dụ: my-sql-host.database.windows.net
    database: process.env.DB_NAME,
    options: {
        encrypt: true,                 // nếu dùng Azure/AWS thì nên để true
        trustServerCertificate: true,
        enableArithAbort: true,
        useUTC: true,
        connectionIsolationLevel: sql.ISOLATION_LEVEL.READ_COMMITTED,
        tdsVersion: "7_4"
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
