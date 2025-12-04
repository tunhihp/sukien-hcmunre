// src/pages/admin/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const pageGradient = "linear-gradient(to bottom, #e3f2fd, #bbdefb)";

const donutColors = [
    "#38bdf8",
    "#60a5fa",
    "#93c5fd",
    "#0ea5e9",
    "#bfdbfe"
];

const numberFormatter = new Intl.NumberFormat("vi-VN");


function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalRegistrations: 0 });
    const [facultySeries, setFacultySeries] = useState([]);
    const [eventSeries, setEventSeries] = useState([]);
    const [pointsSummary, setPointsSummary] = useState({ totalPoints: 0, semesterSeries: [], topStudents: [] });
    const [latestEvents, setLatestEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const safeFetch = async (url) => {
            try {
                const res = await fetch(url, { headers });
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                return res.json();
            } catch (err) {
                console.error("⚠️ Dashboard fetch error:", url, err);
                return null;
            }
        };

        const [usersDataRaw, eventsDataRaw, pointsSummaryRaw] = await Promise.all([
            safeFetch("http://localhost:3001/api/admin/users"),
            safeFetch("http://localhost:3001/api/events"),
            safeFetch("http://localhost:3001/api/points/summary")
        ]);

        if (!usersDataRaw && !eventsDataRaw && !pointsSummaryRaw) {
            setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");
            setLoading(false);
            return;
        }

        const users = Array.isArray(usersDataRaw) ? usersDataRaw : [];
        const events = Array.isArray(eventsDataRaw) ? eventsDataRaw : [];
        const points = pointsSummaryRaw?.success
            ? pointsSummaryRaw
            : { totalPoints: 0, semesterSeries: [], topStudents: [] };

        const facultyMap = users.reduce((acc, user) => {
            const faculty = (user.ma_khoa || user.ma_nganh || "Khác").trim();
            acc[faculty] = (acc[faculty] || 0) + 1;
            return acc;
        }, {});

        const facultyData = Object.entries(facultyMap)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);

        const totalRegistrations = events.reduce((sum, evt) => sum + (evt.attendees || 0), 0);

        const eventPie = events
            .filter((evt) => (evt.attendees || 0) > 0)
            .sort((a, b) => (b.attendees || 0) - (a.attendees || 0))
            .slice(0, 5)
            .map((evt) => ({
                label: evt.title,
                value: evt.attendees || 0,
            }));

        if (eventPie.length === 0 && events.length > 0) {
            eventPie.push({
                label: events[0].title,
                value: events[0].attendees || 0,
            });
        }

        setStats({
            totalUsers: users.length,
            totalEvents: events.length,
            totalRegistrations,
        });
        setFacultySeries(facultyData);
        setEventSeries(eventPie);
        setPointsSummary({
            totalPoints: points.totalPoints || 0,
            semesterSeries: points.semesterSeries || [],
            topStudents: points.topStudents || [],
        });
        setLatestEvents(events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));
        setLoading(false);
    };

    const highlightCards = useMemo(() => ([
        {
            label: "Sinh viên đã tạo tài khoản",
            value: stats.totalUsers,
            caption: facultySeries[0] ? `${facultySeries[0].label} đang dẫn đầu` : "Chưa có thống kê",
            accent: "#c084fc"
        },
        {
            label: "Lượt đăng ký sự kiện",
            value: stats.totalRegistrations,
            caption: eventSeries[0] ? `${eventSeries[0].label} thu hút nhiều nhất` : "Hãy tạo sự kiện mới",
            accent: "#7dd3fc"
        },
        {
            label: "Tổng điểm rèn luyện đã cộng",
            value: pointsSummary.totalPoints,
            caption: pointsSummary.topStudents[0]
                ? `${pointsSummary.topStudents[0].ho_ten} đang top 1`
                : "Chưa có dữ liệu điểm",
            accent: "#fbcfe8"
        }
    ]), [stats, facultySeries, eventSeries, pointsSummary]);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
                padding: "40px 18px",
                fontFamily: "Inter, Segoe UI, sans-serif",
                color: "#0f172a"
            }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                <HeroSection stats={stats} loading={loading} />

                {error && (
                    <div
                        style={{
                            margin: "12px 0",
                            padding: "14px 18px",
                            borderRadius: "12px",
                            background: "rgba(255,0,0,0.1)",
                            border: "1px solid rgba(255,0,0,0.3)",
                            color: "#b91c1c"
                        }}
                    >
                        {error}
                    </div>
                )}

                {loading ? (
                    <SkeletonDashboard />
                ) : (
                    <>
                        {/* 3 Card thống kê */}
                        <section
                            style={{
                                ...gridThreeCols,
                                color: "#0f172a"
                            }}
                        >
                            {highlightCards.map((card) => (
                                <div
                                    key={card.label}
                                    style={{
                                        borderRadius: "16px",
                                        padding: "24px",
                                        background: "#ffffffcc",
                                        border: `2px solid ${card.accent}55`,
                                        boxShadow: `0 6px 18px ${card.accent}33`,
                                        transition: "0.25s",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-6px)";
                                        e.currentTarget.style.boxShadow = `0 12px 28px ${card.accent}66`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = `0 6px 18px ${card.accent}33`;
                                    }}
                                >
                                    <p style={{ color: "#374151", fontSize: 13, marginBottom: 6 }}>
                                        {card.label}
                                    </p>
                                    <h3 style={{ fontSize: 34, margin: 0, color: "#0f172a" }}>
                                        {numberFormatter.format(card.value || 0)}
                                    </h3>
                                    <p style={{ marginTop: 10, fontSize: 14, color: "#1e293b" }}>
                                        {card.caption}
                                    </p>
                                </div>
                            ))}
                        </section>

                        <QuickActions />

                        <section style={gridTwoCols}>
                            <DashboardCard
                                title="Biểu đồ cột: tài khoản theo khoa"
                                subtitle="Top 6 khoa tạo tài khoản nhiều nhất"
                                light
                            >
                                {facultySeries.length === 0 ? (
                                    <EmptyState text="Chưa có dữ liệu khoa" />
                                ) : (
                                    <MiniBarChart data={facultySeries} />
                                )}
                            </DashboardCard>

                            <DashboardCard
                                title="Biểu đồ tròn: lượt đăng ký sự kiện"
                                subtitle="Chia theo sự kiện nổi bật"
                                light
                            >
                                {eventSeries.length === 0 ? (
                                    <EmptyState text="Chưa có lượt đăng ký nào" />
                                ) : (
                                    <DonutChart data={eventSeries} colors={donutColors} />
                                )}
                            </DashboardCard>
                        </section>

                        <section style={gridTwoCols}>
                            <DashboardCard
                                title="Điểm rèn luyện theo học kỳ"
                                subtitle="Xu hướng cộng điểm gần nhất"
                                light
                            >
                                {pointsSummary.semesterSeries.length === 0 ? (
                                    <EmptyState text="Chưa có dữ liệu điểm" />
                                ) : (
                                    <SparkLineChart data={pointsSummary.semesterSeries} />
                                )}
                            </DashboardCard>

                            <DashboardCard
                                title="Top sinh viên điểm cao"
                                subtitle="Tự động cập nhật theo bảng điểm rèn luyện"
                                light
                            >
                                {pointsSummary.topStudents.length === 0 ? (
                                    <EmptyState text="Chưa có dữ liệu sinh viên" />
                                ) : (
                                    <TopStudentsList students={pointsSummary.topStudents} />
                                )}
                            </DashboardCard>
                        </section>

                        <LatestEventsTable events={latestEvents} />
                    </>
                )}
            </div>
        </div>
    );

}

