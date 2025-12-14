import React, { createContext, useContext, useEffect, useState } from "react";
import { errorService } from "../services/errorService";

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = (message, timeout = 4000) => {
    setError(message);
    if (timeout) {
      setTimeout(() => setError(null), timeout);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    errorService.register(showError);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};
