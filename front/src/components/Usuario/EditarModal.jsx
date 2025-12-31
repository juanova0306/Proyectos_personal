import { useEffect, useState } from "react";
import { editarUsuario } from "../../service/UsuarioService.js";
import api from "../../service/api.js";



export default function EditUserModal({ isOpen, onClose, usuario, onSuccess }) {
    const [form, setForm] = useState({
        UsuarioId: "",
        Email: "",
        Password: "",
        Estado: true
    });

    useEffect(() => {
        if (usuario) {
            setForm({
                UsuarioId: usuario.usuarioId,
                Email: usuario.email,
                Password: "",
                Estado: true
            });
        }
    }, [usuario]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editarUsuario(form);
            onSuccess();
            onClose();
        } catch (error) {
            alert(error.message || "Error al actualizar usuario");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-full max-w-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Editar Usuario</h3>
                    <button onClick={onClose}>✖</button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="Email"
                            value={form.Email}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Nueva contraseña (opcional)
                        </label>
                        <input
                            type="password"
                            name="Password"
                            value={form.Password}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="Estado"
                            checked={form.Estado}
                            onChange={handleChange}
                        />
                        <label>Usuario activo</label>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

