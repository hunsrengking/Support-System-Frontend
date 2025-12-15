import React, { createContext, useContext, useEffect, useState } from "react";
import { errorService } from "../services/errorService";

const ErrorContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const showError = (message, timeout = 4000) => {
    setError(message);
    if (timeout) {
      setTimeout(() => setError(null), timeout);
    }
  };

  const showSuccess = (message, timeout = 3000) => {
    setSuccess(message);
    if (timeout) {
      setTimeout(() => setSuccess(null), timeout);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  useEffect(() => {
    errorService.register(showError, showSuccess);
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        error,
        success,
        showError,
        showSuccess,
        clearError,
        clearSuccess,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
