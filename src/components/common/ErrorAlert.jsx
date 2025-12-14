import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useError } from "../../context/ErrorContext";

const ErrorAlert = () => {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg max-w-sm">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="mt-0.5 text-red-500"
        />

        <div className="text-sm flex-1">
          {error}
        </div>

        <button
          onClick={clearError}
          className="text-red-500 hover:text-red-700"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;
