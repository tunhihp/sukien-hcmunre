import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import UserHeader from "./components/UserHeader";

function App() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <AuthProvider>
            {!isAdminPage && <UserHeader />}
            <Outlet />
        </AuthProvider>
    );
}

export default App;
