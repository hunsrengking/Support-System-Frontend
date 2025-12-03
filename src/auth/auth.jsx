// src/auth/auth.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// keys stored in localStorage
const AUTH_TOKEN_KEY = "app_auth_token";
const AUTH_USER_KEY = "app_auth_user";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {},
  signOut: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() =>
    localStorage.getItem(AUTH_TOKEN_KEY)
  );
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // restore session from localStorage
  useEffect(() => {
    setLoading(false);
  }, []);

  // 🔐 login
  const signIn = async (token, userData) => {
    setToken(token);
    setUser(userData);

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));

    navigate("/dashboard");
  };

  // ❌ logout
  const signOut = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    navigate("/login");
  };

  // update user info
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loading, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth
export const useAuth = () => useContext(AuthContext);