function HeroSection({ stats, loading }) {
    return (
        <div
            style={{
                background: "rgba(255,255,255,0.9)",
                borderRadius: 24,
                padding: "32px 36px",
                border: "1px solid #a5d8ff",
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                marginBottom: 32,
                position: "relative",
                overflow: "hidden",
                transition: "0.25s"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 18px 55px rgba(0,0,0,0.18)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)";
            }}
        >
            {/* Hiệu ứng ánh sáng nhẹ */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(circle at 20% 20%, rgba(135,206,250,0.28), transparent 60%)",
                    filter: "blur(14px)",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 24,
                    flexWrap: "wrap",
                    color: "#0f172a", // toàn bộ chữ đen
                    fontFamily: "Inter, Segoe UI, sans-serif",
                }}
            >
                <div style={{ flex: 1, minWidth: 260 }}>
                    <p
                        style={{
                            color: "#0077b6",
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: 1.2,
                        }}
                    >
                        ADMIN OVERVIEW
                    </p>

                    <h1
                        style={{
                            fontSize: 36,
                            margin: "8px 0 12px",
                            fontWeight: 800,
                            color: "#0c1222",
                        }}
                    >
                        Dashboard quản trị EcoEvent
                    </h1>

                    <p
                        style={{
                            color: "#1e293b",
                            fontSize: 16,
                            lineHeight: 1.55,
                            maxWidth: 550,
                        }}
                    >
                        Theo sát tình hình đăng ký, sự kiện và điểm rèn luyện của sinh viên một
                        cách trực quan – realtime – chuẩn xác.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap",
                            marginTop: 18,
                        }}
                    >
                        <HeroBadge
                            text={loading ? "Đang đồng bộ dữ liệu..." : "Dữ liệu đã cập nhật"}
                        />
                        <HeroBadge
                            text={`Tổng sự kiện: ${numberFormatter.format(
                                stats.totalEvents || 0
                            )}`}
                        />
                    </div>
                </div>

                {/* Khung chế độ nhanh */}
                <div
                    style={{
                        minWidth: 220,
                        borderRadius: 20,
                        padding: 20,
                        background: "linear-gradient(160deg, #d0ebff, #a5d8ff)",
                        border: "1px solid #74c0fc",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                        color: "#0f172a",
                    }}
                >
                    <p style={{ margin: 0, fontWeight: 600 }}>Chế độ nhanh</p>

                    <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
                        <ShortcutLink to="/admin/events" text="Tạo sự kiện mới" icon="🚀" />
                        <ShortcutLink to="/admin/users" text="Quản lý sinh viên" icon="👥" />
                        <ShortcutLink to="/admin/reward-points" text="Điểm rèn luyện" icon="⭐" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function HeroBadge({ text }) {
    return (
        <span
            style={{
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: "#0f172a",               // chữ đen
                background: "#e3f2fd",          // nền xanh nhạt
                border: "1px solid #90caf9",    // viền xanh dương sáng
                display: "inline-block",
                transition: "0.25s ease"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "#bbdefb";   // xanh nhạt hơn
                e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "#e3f2fd";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {text}
        </span>
    );
}

function ShortcutLink({ to, text, icon }) {
    return (
        <Link
            to={to}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: 14,
                textDecoration: "none",
                background: "#e3f2fd",               // nền xanh nhạt
                color: "#0f172a",                    // chữ đen
                fontWeight: 600,
                border: "1px solid #90caf9",         // viền xanh sáng
                transition: "0.25s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "#bbdefb";   // hover xanh đậm hơn
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "#e3f2fd";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
            }}
        >
            <span>{text}</span>
            <span style={{ fontSize: "18px" }}>{icon}</span>
        </Link>
    );
}

