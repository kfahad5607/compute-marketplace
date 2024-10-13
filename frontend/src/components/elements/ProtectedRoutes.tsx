import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";

const ProtectedRoutes = () => {
  const { pathname } = useLocation();
  const { user } = useUserContext();

  console.log("user ", user);

  if (!user) return <Navigate to="/auth/login" state={{ prevUrl: pathname }} />;

  return <Outlet />;
};

export default ProtectedRoutes;
