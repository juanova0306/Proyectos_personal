import { useState } from "react";
import DashboardLayout from "../DashboardLayout.jsx";
import CrearTareaForm from "../../components/tarea/CrearTarea.jsx";

export default function CrearTareaPage() {
    const [openModal, setOpenModal] = useState(false);

    const areaId = 1; // ← normalmente vendría del usuario logueado

    const handleCreated = () => {
        console.log("Tarea creada, refrescar lista");
        // aquí puedes volver a llamar tu fetch de tareas
    };

    return (
        <DashboardLayout>


            <CrearTareaForm
                open={openModal}
                onClose={() => setOpenModal(false)}
                onCreated={handleCreated}
                areaId={areaId}
            />
        </DashboardLayout>
    );
}
