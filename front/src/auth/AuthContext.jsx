import React, { createContext, useState, useEffect, useContext } from "react";
import { decodeToken, isTokenExpired } from "../utils/jwt";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);   // payload JWT
  const [perfil, setPerfil] = useState(null);       // usuario completo
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //  Cargar sesión al refrescar
  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");

    if (!token) return;

    if (isTokenExpired(token)) {
      logout();
      return;
    }

    setAuthUser(decodeToken(token));
    setPerfil(usuario ? JSON.parse(usuario) : null);
    setIsLoggedIn(true);
  }, []);

  //  Login
  const login = (token, usuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    setAuthUser(decodeToken(token));
    setPerfil(usuario);
    setIsLoggedIn(true);
  };

  //  Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setAuthUser(null);
    setPerfil(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        perfil,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
