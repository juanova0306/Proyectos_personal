import { useState, useEffect } from "react";
import { obtenerTareas } from "../../service/tareasService.js";
import DashboardLayout from "../DashboardLayout.jsx";
import TareasResponsableTable from "../../components/tarea/TareasResponsable.jsx";

export default function ResponsableVerTareas() {
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const usuarioLogueadoId = localStorage.getItem("usuario_ID");

    useEffect(() => {
        obtenerTareas()
            .then(setTareas)
            .finally(() => setLoading(false));
    }, []);
    return (
        <DashboardLayout>
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Mis tareas
                </h2>
                {loading ? (
                    <p>Cargando tareas...</p>
                ) : (
                    <TareasResponsableTable tareas={tareas} usuarioLogueadoId={usuarioLogueadoId} />
                )}
            </div>
        </DashboardLayout>
    );
}
