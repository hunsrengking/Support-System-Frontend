const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
