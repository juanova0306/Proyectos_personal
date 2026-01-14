import { useState, useEffect } from "react";
import { obtenerTareas } from "../../service/tareasService.js";
import DashboardLayout from "../DashboardLayout.jsx";
import TareasJefeTable from "../../components/tarea/TareasJefeTable.jsx";

export default function JefeVerTareas() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerTareas();
        setTareas(data);
      } catch (err) {
        console.error("Error al cargar tareas", err);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  // 🔥 ACTUALIZA SOLO UNA TAREA
  const actualizarTareaLocal = (tareaActualizada) => {
    setTareas(prev =>
      prev.map(t =>
        t.tarea_ID === tareaActualizada.tarea_ID
          ? { ...t, ...tareaActualizada }
          : t
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Todas las tareas
        </h2>

        {loading ? (
          <p>Cargando tareas...</p>
        ) : (
          <TareasJefeTable
            tareas={tareas}
            onTareaUpdated={actualizarTareaLocal}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
