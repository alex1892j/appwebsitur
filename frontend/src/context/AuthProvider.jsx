import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const api = axios.create({ baseURL: "http://localhost:3000/api" });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("authToken") || null); // Estado para el token
  const [error, setError] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const logout = useCallback(() => {
    sessionStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      const { accessToken, user: userData } = res.data;
      
      sessionStorage.setItem("authToken", accessToken);
      setToken(accessToken); // Actualizamos el estado del token
      setUser(userData);
      setError(null);
      return true;
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      const savedToken = sessionStorage.getItem("authToken");
      
      if (!savedToken) {
        setLoadingUser(false);
        return;
      }

      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        setUser(res.data);
        setToken(savedToken);
      } catch (e) {
        console.error("Token inválido o expirado. Limpiando sesión.");
        logout(); // Si el token no sirve, cerramos sesión por seguridad
      } finally {
        setLoadingUser(false);
      }
    };

    init();
  }, [logout]);

  const value = useMemo(() => ({
    user,
    token, // <--- AHORA SÍ ESTÁ DISPONIBLE PARA ProductList
    login,
    logout,
    error,
    loadingUser,
    isAdmin: user?.role === "ADMIN", // Verifica si tu backend devuelve "admin" o "ADMIN"
    isAuthenticated: !!user,
  }), [user, token, error, loadingUser, logout]);

  if (loadingUser) {
    return <div style={{textAlign: 'center', marginTop: '20%'}}>Cargando sesión...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};