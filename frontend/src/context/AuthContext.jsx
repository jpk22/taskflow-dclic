import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("taskflow_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persistSession = (userData, token) => {
    localStorage.setItem("taskflow_token", token);
    localStorage.setItem("taskflow_user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/login", { email, password });
      persistSession(data.user, data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Identifiants invalides.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, passwordConfirmation) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      persistSession(data.user, data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de créer le compte.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch {
      // Even if the request fails (e.g. token already expired), we still
      // clear the local session below.
    }
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    setUser(null);
  }, []);

  const value = { user, loading, error, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  return ctx;
}
