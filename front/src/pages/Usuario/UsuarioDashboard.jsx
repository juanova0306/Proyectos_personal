import { useEffect, useState } from "react";
import { obtenerTareas } from "../../service/tareasService.js";
import DashboardLayout from "../DashboardLayout.jsx";
import TareasTable from "../../components/tarea/TareasTable.jsx";

export default function UsuarioDashboard() {
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
          Mis tareas
        </h2>

        {loading ? (
          <p>Cargando tareas...</p>
        ) : (
          <TareasTable tareas={tareas} />
        )}
      </div>
    </DashboardLayout>
  );
}
