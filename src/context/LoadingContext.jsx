import React, { createContext, useContext, useEffect, useState } from "react";
import { loadingService } from "../services/loadingService";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  const showLoading = () => setCount((c) => c + 1);
  const hideLoading = () => setCount((c) => Math.max(0, c - 1));

  useEffect(() => {
    loadingService.register(showLoading, hideLoading);
  }, []);

  return (
    <LoadingContext.Provider value={{ loading: count > 0 }}>
      {children}
    </LoadingContext.Provider>
  );
};
