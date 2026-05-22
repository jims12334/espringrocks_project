export default function Container({ children }) {
    return (
        <div className="bg-white rounded-lg shadow-sm flex flex-col gap-3 p-4 max-h-full overflow-hidden">
            {children}
        </div>
    );
}
