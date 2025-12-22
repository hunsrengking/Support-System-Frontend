import React from "react";
import { ErrorProvider } from "./context/ErrorContext";
import { LoadingProvider } from "./context/LoadingContext";
import ErrorAlert from "./components/common/ErrorAlert";
import AppRoute from "./routes/AppRoute";
import SuccessAlert from "./components/common/SuccessAlert";

function App() {
  return (
    <ErrorProvider>
      <LoadingProvider>
        <ErrorAlert />
        <SuccessAlert/>
        <AppRoute />
      </LoadingProvider>
    </ErrorProvider>
  );
}

export default App;
