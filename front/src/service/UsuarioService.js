// services/usuarioService.js
import api from "./api";

export async function obtenerUsuarios() {
    try {
        const response = await api.get("/Usuario/Listar");
        return response.data.response || [];
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        throw error;
    }
}

export const crearUsuario = async (data) => {
    try {
        // Asegurarse de que los números sean realmente números
        const dataToSend = {
            ...data,
            RolId: Number(data.RolId),
            AreaId: Number(data.AreaId),
            Telefono: data.Telefono || null
        };

        console.log('Enviando al backend:', dataToSend);

        const response = await api.post("/Usuario/Crear", dataToSend);

        console.log('Respuesta completa del backend:', response);

        // Si la respuesta está vacía pero el status es 200, puede ser un problema del backend
        if (!response.data && response.status === 200) {
            console.warn('Backend respondió con datos vacíos pero status 200');
            // Podemos considerar esto como éxito si el backend así lo indica
            return { success: true, message: 'Usuario creado exitosamente' };
        }

        return response;
    } catch (error) {
        console.error('Error en crearUsuario:', error);

        // Mejor manejo de errores
        if (error.response) {
            // El servidor respondió con un código de error
            console.error('Data del error:', error.response.data);
            console.error('Status del error:', error.response.status);
            console.error('Headers del error:', error.response.headers);

            // Si el backend devuelve un objeto con mensaje
            if (error.response.data && error.response.data.mensaje) {
                throw new Error(error.response.data.mensaje);
            }
        } else if (error.request) {
            // La petición fue hecha pero no hubo respuesta
            console.error('No se recibió respuesta del servidor');
            throw new Error('No se pudo conectar con el servidor. Verifique su conexión.');
        } else {
            // Algo pasó al configurar la petición
            console.error('Error de configuración:', error.message);
            throw error;
        }

        throw error;
    }
};

export const editarUsuario = async (data) => {
    try {
        const dataToSend = {
            Email: data.Email,
            Password: data.Password || "",
            Estado: data.Estado
        };

        const response = await api.put(
            `/Usuario/Actualizar/${data.UsuarioId}`,
            dataToSend
        );

        return response;
    } catch (error) {
        console.error("Error en editarUsuario:", error);
        throw error;
    }
};


export const eliminarUsuario = async (id, usuarioLogueadoId) => {
    try {
        // Asegúrate de usar la API base correcta
        const response = await api.delete(`/Usuario/${id}`, {
            params: { usuarioLogueadoId } // Enviar usuarioLogueadoId como parámetro
        });

        return response.data;
    } catch (error) {
        console.error('Error eliminando usuario:', error);

        if (error.response) {
            // El backend devuelve errores en `mensaje`
            const errorMessage = error.response.data?.mensaje ||
                error.response.data?.message ||
                'Error al eliminar usuario';
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('No se pudo conectar con el servidor');
        } else {
            throw error;
        }
    }
};
