let show = () => {};
let hide = () => {};

export const loadingService = {
  register(showFn, hideFn) {
    show = showFn;
    hide = hideFn;
  },
  show() {
    show();
  },
  hide() {
    hide();
  },
};
