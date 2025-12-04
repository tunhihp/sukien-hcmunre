import React, { useState } from "react";

const UpdateAvatar = () => {
    const [avatar, setAvatar] = useState("");

    return (
        <div style={{ color: "white", padding: "40px" }}>
            <h1>Cập nhật ảnh đại diện</h1>
            <input
                placeholder="Nhập link ảnh mới"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
            />
        </div>
    );
};

export default UpdateAvatar;
