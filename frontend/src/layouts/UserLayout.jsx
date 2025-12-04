import UserHeader from "../components/UserHeader";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
    return (
        <>
            <UserHeader />
            <Outlet />
        </>
    );
}
