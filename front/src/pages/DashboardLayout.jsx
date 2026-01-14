import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO */}
      <main
        className="
          flex-1
          min-h-screen
          bg-gray-100
          pt-6 px-6
          md:ml-64
          transition-all duration-300
        "
      >
        {children}
      </main>

    </div>
  );
}
