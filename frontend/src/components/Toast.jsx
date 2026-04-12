export default function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 animate-fade-in rounded-xl border border-red-900/60 bg-red-950/90 px-4 py-3 text-sm text-red-100 shadow-xl">
      <div className="flex justify-between gap-2">
        <span>{message}</span>
        <button type="button" className="text-red-300 hover:text-white" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
