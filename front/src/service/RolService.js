import api from "./api";

export async function obtenerRoles() {
    const response = await api.get("/rol"); // ✅ singular
    return response.data.response ?? response.data;
}
