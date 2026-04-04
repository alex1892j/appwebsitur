import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loadingUser, isAdmin } = useAuth();

  if (loadingUser) {
    return <div>Cargando sesión...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace/>;
  }

  return children;
}

export default ProtectedRoute;

