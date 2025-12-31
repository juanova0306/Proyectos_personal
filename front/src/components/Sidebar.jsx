import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const { authUser, perfil, logout } = useAuth();
  const navigate = useNavigate();
  const [isMinified, setIsMinified] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openVer, setOpenVer] = useState(false);
  const [openCrear, setOpenCrear] = useState(false);



  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const rol = Number(authUser?.RolId ?? perfil?.rolId);

  // Cerrar sidebar en móvil al cambiar ruta
  useEffect(() => {
    setIsMobileOpen(false);
  }, [navigate]);

  // Cerrar sidebar en móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth < 768 && isMobileOpen) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.contains(e.target) &&
          !document.getElementById('mobile-menu-button')?.contains(e.target)) {
          setIsMobileOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileOpen]);

  return (
    <>
      {/* Botón para abrir sidebar en móvil */}
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label="Abrir menú"
      >
        {isMobileOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`
          bg-gray-800 text-gray-100 min-h-screen 
          flex flex-col
          fixed md:relative
          top-0 left-0
          transform transition-transform duration-300 ease-in-out
          z-50
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isMinified ? 'w-16' : 'w-64'}
        `}
      >
        {/* Header del Sidebar */}
        <div className={`h-16 flex items-center ${isMinified ? 'justify-center px-0' : 'justify-between px-6'} border-b border-gray-700`}>
          {!isMinified ? (
            <>
              <span className="font-bold text-lg">Menú</span>
              {/* Botón para minificar (solo desktop) */}
              <button
                onClick={() => setIsMinified(!isMinified)}
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label={isMinified ? "Expandir menú" : "Minificar menú"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMinified ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  )}
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsMinified(false)}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Expandir menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Botón cerrar en móvil */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del Sidebar */}
        <nav className="px-2 py-4 space-y-6 flex-1 overflow-y-auto">
          {/* Home - siempre visible */}
          <div className="space-y-1">
            {!isMinified && <p className="text-xs uppercase text-gray-400 px-2 mb-1">Home</p>}
            <Link
              to="/home"
              className={`
                flex items-center rounded-md px-2 py-2 text-sm hover:bg-gray-700
                ${isMinified ? 'justify-center' : ''}
              `}
              title={isMinified ? "Home" : ""}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M5 10h14" />
              </svg>
              {!isMinified && <span className="ml-3">Home</span>}
            </Link>
          </div>

          {/* USUARIO (Rol 3) */}
          {rol === 3 && (
            <div className="space-y-1">
              {!isMinified && <p className="text-xs uppercase text-gray-400 px-2 mb-1">Tareas</p>}
              <Link
                to="/usuario"
                className={`
                  flex items-center rounded-md px-2 py-2 text-sm hover:bg-gray-700
                  ${isMinified ? 'justify-center' : ''}
                `}
                title={isMinified ? "Mis tareas" : ""}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {!isMinified && <span className="ml-3">Mis tareas</span>}
              </Link>
            </div>
          )}

          {/* RESPONSABLE (Rol 2) */}
          {rol === 2 && (
            <div className="space-y-1">
              {!isMinified && <p className="text-xs uppercase text-gray-400 px-2 mb-1">Administración</p>}
              <Link
                to="/responsable"
                className={`
                  flex items-center rounded-md px-2 py-2 text-sm hover:bg-gray-700
                  ${isMinified ? 'justify-center' : ''}
                `}
                title={isMinified ? "Usuarios y tareas" : ""}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!isMinified && <span className="ml-3">Usuarios y tareas</span>}
              </Link>
            </div>
          )}

          {/* JEFE (Rol 1) */}
          {rol === 1 && (
            <div className="space-y-2">
              {!isMinified && (
                <p className="text-xs uppercase text-gray-400 px-2 mb-1">
                  Administración
                </p>
              )}

              {/* ===== VER ===== */}
              <button
                type="button"
                onClick={() => setOpenVer(!openVer)}
                className={`
                  flex items-center w-full justify-between px-2 py-2 text-sm rounded-md
                  hover:bg-gray-700
                  ${isMinified ? "justify-center" : ""}
                `}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5
                      c4.478 0 8.268 2.943 9.542 7
                      -1.274 4.057-5.064 7-9.542 7
                      -4.477 0-8.268-2.943-9.542-7Z" />
                  </svg>
                  {!isMinified && <span className="ml-3">Ver</span>}
                </div>

                {!isMinified && (
                  <svg
                    className={`w-4 h-4 transition-transform ${openVer ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                  </svg>
                )}
              </button>

              {openVer && !isMinified && (
                <ul className="space-y-1 pl-6">
                  <li>
                    <Link to="/jefe" className="block px-2 py-1.5 rounded-md hover:bg-gray-700">
                      Equipo
                    </Link>
                  </li>
                  <li>
                    <Link to="/ver-tareas" className="block px-2 py-1.5 rounded-md hover:bg-gray-700">
                      Tareas
                    </Link>
                  </li>
                  <li>
                    <Link to="/jefe/areas" className="block px-2 py-1.5 rounded-md hover:bg-gray-700">
                      Áreas
                    </Link>
                  </li>
                </ul>
              )}

              {/* ===== CREAR ===== */}
              <button
                type="button"
                onClick={() => setOpenCrear(!openCrear)}
                className={`
                  flex items-center w-full justify-between px-2 py-2 text-sm rounded-md
                  hover:bg-gray-700
                  ${isMinified ? "justify-center" : ""}
                `}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 4v16m8-8H4" />
                  </svg>
                  {!isMinified && <span className="ml-3">Crear</span>}
                </div>

                {!isMinified && (
                  <svg
                    className={`w-4 h-4 transition-transform ${openCrear ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                  </svg>
                )}
              </button>

              {openCrear && !isMinified && (
                <ul className="space-y-1 pl-6">
                  <li>
                    <Link to="/crear-usuario" className="block px-2 py-1.5 rounded-md hover:bg-gray-700">
                      Usuarios
                    </Link>
                  </li>
                  <li>
                    <Link to="/crear-tarea" className="block px-2 py-1.5 rounded-md hover:bg-gray-700">
                      Tareas
                    </Link>
                  </li>
                  <li>
                    <Link to="/jefe/crear-areas" className="block px-2 py-1.5 rounded-md hover:bg-gray-700">
                      Áreas
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          )}
        </nav>

        {/* Footer del Sidebar - Botón Cerrar Sesión */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`
              w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white 
              hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500
              flex items-center justify-center
              ${isMinified ? 'px-2' : ''}
            `}
            title={isMinified ? "Cerrar sesión" : ""}
          >
            {isMinified ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            ) : (
              "Cerrar sesión"
            )}
          </button>
        </div>
      </aside>
    </>
  );
}