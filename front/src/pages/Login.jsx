import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../service/authService";
import { useAuth } from "../auth/AuthContext";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { token, usuario } = await loginRequest({ email, password });
      login(token, usuario);

      const rol = Number(usuario.rolId);
      if ([1, 2, 3].includes(rol)) navigate("/home");
      else navigate("/no-autorizado");
    } catch {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-gray-100">

      {/* PANEL IZQUIERDO */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7"
          alt="Tasky"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-indigo-900/60" />

        {/* Texto superior */}
        <div className="relative z-10 p-12 text-white">
          <h1 className="text-4xl font-bold leading-tight">
            Bienvenido a Tasky
          </h1>

          <p className="mt-4 max-w-md text-lg text-indigo-100">
            La plataforma líder en gestión de proyectos y tareas colaborativas.
            Optimiza tu flujo de trabajo y aumenta la productividad de tu equipo.
          </p>
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

          {/* Logo */}
          <img
            className="mx-auto h-10"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Logo"
          />

          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Iniciar sesión
          </h2>

          <p className="text-center text-sm text-gray-500 mt-1">
            Accede a tu cuenta
          </p>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@empresa.com"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2
                             focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2
                             focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold
                         text-white shadow hover:bg-indigo-500 transition-all
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Entrar
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Sistema Tasky © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
