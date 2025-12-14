import React from "react";
import { ErrorProvider } from "./context/ErrorContext";
import { LoadingProvider } from "./context/LoadingContext";
import ErrorAlert from "./components/common/ErrorAlert";
import AppRoute from "./routes/AppRoute";

function App() {
  return (
    <ErrorProvider>
      <LoadingProvider>
        <ErrorAlert />
        <AppRoute />
      </LoadingProvider>
    </ErrorProvider>
  );
}

export default App;
