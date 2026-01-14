import { useAuth } from "../auth/AuthContext";
import DashboardLayout from "../pages/DashboardLayout";
import HomeJefe from "../../src/components/Home/HomeJefe";
import HomeResponsable from "../../src/components/Home/HomeResponsable";
import HomeUsuario from "../../src/components/Home/HomeUsuario";

export default function Home() {
  const { perfil } = useAuth();

  return (
    <DashboardLayout>
      {/* BIENVENIDA */}
      <h1 className="text-3xl font-bold mb-6">
        Bienvenido, {perfil?.nombre} {perfil?.apellido}
      </h1>

      {/* CONTENIDO SEGÚN ROL */}
      {perfil?.rolId === 1 && <HomeJefe />}
      {perfil?.rolId === 2 && <HomeResponsable />}
      {perfil?.rolId === 3 && <HomeUsuario />}
    </DashboardLayout>
  );
}
