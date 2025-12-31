import { useState, useEffect } from "react";
import { obtenerTareas } from "../../service/tareasService.js";
import DashboardLayout from "../DashboardLayout.jsx";
import TareasJefeTable from "../../components/tarea/TareasJefeTable.jsx";

export default function JefeVerTareas() {
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerTareas()
            .then(setTareas)
            .finally(() => setLoading(false));
    }, []);
    return (
        <DashboardLayout>
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Todas las tareas
                </h2>
                {loading ? (
                    <p>Cargando tareas...</p>
                ) : (
                    <TareasJefeTable tareas={tareas} />
                )}
            </div>
        </DashboardLayout>
    );
}