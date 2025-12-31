import { BrowserRouter, Routes, Route } from "react-router-dom";
//components
import ProtectedRoute from '../components/ProtectedRoute'
import RoleGuard from '../components/RoleGuard'
//pages
import Login from "../pages/Login";
import Home from "../pages/Home";
import UsuarioDashboard from "../pages/UsuarioDashboard";
import ResponsableDashboard from "../pages/ResponsableDashboard";
import JefeDashboard from "../pages/JefeDashboard";
import NotAuthorized from "../pages/NotAuthorized";

export default function AppRouter() {
    return (

        <BrowserRouter>
            <Routes>
                {/* Publica */}
                <Route path="/login" element={<Login />} />
                <Route path="/no-autorizado" element={<NotAuthorized />} />
                {/* Privada general */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                {/* Jefe  */}
                <Route
                    path="/jefe "
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[1]}>
                                <JefeDashboard />
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />
                {/* Responsable */}
                <Route
                    path="/responsable"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[2]}>
                                <ResponsableDashboard />
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />
                {/* Usuario */}
                <Route
                    path="/usuario"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[3]}>
                                <UsuarioDashboard />
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>

    );
}