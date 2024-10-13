import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthLayout from "./pages/AuthLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductEditPage from "./pages/ProductEditPage";
import ProtectedRoutes from "./components/elements/ProtectedRoutes";

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
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/gpus/:gpuId",
        element: <ProductDetailsPage />,
      },
      {
        path: "/gpus/:gpuId/edit",
        element: <ProductEditPage />,
      },
    ],
  },
]);

export default router;
