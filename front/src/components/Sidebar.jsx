import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import {
  Home,
  Eye,
  Plus,
  Users,
  ClipboardList,
  Layers,
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

export default function Sidebar() {
  const { authUser, perfil, logout } = useAuth();
  const navigate = useNavigate();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openVer, setOpenVer] = useState(false);
  const [openCrear, setOpenCrear] = useState(false);

  const rol = Number(authUser?.RolId ?? perfil?.rolId);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setIsMobileOpen(false);
  }, [navigate]);

  const itemBase =
    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition";
  const itemActive = "bg-indigo-600 text-white";
  const itemInactive = "text-gray-300 hover:bg-gray-700";

  return (
    <>
      {/* BOTÓN MÓVIL */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg"
      >
        {isMobileOpen ? <X /> : <Menu />}
      </button>

      {/* OVERLAY */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          w-64 min-h-screen
          bg-gray-900 text-gray-100
          transition-transform duration-300
          flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center px-4 border-b border-gray-700">
          <span className="text-lg font-bold tracking-wide text-indigo-400">
            Tasky
          </span>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-2 py-4 space-y-6 overflow-y-auto">

          {/* GENERAL */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase">
              General
            </p>

            <NavLink
              to="/home"
              className={({ isActive }) =>
                `${itemBase} ${isActive ? itemActive : itemInactive}`
              }
            >
              <Home className="w-5 h-5" />
              Home
            </NavLink>
          </div>

          {/* USUARIO */}
          {rol === 3 && (
            <div>
              <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase">
                Tareas
              </p>

              <NavLink
                to="/usuario"
                className={({ isActive }) =>
                  `${itemBase} ${isActive ? itemActive : itemInactive}`
                }
              >
                <ClipboardList className="w-5 h-5" />
                Mis tareas
              </NavLink>
            </div>
          )}

          {/* ADMINISTRACIÓN */}
          {(rol === 1 || rol === 2) && (
            <div className="space-y-2">
              <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase">
                Administración
              </p>

              {/* VER */}
              <button
                onClick={() => setOpenVer(!openVer)}
                className={`${itemBase} ${itemInactive} justify-between`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5" />
                  Ver
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openVer ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openVer && (
                <ul className="ml-4 pl-4 border-l border-gray-700 space-y-1">
                  <NavLink
                    to={rol === 1 ? "/jefe" : "/responsable"}
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    <Users className="w-4 h-4" />
                    Equipo
                  </NavLink>

                  <NavLink
                    to={rol === 1 ? "/ver-tareas" : "/ver-tareasRES"}
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    <ClipboardList className="w-4 h-4" />
                    Tareas
                  </NavLink>

                  {rol === 1 && (
                    <NavLink
                      to="/jefe/areas"
                      className={({ isActive }) =>
                        `${itemBase} ${isActive ? itemActive : itemInactive}`
                      }
                    >
                      <Layers className="w-4 h-4" />
                      Áreas
                    </NavLink>
                  )}
                </ul>
              )}

              {/* CREAR */}
              <button
                onClick={() => setOpenCrear(!openCrear)}
                className={`${itemBase} ${itemInactive} justify-between`}
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  Crear
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openCrear ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openCrear && (
                <ul className="ml-4 pl-4 border-l border-gray-700 space-y-1">
                  <NavLink
                    to="/crear-usuario"
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    Usuarios
                  </NavLink>

                  <NavLink
                    to={rol === 1 ? "/crear-tarea" : "/crear-tareaRES"}
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    Tareas
                  </NavLink>

                  {rol === 1 && (
                    <NavLink
                      to="/jefe/crear-areas"
                      className={({ isActive }) =>
                        `${itemBase} ${isActive ? itemActive : itemInactive}`
                      }
                    >
                      Áreas
                    </NavLink>
                  )}
                </ul>
              )}
            </div>
          )}
        </nav>

        {/* LOGOUT */}
        <div className="mt-auto p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400
                       hover:bg-red-600 hover:text-white rounded-md transition"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
