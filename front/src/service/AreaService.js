import api from "./api";

export async function obtenerAreas() {
    const response = await api.get("/area"); // ✅ singular
    return response.data.response ?? response.data;
}
