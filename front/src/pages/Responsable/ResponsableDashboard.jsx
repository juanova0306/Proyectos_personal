import DashboardLayout from "../DashboardLayout.jsx";
import { obtenerUsuarios } from "../../service/UsuarioService.js";
import { useEffect, useState } from "react";

export default function ResponsableDashboard() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const roles = {
        1: "Jefe",
        2: "Responsable",
        3: "Usuario",
    };

    useEffect(() => {
        obtenerUsuarios()
            .then(setUsuarios)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <p>Cargando usuarios...</p>
            </DashboardLayout>
        );
    }
    return (
        <DashboardLayout>
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h1 className="text-xl font-semibold">Dashboard Jefe</h1>
                <p className="text-sm text-gray-500">
                    Gestión de tareas y equipo
                </p>
            </div>

            {/* Tabla */}
            {usuarios.length === 0 ? (
                <p className="text-gray-500 mt-6">No hay usuarios registrados</p>
            ) : (
                <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                    <table className="w-full text-sm text-left text-body">
                        <thead className="bg-neutral-secondary-soft border-b border-default">
                            <tr>
                                <th className="px-6 py-3 font-medium">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 font-medium">
                                    Apellido
                                </th>
                                <th className="px-6 py-3 font-medium">
                                    Email
                                </th>
                                <th className="px-6 py-3 font-medium">
                                    Área
                                </th>
                                <th className="px-6 py-3 font-medium">
                                    Rol
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => (
                                <tr
                                    key={u.usuarioId}
                                    className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default"
                                >
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                                    >
                                        {u.nombre}
                                    </th>
                                    <td className="px-6 py-4">
                                        {u.apellido}
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.area ?? "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {roles[u.rolId] ?? "—"}
                                    </td>
                                    <td class="font-medium text-fg-brand hover:underline">Editar</td>
                                    <td class="font-medium text-fg-danger hover:underline">Eliminar</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>

    );
}
