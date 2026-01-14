import { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout.jsx";
import { obtenerUsuarios } from "../../service/UsuarioService.js";
import EditUserModal from "../../components/Usuario/EditarModal.jsx";
import DeleteUserModal from "../../components/Usuario/DeleteUserModal.jsx";

export default function JefeDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);

  const roles = {
    1: "Jefe",
    2: "Responsable",
    3: "Usuario",
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalOpen(true);
  };

  const cerrarModalEditar = () => {
    setModalOpen(false);
    setUsuarioSeleccionado(null);
  };

  const abrirModalEliminar = (usuario) => {
    setUsuarioEliminar(usuario);
    setDeleteModalOpen(true);
  };

  const cerrarModalEliminar = () => {
    setDeleteModalOpen(false);
    setUsuarioEliminar(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-gray-500">Cargando usuarios...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* ===== HEADER ===== */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-xl font-semibold">Dashboard Jefe</h1>
        <p className="text-sm text-gray-500">Vista administrativa</p>
      </div>

      {/* ===== TABLA ===== */}
      <div className="relative overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Nombre</th>
              <th className="px-6 py-3 font-semibold">Apellido</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Área</th>
              <th className="px-6 py-3 font-semibold">Rol</th>
              <th className="px-6 py-3 font-semibold">Estado</th>
              <th className="px-6 py-3 font-semibold text-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-6 text-center text-gray-500"
                >
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr
                  key={u.usuarioId}
                  className="odd:bg-white even:bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {u.nombre}
                  </td>
                  <td className="px-6 py-4">{u.apellido}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.area ?? "-"}</td>

                  {/* ROL */}
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                      {roles[u.rolId] ?? "—"}
                    </span>
                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-4">
                    {u.estado ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                        Inactivo
                      </span>
                    )}
                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button
                      onClick={() => abrirModalEditar(u)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => abrirModalEliminar(u)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== MODALES ===== */}
      <EditUserModal
        isOpen={modalOpen}
        onClose={cerrarModalEditar}
        usuario={usuarioSeleccionado}
        onSuccess={cargarUsuarios}
      />

      <DeleteUserModal
        isOpen={deleteModalOpen}
        usuario={usuarioEliminar}
        onClose={cerrarModalEliminar}
        onSuccess={cargarUsuarios}
      />
    </DashboardLayout>
  );
}
