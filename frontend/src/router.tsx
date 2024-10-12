import { createBrowserRouter } from "react-router-dom";
// import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import AuthLayout from "./pages/AuthLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "register",
                element: <RegisterPage />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
        ]
    },
]);

export default router;
