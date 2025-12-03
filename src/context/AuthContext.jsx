import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AUTH_TOKEN_KEY = "app_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
