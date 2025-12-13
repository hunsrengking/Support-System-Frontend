let showError = () => {};

export const errorService = {
  register(fn) {
    showError = fn;
  },
  show(message) {
    showError(message);
  },
};
