let showError = () => {};
let showSuccess = () => {};

export const errorService = {
  register(errorFn, successFn) {
    showError = errorFn;
    showSuccess = successFn;
  },
  error(message) {
    showError(message);
  },
  success(message) {
    showSuccess(message);
  },
};
