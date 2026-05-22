export default function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-[12px] font-medium text-gray-700 uppercase tracking-wide text-left">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
