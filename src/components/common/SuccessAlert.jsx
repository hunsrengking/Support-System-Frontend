import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useError } from "../../context/ErrorContext";

const SuccessAlert = () => {
  const { success, clearSuccess } = useError();

  if (!success) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg max-w-sm">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="mt-0.5 text-green-500"
        />

        <div className="text-sm flex-1">{success}</div>

        <button
          onClick={clearSuccess}
          className="text-green-500 hover:text-green-700"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default SuccessAlert;
