import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../service/authService";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { token, usuario } = await loginRequest({ email, password });
      login(token, usuario);
      const rol = Number(usuario.rolId);
      if (rol === 1) navigate("/home");
      else if (rol === 2) navigate("/home");
      else if (rol === 3) navigate("/home");
      else navigate("/no-autorizado");


    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Imagen lateral */}
      <div className="hidden lg:flex w-1/2 bg-primary">
        <img
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7"
          alt="Login"
          className="h-full w-full object-cover opacity-90"
        />
      </div>

      {/* Formulario */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Logo"
          />

          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Iniciar sesión
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Correo electrónico
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                             outline outline-1 outline-gray-300 placeholder:text-gray-400
                             focus:outline-2 focus:outline-primary sm:text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Contraseña
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                             outline outline-1 outline-gray-300 placeholder:text-gray-400
                             focus:outline-2 focus:outline-primary sm:text-sm"
                />
              </div>
            </div>

            {/* Botón */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5
                           text-sm font-semibold text-white shadow hover:bg-indigo-500
                           focus-visible:outline-2 focus-visible:outline-offset-2
                           focus-visible:outline-indigo-600"
              >
                Entrar
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Sistema Tasky © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
