import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

/* USER PAGES */
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Events from '../pages/Events';
import About from '../pages/About';
import Extend from '../pages/Extend';
import Community from '../pages/Community';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyOTP from '../pages/VerifyOTP';
import EventDetail from '../pages/EventDetail';

import Profile from '../pages/Profile';
import MyTickets from '../pages/MyTickets';
import History from '../pages/History';
import TrainingPoints from '../pages/TrainingPoints';
import ChangePassword from '../pages/ChangePassword';
import UpdateAvatar from '../pages/UpdateAvatar';

/* UTILS */
import PrivateRoute from '../utils/PrivateRoute';

/* ADMIN PAGES */
import Admin from "../pages/admin/Admin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageEvents from "../pages/admin/ManageEvents";
import ScanQR from "../pages/admin/ScanQR";
import AdminExtend from "../pages/admin/AdminExtend";
import EventRegistrations from "../pages/admin/EventRegistrations";
import CheckinHistory from "../pages/admin/CheckinHistory";
import NotificationManagement from "../pages/admin/NotificationManagement";
import RewardPointsManagement from "../pages/admin/RewardPointsManagement";
import ChatManagement from "../pages/admin/ChatManagement";
import Notifications from '../pages/Notifications';
import AdminLayout from "../layouts/AdminLayout";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },

            /* USER ROUTES */
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'events', element: <Events /> },
            { path: 'events/:id', element: <EventDetail /> },
            { path: 'about', element: <About /> },
            { path: 'extend', element: <Extend /> },
            { path: 'community', element: <Community /> },

            /* 🔔 THÔNG BÁO */
            { path: "/notifications", element: <Notifications /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'verify-otp', element: <VerifyOTP /> },

            /* PRIVATE ROUTES */
            { path: 'profile', element: <PrivateRoute><Profile /></PrivateRoute> },
            { path: 'mytickets', element: <PrivateRoute><MyTickets /></PrivateRoute> },
            { path: 'history', element: <PrivateRoute><History /></PrivateRoute> },
            { path: 'training-points', element: <PrivateRoute><TrainingPoints /></PrivateRoute> },
            { path: 'change-password', element: <PrivateRoute><ChangePassword /></PrivateRoute> },
            { path: 'update-avatar', element: <PrivateRoute><UpdateAvatar /></PrivateRoute> },
        ],
    },

    /* 🛠 ADMIN ROUTES (ROLE = ADMIN) */

    {
        path: "/admin",
        element: (
            <PrivateRoute role="admin">
                <Admin />
            </PrivateRoute>
        )
    },

    {
        path: "/admin/users",
        element: (
            <PrivateRoute role="admin">
                <ManageUsers />
            </PrivateRoute>
        )
    },
    {
        path: "/admin/events",
        element: (
            <PrivateRoute role="admin">
                <ManageEvents />
            </PrivateRoute>
        )
    },
    {
        path: "/admin/scan-qr",
        element: (
            <PrivateRoute role="admin">
                <ScanQR />
            </PrivateRoute>
        )
    },
    {
        path: "/admin/extend",
        element: (
            <PrivateRoute role="admin">
                <AdminExtend />
            </PrivateRoute>
        )
    },
    {
        path: "/admin/events/:id/registrations",
        element: (
            <PrivateRoute role="admin">
                <EventRegistrations />
            </PrivateRoute>
        )
    },
    {
        path: "/admin/checkin-history",
        element: (
            <PrivateRoute role="admin">
                <CheckinHistory />
            </PrivateRoute>
        )
    },
    {
        path: "/admin/notifications",
        element: (
            <PrivateRoute role="admin">
                <NotificationManagement />
            </PrivateRoute>
        )
    },
    {
        path: "/admin/reward-points",
        element: (
            <PrivateRoute role="admin">
                <RewardPointsManagement />
            </PrivateRoute>
        )
    },
    {
        path: "/admin/chat",
        element: (
            <PrivateRoute role="admin">
                <ChatManagement />
            </PrivateRoute>
        )
    }

]);
