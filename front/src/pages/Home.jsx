import { useAuth } from "../auth/AuthContext";
import DashboardLayout from "../pages/DashboardLayout";

export default function Home() {
  const { authUser, perfil } = useAuth();

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido, {perfil?.nombre} {perfil?.apellido}
      </h1>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bienvenido al sistema de gestión de tareas <span className="text-blue-600">Tasky</span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
            Este es tu panel principal. Desde aquí puedes acceder a las
            funcionalidades según tu rol.
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}