function QuickActions() {
    const actions = [
        { to: "/admin/events", title: "Quản lý sự kiện", desc: "Thêm, sửa, xoá sự kiện", emoji: "📅" },
        { to: "/admin/users", title: "Danh sách sinh viên", desc: "Theo dõi đăng ký tài khoản", emoji: "🧑🎓" },
        { to: "/admin/reward-points", title: "Điểm rèn luyện", desc: "Cộng/trừ ngay lập tức", emoji: "⭐" },
        { to: "/admin/scan-qr", title: "Quét QR Check-in", desc: "Điểm danh ngay tại sự kiện", emoji: "📲" },
    ];

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 16,
                margin: "28px 0",
            }}
        >
            {actions.map((action) => (
                <Link
                    key={action.title}
                    to={action.to}
                    style={{
                        padding: "16px",
                        borderRadius: 16,
                        border: "1px solid #90caf9",
                        background: "#e3f2fd",
                        color: "#0f172a",
                        textDecoration: "none",
                        transition: "0.25s ease",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#bbdefb";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#e3f2fd";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
                    }}
                >
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{action.emoji}</div>
                    <p style={{ fontWeight: 700, marginBottom: 4 }}>{action.title}</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>{action.desc}</p>
                </Link>
            ))}
        </div>
    );
}

