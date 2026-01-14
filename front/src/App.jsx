import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import { ROLES } from "./utils/roles";

// Páginas
import Login from "./pages/Login";
import DasboardUsuario from "./pages/Usuario/UsuarioDashboard";
import DashboardResponsable from "./pages/Responsable/ResponsableDashboard";
import Dashboardjefe from "./pages/jefe/JefeDashboard";
import NoAutorizado from "./pages/NotAuthorized";
import Home from "./pages/Home";
import CrearUsuarioForm from "./components/Usuario/CrearUsuario";
import TareasJefeTable from "./pages/jefe/verTareas.jsx";
import CrearTareaPage from "./pages/jefe/CrearTarea.jsx";
import ResponsableVerTareas from "./pages/Responsable/VerTareas";
import CrearTareaPageRES from "./pages/Responsable/CrearTareas.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Raíz */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />

        {/* USUARIO NORMAL */}
        <Route
          path="/usuario"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.USUARIO, ROLES.RESPONSABLE, ROLES.JEFE]}>
                <DasboardUsuario />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* RESPONSABLE */}
        <Route
          path="/responsable"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.RESPONSABLE]}>
                <DashboardResponsable />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* JEFE */}
        <Route
          path="/jefe"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.JEFE]}>
                <Dashboardjefe />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* CREAR USUARIO - Solo para roles con permisos administrativos */}
        <Route
          path="/crear-usuario"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.RESPONSABLE, ROLES.JEFE]}>
                <CrearUsuarioForm />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        {/* VER TAREAS - Solo para JEFE */}
        <Route
          path="/ver-tareas"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.JEFE]}>
                <TareasJefeTable />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        {/* VER TAREAS - Solo para responsable */}
        <Route
          path="/ver-tareasRES"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.RESPONSABLE]}>
                <ResponsableVerTareas />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        {/* CREAR TAREA - Solo para JEFE */}
        <Route
          path="/crear-tareaRES"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.RESPONSABLE]}>
                <CrearTareaPageRES />
              </RoleGuard>
            </ProtectedRoute>
          }
        />


        {/* CREAR TAREA - Solo para JEFE */}
        < Route
          path="/crear-tarea"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.JEFE]}>
                <CrearTareaPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* NO AUTORIZADO */}
        <Route path="/no-autorizado" element={<NoAutorizado />} />

        {/* HOME - Ruta protegida para todos los usuarios autenticados */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.USUARIO, ROLES.RESPONSABLE, ROLES.JEFE]}>
                <Home />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;