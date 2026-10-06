import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdminRoute() {
  const token = localStorage.getItem("immiq_admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}