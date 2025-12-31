import { useState, useEffect } from "react";
import DashboardLayout from "../../pages/DashboardLayout.jsx";
import { crearTarea } from "../../service/tareasService";
import { obtenerUsuarios } from "../../service/UsuarioService";

const CrearTareaForm = ({ areaId, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        area_ID: areaId,
        usuario_ID: 0,
        titulo: "",
        descripcion: "",
        estado: "Pendiente",
        prioridad: "Media",
        comentario: "" // Cambiado de "comentarios" a "comentario" para coincidir con el parámetro SQL
    });

    // Cargar usuarios
    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const response = await obtenerUsuarios();
                setUsuarios(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error(error);
                setErrors({ general: "Error al cargar usuarios" });
            } finally {
                setLoadingData(false);
            }
        };

        cargarUsuarios();
    }, []);

    useEffect(() => {
        setFormData(prev => ({ ...prev, area_ID: areaId }));
    }, [areaId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === "usuario_ID" ? Number(value) : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        if (successMessage) setSuccessMessage("");
    };

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formData.usuario_ID || formData.usuario_ID <= 0) {
            nuevosErrores.usuario_ID = "Debe asignar la tarea a un usuario";
        }

        if (!formData.titulo.trim()) {
            nuevosErrores.titulo = "El título es obligatorio";
        }

        if (!formData.descripcion.trim()) {
            nuevosErrores.descripcion = "La descripción es obligatoria";
        }

        return nuevosErrores;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const erroresValidacion = validarFormulario();
        if (Object.keys(erroresValidacion).length > 0) {
            setErrors(erroresValidacion);
            return;
        }

        setLoading(true);
        setErrors({});
        setSuccessMessage("");

        try {
            // Preparar datos para enviar al backend
            const datosParaEnviar = {
                ...formData,
                comentario: formData.comentario || "" // Asegurarse de que siempre se envíe
            };
            
            await crearTarea(datosParaEnviar);
            setSuccessMessage("Tarea creada y asignada correctamente");

            if (onSuccess) onSuccess();

            // Resetear formulario
            setFormData({
                area_ID: areaId,
                usuario_ID: 0,
                titulo: "",
                descripcion: "",
                estado: "Pendiente",
                prioridad: "Media",
                comentario: ""
            });

        } catch (error) {
            console.error("Error completo:", error);
            console.error("Respuesta del servidor:", error.response?.data);
            
            setErrors({
                general: error.response?.data?.detalle || 
                        error.response?.data?.mensaje || 
                        "Error al crear la tarea"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <DashboardLayout>
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow text-center">
                    <p className="text-gray-600">Cargando usuarios...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border">

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Crear Nueva Tarea
                </h2>
                <p className="text-gray-600">
                    Asigne la tarea a un usuario
                </p>
            </div>

            {/* Mensajes */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">{successMessage}</p>
                </div>
            )}

            {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">{errors.general}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Usuario */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Asignar a usuario <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="usuario_ID"
                        value={formData.usuario_ID}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg ${errors.usuario_ID
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                            }`}
                    >
                        <option value="0">-- Seleccione un usuario --</option>
                        {usuarios.map((u, index) => {
                            const id = u.id || u.usuario_ID || index + 1;
                            const nombre = `${u.nombre || u.Nombre} ${u.apellido || u.Apellido}`;
                            return (
                                <option key={id} value={id}>
                                    {nombre}
                                </option>
                            );
                        })}
                    </select>
                    {errors.usuario_ID && (
                        <p className="text-sm text-red-600">{errors.usuario_ID}</p>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Estado */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Estado <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        >
                            <option value="Inicial">Inicial</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Progreso">En Progreso</option>
                            <option value="Completada">Completada</option>
                            <option value="Atrasada">Atrasada</option>
                        </select>
                    </div>

                    {/* Prioridad */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Prioridad <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="prioridad"
                            value={formData.prioridad}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        >
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </div>

                </div>

                {/* Título */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Título *</label>
                    <input
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg ${errors.titulo ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                    />
                    {errors.titulo && (
                        <p className="text-sm text-red-600">{errors.titulo}</p>
                    )}
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Descripción *</label>
                    <textarea
                        name="descripcion"
                        rows={4}
                        value={formData.descripcion}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg ${errors.descripcion ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                    />
                    {errors.descripcion && (
                        <p className="text-sm text-red-600">{errors.descripcion}</p>
                    )}
                </div>
                
                {/* Comentarios */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Comentarios
                    </label>
                    <textarea
                        name="comentario" // Cambiado de "comentarios" a "comentario"
                        rows={3}
                        value={formData.comentario}
                        onChange={handleChange}
                        placeholder="Observaciones adicionales (opcional)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Botones */}
                <div className="flex justify-between pt-6 border-t">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Creando..." : "Crear Tarea"}
                    </button>
                </div>
            </form>
        </div>

    );
};

export default CrearTareaForm;