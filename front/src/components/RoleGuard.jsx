import { Navigate } from "react-router-dom";
//import { useAuth } from "../hooks/useAuth";
import { useAuth } from "../auth/AuthContext";

export default function RoleGuard({ allowedRoles = [], children }) {
    const { authUser, loading } = useAuth();

    //mientras carga el auth
    if (loading) {
        return null;
    }
    //no logueado
    if (!authUser) {
        return <Navigate to="/login" />;
    }
    const userRole = authUser.RolId;

    //seguridad extra
    if (!Array.isArray(allowedRoles)) {
        console.error("allowedRoles debe ser un array");
        return <Navigate to="/no-autorizado" />;
    }
    return children
}