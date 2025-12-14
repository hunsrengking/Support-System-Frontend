const GlobalLoading = () => (
  // <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
  <div className="fixed inset-0 z-40 flex items-center justify-center">
    {/* <div className="bg-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4"> */}
    <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    {/* <span className="text-sm font-medium text-slate-700">Processing...</span> */}
    {/* </div> */}
  </div>
);

export default GlobalLoading;
