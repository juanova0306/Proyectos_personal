import api from "../service/api";

export async function obtenerTareas() {
    const response = await api.get("/Tareas/Obtener");
    return response.data.response;
}

export async function obtenerTarea(id) {
    const response = await api.get(`/Tareas/Obtener/${id}`);
    return response.data.response;
}

export async function crearTarea(tarea) { 
    const response = await api.post("/Tareas/Crear", tarea);
    return response.data.response;
}
export async function actualizarTarea(id, tarea) {
    const response = await api.put(`/Tareas/Actualizar/${id}`, tarea);
    return response.data;
}

export async function eliminarTarea(id) {
    const response = await api.delete(`/Tareas/Eliminar/${id}`);
    return response.data.response;
}
