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
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mis Tareas</h1>
          <p className="text-gray-600">Visualiza el estado de tus tareas asignadas</p>
        </div>

        <TareasTable tareas={tareas} />

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-700">
            <strong>Nota:</strong> Como usuario, solo puedes visualizar tus tareas asignadas.
            Para editar o eliminar tareas, contacta a tu responsable.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
