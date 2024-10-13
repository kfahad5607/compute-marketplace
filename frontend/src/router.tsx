import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthLayout from "./pages/AuthLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductEditPage from "./pages/ProductEditPage";
import ProtectedRoutes from "./components/elements/ProtectedRoutes";
import Layout from "./pages/Layout";
import ProductCreatePage from "./pages/ProductCreatePage";

const router = createBrowserRouter([
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
    ],
  },
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Navigate to="/gpus/all" />,
          },
          {
            path: "/gpus/:type",
            element: <HomePage />,
          },
          {
            path: "gpus/new",
            element: <ProductCreatePage />,
          },
          {
            path: "gpus/:gpuId/view",
            element: <ProductDetailsPage />,
          },
          {
            path: "gpus/:gpuId/edit",
            element: <ProductEditPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
