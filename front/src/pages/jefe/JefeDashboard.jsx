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
                <p>Cargando usuarios...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h1 className="text-xl font-semibold">Dashboard Jefe</h1>
                <p className="text-sm text-gray-500">
                    Vista administrativa
                </p>
            </div>

            {/* Tabla */}
            {usuarios.length === 0 ? (
                <p className="text-gray-500 mt-6">
                    No hay usuarios registrados
                </p>
            ) : (
                <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                    <table className="w-full text-sm text-left text-body">
                        <thead className="bg-neutral-secondary-soft border-b border-default">
                            <tr>
                                <th className="px-6 py-3 font-medium">Nombre</th>
                                <th className="px-6 py-3 font-medium">Apellido</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Área</th>
                                <th className="px-6 py-3 font-medium">Rol</th>
                                <th className="px-6 py-3 font-medium">Estado</th>
                                <th className="px-6 py-3 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => (
                                <tr
                                    key={u.usuarioId}
                                    className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default"
                                >
                                    <td className="px-6 py-4 font-medium text-heading">
                                        {u.nombre}
                                    </td>
                                    <td className="px-6 py-4">{u.apellido}</td>
                                    <td className="px-6 py-4">{u.email}</td>
                                    <td className="px-6 py-4">{u.area ?? "-"}</td>
                                    <td className="px-6 py-4">
                                        {roles[u.rolId] ?? "—"}
                                    </td>
                                    <td className="px-6 py-4">{u.estado}</td>
                                    <td className="px-6 py-4 flex gap-4">
                                        <button
                                            onClick={() => abrirModalEditar(u)}
                                            className="text-fg-brand hover:underline"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => abrirModalEliminar(u)}
                                            className="text-fg-danger hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODALES */}
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
