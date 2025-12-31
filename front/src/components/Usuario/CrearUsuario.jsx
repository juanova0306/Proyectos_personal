// components/CrearUsuarioForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from "../../pages/DashboardLayout.jsx";
import { crearUsuario } from '../../service/UsuarioService.js';
import { obtenerAreas } from '../../service/AreaService.js';
import { obtenerRoles } from '../../service/RolService.js';

const CrearUsuarioForm = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [areas, setAreas] = useState([]);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        RolId: 0,
        AreaId: 0,
        Nombre: '',
        Apellido: '',
        Email: '',
        Telefono: '',
        Estado: true
    });
    const [errors, setErrors] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Cargar áreas y roles disponibles - SOLO UNA VEZ
    useEffect(() => {
        if (initialized) return;

        const cargarOpciones = async () => {
            setLoadingData(true);
            try {
                // Usar Promise.all para cargar ambas cosas simultáneamente
                const [areasResponse, rolesResponse] = await Promise.all([
                    obtenerAreas(),
                    obtenerRoles()
                ]);
                
                console.log('Áreas recibidas:', areasResponse);
                console.log('Roles recibidos:', rolesResponse);
                
                // Asegurar que son arrays
                const areasArray = Array.isArray(areasResponse) ? areasResponse : [];
                const rolesArray = Array.isArray(rolesResponse) ? rolesResponse : [];
                
                setAreas(areasArray);
                setRoles(rolesArray);
                
                setInitialized(true);
                
            } catch (error) {
                console.error('Error cargando opciones:', error);
                setErrors(prev => ({ 
                    ...prev, 
                    general: 'Error al cargar áreas y roles. Por favor, recargue la página.' 
                }));
            } finally {
                setLoadingData(false);
            }
        };

        cargarOpciones();
    }, [initialized]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
        
        // Limpiar error del campo si se modifica
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        // Limpiar mensaje de éxito
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const handleSelectChange = useCallback((e) => {
        const { name, value } = e.target;
        
        console.log(`Cambiando ${name}: valor seleccionado = ${value}, tipo: ${typeof value}`);
        
        // Convertir a número
        const numericValue = parseInt(value, 10);
        
        if (isNaN(numericValue)) {
            console.error(`Error: No se puede convertir ${value} a número para ${name}`);
            setErrors(prev => ({ ...prev, [name]: 'Valor inválido' }));
            return;
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: numericValue
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        // Limpiar mensaje de éxito
        if (successMessage) {
            setSuccessMessage('');
        }
    }, [errors, successMessage]);

    const validarFormulario = () => {
        const nuevosErrores = {};
        
        if (!formData.RolId || formData.RolId <= 0) {
            nuevosErrores.RolId = 'Debe seleccionar un rol válido';
        }
        
        if (!formData.AreaId || formData.AreaId <= 0) {
            nuevosErrores.AreaId = 'Debe seleccionar un área válida';
        }
        
        if (!formData.Nombre.trim()) {
            nuevosErrores.Nombre = 'El nombre es obligatorio';
        } else if (formData.Nombre.length < 2) {
            nuevosErrores.Nombre = 'El nombre debe tener al menos 2 caracteres';
        }
        
        if (!formData.Apellido.trim()) {
            nuevosErrores.Apellido = 'El apellido es obligatorio';
        } else if (formData.Apellido.length < 2) {
            nuevosErrores.Apellido = 'El apellido debe tener al menos 2 caracteres';
        }
        
        if (!formData.Email.trim()) {
            nuevosErrores.Email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            nuevosErrores.Email = 'El email no tiene un formato válido';
        }
        
        return nuevosErrores;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Datos del formulario al enviar:', formData);
        
        // Validar formulario
        const erroresValidacion = validarFormulario();
        if (Object.keys(erroresValidacion).length > 0) {
            setErrors(erroresValidacion);
            
            // Enfocar el primer campo con error
            const firstErrorField = Object.keys(erroresValidacion)[0];
            const element = document.querySelector(`[name="${firstErrorField}"]`);
            if (element) element.focus();
            
            return;
        }
        
        setLoading(true);
        setErrors({});
        setSuccessMessage('');
        
        try {
            // Preparar datos para enviar - VERIFICAR BIEN
            const datosEnviar = {
                RolId: Number(formData.RolId),
                AreaId: Number(formData.AreaId),
                Nombre: formData.Nombre.trim(),
                Apellido: formData.Apellido.trim(),
                Email: formData.Email.trim(),
                Telefono: formData.Telefono?.trim() || null,
                Estado: Boolean(formData.Estado)
            };
            
            console.log('=== DATOS QUE SE ENVIARÁN AL BACKEND ===');
            console.log('RolId:', datosEnviar.RolId, 'tipo:', typeof datosEnviar.RolId);
            console.log('AreaId:', datosEnviar.AreaId, 'tipo:', typeof datosEnviar.AreaId);
            console.log('Nombre:', datosEnviar.Nombre);
            console.log('Apellido:', datosEnviar.Apellido);
            console.log('Email:', datosEnviar.Email);
            console.log('Telefono:', datosEnviar.Telefono);
            console.log('Estado:', datosEnviar.Estado);
            console.log('======================================');
            
            // Enviar al backend
            const response = await crearUsuario(datosEnviar);
            
            console.log('Respuesta del backend:', response);
            
            // Éxito
            if (onSuccess) {
                onSuccess(response?.data);
            }
            
            // Mostrar mensaje de éxito
            setSuccessMessage('Usuario creado exitosamente. Se ha enviado un correo con la contraseña temporal.');
            
            // Resetear formulario después de 3 segundos
            setTimeout(() => {
                setFormData({
                    RolId: 0,
                    AreaId: 0,
                    Nombre: '',
                    Apellido: '',
                    Email: '',
                    Telefono: '',
                    Estado: true
                });
                setSuccessMessage('');
            }, 5000);
            
        } catch (error) {
            console.error('=== ERROR AL CREAR USUARIO ===');
            console.error('Error completo:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
            console.error('Response headers:', error.response?.headers);
            console.error('============================');
            
            let mensajeError = 'Error al crear el usuario. Intente nuevamente.';
            
            if (error.response) {
                // El servidor respondió con un código de error
                if (error.response.data?.mensaje) {
                    mensajeError = error.response.data.mensaje;
                } else if (error.response.data?.errors) {
                    // Si hay errores de validación del backend
                    const backendErrors = error.response.data.errors;
                    mensajeError = 'Errores de validación: ' + JSON.stringify(backendErrors);
                    
                    // Mapear errores específicos
                    Object.keys(backendErrors).forEach(key => {
                        if (key.includes('AreaId') || key.includes('$.AreaId')) {
                            setErrors(prev => ({ 
                                ...prev, 
                                AreaId: backendErrors[key][0] || 'Área inválida' 
                            }));
                        }
                        if (key.includes('RolId')) {
                            setErrors(prev => ({ 
                                ...prev, 
                                RolId: backendErrors[key][0] || 'Rol inválido' 
                            }));
                        }
                        if (key.includes('Email')) {
                            setErrors(prev => ({ 
                                ...prev, 
                                Email: backendErrors[key][0] || 'Email inválido' 
                            }));
                        }
                    });
                } else if (error.response.data?.title) {
                    mensajeError = error.response.data.title;
                }
            } else if (error.request) {
                // La petición fue hecha pero no hubo respuesta
                mensajeError = 'No se recibió respuesta del servidor. Verifique su conexión.';
            }
            
            setErrors(prev => ({ ...prev, general: mensajeError }));
            
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            RolId: 0,
            AreaId: 0,
            Nombre: '',
            Apellido: '',
            Email: '',
            Telefono: '',
            Estado: true
        });
        setErrors({});
        setSuccessMessage('');
    };

    if (loadingData) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Cargando áreas y roles...</p>
                </div>
            </div>
        );
    }

    return (
       <DashboardLayout>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Crear Nuevo Usuario</h2>
                <p className="text-gray-600">Complete todos los campos obligatorios (*)</p>
            </div>
            
            {/* Mensaje de éxito */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-green-700 font-medium">{successMessage}</p>
                    </div>
                </div>
            )}
            
            {/* Error general */}
            {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700 font-medium">{errors.general}</p>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campos en grid responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rol - Select */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Rol <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="RolId"
                            value={formData.RolId}
                            onChange={handleSelectChange}
                            disabled={loading}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.RolId 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-300'
                            } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="0">-- Seleccione un rol --</option>
                            {roles.map((rol, index) => {
                                // Según tu backend, verifica cómo vienen los datos
                                // Posibles nombres: rolId, id, rol_ID, etc.
                                const rolId = rol.rolId || rol.rol_ID || rol.id || (index + 1);
                                const rolNombre = rol.tipo || rol.Nombre || rol.rol || `Rol ${rolId}`;
                                
                                return (
                                    <option key={`rol-${rolId}-${index}`} value={rolId}>
                                        {rolNombre}
                                    </option>
                                );
                            })}
                        </select>
                        {errors.RolId && (
                            <p className="text-sm text-red-600 mt-1">{errors.RolId}</p>
                        )}
                        {roles.length === 0 && !loadingData && (
                            <p className="text-sm text-yellow-600 mt-1">No hay roles disponibles</p>
                        )}
                    </div>

                    {/* Área - Select */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Área <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="AreaId"
                            value={formData.AreaId}
                            onChange={handleSelectChange}
                            disabled={loading}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.AreaId 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-300'
                            } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="0">-- Seleccione un área --</option>
                            {areas.map((area, index) => {
                                // Según tus logs: {area_ID: 1, area: 'Contabilidad', descripcion: 'Area contable'}
                                const areaId = area.area_ID || area.areaId || area.id || (index + 1);
                                const areaNombre = area.area || area.nombre || area.Nombre || `Área ${areaId}`;
                                
                                return (
                                    <option key={`area-${areaId}-${index}`} value={areaId}>
                                        {areaNombre}
                                    </option>
                                );
                            })}
                        </select>
                        {errors.AreaId && (
                            <p className="text-sm text-red-600 mt-1">{errors.AreaId}</p>
                        )}
                        {areas.length === 0 && !loadingData && (
                            <p className="text-sm text-yellow-600 mt-1">No hay áreas disponibles</p>
                        )}
                    </div>

                    {/* Nombre */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="Nombre"
                            value={formData.Nombre}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Ej: Juan"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.Nombre 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-300'
                            } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                        {errors.Nombre && (
                            <p className="text-sm text-red-600 mt-1">{errors.Nombre}</p>
                        )}
                    </div>

                    {/* Apellido */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Apellido <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="Apellido"
                            value={formData.Apellido}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Ej: Pérez"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.Apellido 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-300'
                            } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                        {errors.Apellido && (
                            <p className="text-sm text-red-600 mt-1">{errors.Apellido}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="ejemplo@correo.com"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.Email 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-300'
                            } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                        {errors.Email && (
                            <p className="text-sm text-red-600 mt-1">{errors.Email}</p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Teléfono (Opcional)
                        </label>
                        <input
                            type="tel"
                            name="Telefono"
                            value={formData.Telefono}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Ej: +51 999 888 777"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.Telefono 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-300'
                            } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                        {errors.Telefono && (
                            <p className="text-sm text-red-600 mt-1">{errors.Telefono}</p>
                        )}
                    </div>
                </div>

                {/* Estado (Checkbox) */}
                <div className="flex items-center space-x-3 pt-2">
                    <input
                        type="checkbox"
                        id="Estado"
                        name="Estado"
                        checked={formData.Estado}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="Estado" className="text-sm text-gray-700">
                        Usuario activo (puede iniciar sesión inmediatamente)
                    </label>
                </div>

                {/* Nota informativa */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-blue-700">
                            Al crear el usuario, se generará automáticamente una contraseña temporal 
                            que será enviada al email proporcionado.
                        </p>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
                    <div className="flex space-x-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading}
                            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            Limpiar Formulario
                        </button>
                        
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={loading}
                                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading || formData.RolId === 0 || formData.AreaId === 0}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creando Usuario...
                            </span>
                        ) : (
                            'Crear Usuario'
                        )}
                    </button>
                </div>
            </form>
        </div>
        </DashboardLayout>
    );
};

export default CrearUsuarioForm;