function GlassCard({ children, glow }) {
    return (
        <div
            style={{
                borderRadius: 20,
                padding: 24,
                background: "#ffffffcc", // trắng trong suốt
                border: `2px solid ${glow || "#90caf9"}66`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.12)`,
                transition: "0.25s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 8px 28px ${glow || "#42a5f5"}55`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)";
            }}
        >
            {children}
        </div>
    );
}

function DashboardCard({ title, subtitle, children }) {
    return (
        <div
            style={{
                borderRadius: 22,
                padding: 24,
                background: "#ffffffdd", // trắng trong suốt nhẹ
                border: "2px solid #90caf9", // viền xanh dương pastel
                minHeight: 320,
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                transition: "0.25s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
            }}
        >
            <div style={{ marginBottom: 18 }}>
                <p
                    style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#0c4a6e",
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                    }}
                >
                    {title}
                </p>

                <p
                    style={{
                        margin: "4px 0 0",
                        fontSize: 14,
                        color: "#475569",
                    }}
                >
                    {subtitle}
                </p>
            </div>

            {children}
        </div>
    );
}

function MiniBarChart({ data }) {
    const maxValue = Math.max(...data.map((item) => item.value), 1);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 16,
                height: 220,
            }}
        >
            {data.map((item) => {
                const heightPercent = (item.value / maxValue) * 100;

                return (
                    <div key={item.label} style={{ flex: 1, textAlign: "center" }}>
                        <div
                            style={{
                                height: `${heightPercent}%`,
                                background: "linear-gradient(180deg, #42a5f5, #1e88e5)", // xanh dương pastel → đậm
                                borderRadius: "14px 14px 6px 6px",
                                position: "relative",
                                boxShadow: "0 8px 20px rgba(30,136,229,0.25)",
                                transition: "0.25s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow =
                                    "0 12px 26px rgba(30,136,229,0.35)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 8px 20px rgba(30,136,229,0.25)";
                            }}
                        >
                            <span
                                style={{
                                    position: "absolute",
                                    top: -28,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#0f172a",
                                }}
                            >
                                {numberFormatter.format(item.value)}
                            </span>
                        </div>

                        <p
                            style={{
                                marginTop: 10,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#1e293b",
                            }}
                        >
                            {item.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

function DonutChart({ data, colors }) {
    const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
    let cumulative = 0;

    const segments = data.map((item, index) => {
        const startAngle = (cumulative / total) * 360;
        cumulative += item.value;
        const endAngle = (cumulative / total) * 360;
        return `${colors[index % colors.length]} ${startAngle}deg ${endAngle}deg`;
    });

    return (
        <div
            style={{
                display: "flex",
                gap: 24,
                alignItems: "center",
                flexWrap: "wrap",
                color: "#0f172a",
                fontFamily: "sans-serif",
            }}
        >
            {/* Vòng donut */}
            <div
                style={{
                    width: 190,
                    height: 190,
                    borderRadius: "50%",
                    background: `conic-gradient(${segments.join(",")})`,
                    position: "relative",
                    border: "3px solid #90caf9",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
                    transition: "0.25s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.1)";
                }}
            >
                {/* Lỗ tròn bên trong */}
                <div
                    style={{
                        position: "absolute",
                        inset: 28,
                        borderRadius: "50%",
                        background: "#e3f2fd",
                        border: "2px solid #bbdefb",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#1e293b",
                        }}
                    >
                        Tổng
                    </p>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#0f172a",
                        }}
                    >
                        {numberFormatter.format(total)}
                    </p>
                </div>
            </div>

            {/* Chú thích */}
            <div style={{ flex: 1, minWidth: 200 }}>
                {data.map((item, index) => (
                    <div
                        key={item.label}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 12,
                            gap: 12,
                        }}
                    >
                        <span
                            style={{
                                width: 14,
                                height: 14,
                                borderRadius: 4,
                                background: colors[index % colors.length],
                                border: "2px solid #90caf9",
                            }}
                        />

                        <div style={{ flex: 1 }}>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#0f172a",
                                }}
                            >
                                {item.label}
                            </p>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 12,
                                    color: "#475569",
                                }}
                            >
                                {numberFormatter.format(item.value)} lượt
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SparkLineChart({ data }) {
    const maxValue = Math.max(...data.map((item) => item.value), 1);
    const points = data
        .map((item, index) => {
            const x = data.length === 1 ? 0 : (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 100;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, color: "#0f172a", fontFamily: "sans-serif" }}>

            {/* Vùng biểu đồ */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: 200,
                    background: "#e3f2fd",
                    borderRadius: 16,
                    border: "2px solid #bbdefb",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                    padding: 8,
                    transition: "0.25s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
                }}
            >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                    {/* Gradient mới kiểu xanh pastel */}
                    <defs>
                        <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#42a5f5" />
                            <stop offset="100%" stopColor="#ab47bc" />
                        </linearGradient>
                    </defs>

                    {/* Đường biểu đồ */}
                    <polyline
                        fill="none"
                        stroke="url(#sparkGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        points={points}
                    />

                    {/* Chấm tròn trên các điểm */}
                    {data.map((item, index) => {
                        const x = data.length === 1 ? 0 : (index / (data.length - 1)) * 100;
                        const y = 100 - (item.value / maxValue) * 100;
                        return <circle key={item.label} cx={x} cy={y} r="3.2" fill="#1976d2" stroke="#fff" strokeWidth="1.2" />;
                    })}
                </svg>
            </div>

            {/* Các label giá trị */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {data.map((item) => (
                    <div
                        key={item.label}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 12,
                            background: "#e8f4ff",
                            border: "1px solid #90caf9",
                            boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                            transition: "0.25s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.05)";
                        }}
                    >
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                            {item.label}
                        </p>
                        <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                            {numberFormatter.format(item.value)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TopStudentsList({ students }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "sans-serif" }}>
            {students.slice(0, 5).map((student, index) => (
                <div
                    key={student.ho_ten}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        borderRadius: 14,
                        background: "#e3f2fd",
                        border: "2px solid #bbdefb",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                        transition: "0.25s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
                    }}
                >
                    {/* Bên trái: xếp hạng + thông tin sinh viên */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>

                        {/* Ô số thứ hạng */}
                        <span
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: "#90caf9",
                                color: "#0f172a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 15,
                                boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                            }}
                        >
                            #{index + 1}
                        </span>

                        {/* Tên + Lớp */}
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                                {student.ho_ten}
                            </p>
                            <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>
                                {student.lop || "Chưa cập nhật"}
                            </p>
                        </div>
                    </div>

                    {/* Điểm rèn luyện */}
                    <p
                        style={{
                            margin: 0,
                            fontWeight: 800,
                            fontSize: 16,
                            color: "#1e293b",
                        }}
                    >
                        {numberFormatter.format(student.tong_diem || 0)} điểm
                    </p>
                </div>
            ))}
        </div>
    );
}

