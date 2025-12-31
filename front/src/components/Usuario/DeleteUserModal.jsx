import { eliminarUsuario } from "../../service/UsuarioService.js";

export default function DeleteUserModal({
    isOpen,
    onClose,
    usuario,
    onSuccess
}) {
    if (!isOpen || !usuario) return null;

    const handleDelete = async () => {
        try {
            await eliminarUsuario(usuario.usuarioId);
            onSuccess();
            onClose();
        } catch (error) {
            alert(error.message || "Error al eliminar usuario");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative p-4 w-full max-w-md">

                <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-6">

                    {/* Cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-body hover:bg-neutral-tertiary rounded-base w-9 h-9 flex items-center justify-center"
                    >
                        ✕
                    </button>

                    {/* Contenido */}
                    <div className="text-center">

                        {/* Icono */}
                        <svg
                            className="mx-auto mb-4 text-fg-disabled w-12 h-12"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0"
                            />
                        </svg>

                        {/* Texto */}
                        <h3 className="mb-6 text-body">
                            ¿Seguro que deseas eliminar al usuario?
                            <br />
                            <strong>
                                {usuario.nombre} {usuario.apellido}
                            </strong>
                        </h3>

                        {/* Botones */}
                        <div className="flex items-center justify-center space-x-4">
                            <button
                                onClick={handleDelete}
                                className="text-white bg-danger hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium rounded-base px-4 py-2.5 font-medium"
                            >
                                Sí, eliminar
                            </button>

                            <button
                                onClick={onClose}
                                className="text-body bg-neutral-secondary-medium hover:bg-neutral-tertiary-medium rounded-base px-4 py-2.5 font-medium"
                            >
                                Cancelar
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
