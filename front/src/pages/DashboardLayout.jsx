import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function Layout({ children }) {
  const [isMinified, setIsMinified] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar con control real */}
      <Sidebar isMinified={isMinified} setIsMinified={setIsMinified} />

      {/* Contenido */}
      <main className="flex-1 p-6 transition-all duration-300">
        {children}
      </main>

    </div>
  );
}