function LatestEventsTable({ events }) {
    return (
        <div
            style={{
                marginTop: 32,
                borderRadius: 24,
                background: "#e3f2fd",
                border: "2px solid #90caf9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: 24,
                    borderBottom: "2px solid #bbdefb",
                    background: "#bbdefb",
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                }}
            >
                <p
                    style={{
                        margin: 0,
                        color: "#0f172a",
                        letterSpacing: 1.2,
                        fontSize: 14,
                        fontWeight: 700,
                    }}
                >
                    Sự kiện mới nhất
                </p>
                <p
                    style={{
                        margin: "6px 0 0",
                        color: "#1e293b",
                        fontSize: 14,
                    }}
                >
                    Theo dõi nhanh các sự kiện vừa tạo cùng trạng thái đăng ký
                </p>
            </div>

            {/* Empty */}
            {events.length === 0 ? (
                <EmptyState text="Chưa có sự kiện nào" />
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            color: "#0f172a",
                        }}
                    >
                        {/* Table Head */}
                        <thead>
                            <tr style={{ background: "#bbdefb" }}>
                                {["#", "Tên sự kiện", "Địa điểm", "Thời gian", "Đăng ký / Sức chứa"].map(
                                    (header) => (
                                        <th
                                            key={header}
                                            style={{
                                                padding: "14px 16px",
                                                fontSize: 13,
                                                textAlign: "left",
                                                color: "#0f172a",
                                                fontWeight: 700,
                                                borderBottom: "2px solid #90caf9",
                                            }}
                                        >
                                            {header}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {events.map((evt, index) => (
                                <tr
                                    key={evt.id || index}
                                    style={{
                                        borderBottom: "1px solid #bbdefb",
                                        transition: "0.25s",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#dceffd";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    <td style={tdStyle}>{index + 1}</td>

                                    <td style={{ ...tdStyle, fontWeight: 700 }}>
                                        {evt.title}
                                    </td>

                                    <td style={tdStyle}>{evt.location || "Đang cập nhật"}</td>

                                    <td style={tdStyle}>
                                        {evt.date
                                            ? new Date(evt.date).toLocaleString("vi-VN")
                                            : "Chưa có"}
                                    </td>

                                    <td style={tdStyle}>
                                        <span
                                            style={{
                                                padding: "4px 10px",
                                                borderRadius: 999,
                                                background: "#bbdefb",
                                                border: "1px solid #90caf9",
                                                color: "#0f172a",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {numberFormatter.format(evt.attendees || 0)} /{" "}
                                            {numberFormatter.format(evt.capacity || 0)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const tdStyle = {
    padding: "12px 16px",
    fontSize: 14,
    color: "#0f172a",
};

function EmptyState({ text }) {
    return (
        <div
            style={{
                padding: "24px 0",
                textAlign: "center",
                color: "#0f172a",
                background: "#e3f2fd",
                borderRadius: 16,
                border: "1px solid #bbdefb",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                maxWidth: 500,
                margin: "20px auto"
            }}
        >
            {text}
        </div>
    );
}

function SkeletonDashboard() {
    return (
        <div style={{ display: "grid", gap: 18 }}>
            {Array.from({ length: 3 }).map((_, idx) => (
                <div
                    key={idx}
                    style={{
                        height: 120,
                        borderRadius: 20,
                        background: "linear-gradient(90deg, #e3f2fd 0%, #bbdefb 50%, #e3f2fd 100%)",
                        animation: "loadingPulse 1.6s infinite",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
                    }}
                />
            ))}

            {/* Animation keyframes */}
            <style>
                {`
                @keyframes loadingPulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
                `}
            </style>
        </div>
    );
}

const gridThreeCols = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: 18,
    marginBottom: 24
};

const gridTwoCols = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
    gap: 18,
    marginBottom: 24
};

const tableHeaderStyle = {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: 13,
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 1,
    background: "#e3f2fd",
    borderBottom: "2px solid #90caf9"
};

const tableCellStyle = {
    padding: "14px 16px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    borderBottom: "1px solid #e0e7ff",
    transition: "0.25s"
};

export default AdminDashboard;
