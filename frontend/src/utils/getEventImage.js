const API_URL = "http://localhost:3001"; // tự động update theo .env nếu có

export function getEventImage(path) {
    if (!path || typeof path !== "string") return "/default.jpg";

    const trimmed = path.trim();
    if (!trimmed) return "/default.jpg";

    // 1. Nếu là URL tuyệt đối
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }

    // 2. Nếu là file upload từ backend
    if (trimmed.startsWith("/uploads") || trimmed.startsWith("uploads")) {
        return `${API_URL}/${trimmed.replace(/^\/?/, "")}`;
    }

    // 3. Nếu là file trong assets/images
    return new URL(`../assets/images/${trimmed}`, import.meta.url).href;
}
