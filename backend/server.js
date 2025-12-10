const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./db");

const authRoutes = require("./routes/auth");
const avatarRoutes = require("./routes/avatar");
const eventRoutes = require("./routes/events");
const eventCountRoutes = require("./routes/eventCount");
const registerRoutes = require("./routes/eventRegister");
const myTicketRoutes = require("./routes/myTickets");
const checkinRoutes = require("./routes/checkin");

const adminRoutes = require("./routes/admin");
const adminEventHistoryRoutes = require("./routes/adminEventHistory");
const adminMessagesRoutes = require("./routes/adminMessages");

const historyRoutes = require("./routes/history");
const qrRoutes = require("./routes/qr");
const messagesRoutes = require("./routes/messages");
const chatRoutes = require("./routes/chat");
const decodeRoutes = require("./routes/decode");
const pointRoutes = require("./routes/points");

const app = express();


// ==============================
// 🔥 FIX CORS (CHUẨN CHO RENDER)
// ==============================
app.use(cors({
  origin: [
    /vercel\.app$/,
    /onrender\.com$/,
    /localhost/
  ],
  credentials: true
}));


// ==============================
// 🟩 BODY PARSER
// ==============================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


// ==============================
// 🟦 STATIC UPLOADS
// ==============================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ==============================
// 🟨 API ROUTES
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/avatar", avatarRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/eventCount", eventCountRoutes);
app.use("/api/event", registerRoutes);
app.use("/api/tickets", myTicketRoutes);
app.use("/api/checkin", checkinRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminEventHistoryRoutes);
app.use("/api/admin", adminMessagesRoutes);
app.use("/api/admin/chat", require("./routes/adminChat"));

app.use("/api/history", historyRoutes);
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/messages", messagesRoutes);
app.use("/api/chat", chatRoutes);

app.use("/api", decodeRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/points", pointRoutes);
app.use("/api/drl", pointRoutes);


// ==============================
// 🚀 START SERVER (CHUẨN RENDER)
// ==============================
const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✨ Server chạy trên PORT ${PORT}`)
    );
  })
  .catch(err => {
    console.error("❌ Lỗi kết nối database:", err);
    process.exit(1);
  });
