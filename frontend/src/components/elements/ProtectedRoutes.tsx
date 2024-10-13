import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = null;

  if (!user) return <Navigate to="/auth/login" />;

  return <Outlet />;
};

export default ProtectedRoutes;
