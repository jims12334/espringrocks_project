export default function Button({ label, onClick, bgcolor, textcolor }) {
    return (
        <button
            className={`group w-fit rounded-xl px-3 py-2 transition-all shadow-sm hover:bg-gray-100 border border-border ${bgcolor ?? ""} ${textcolor ? textcolor : "text-black"}`}
            onClick={onClick}
        >
            <p className="text-sm font-medium">{label}</p>
        </button>
    );
}

export function SaveButton({ label, onClick, disabled, icon }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="group flex items-center justify-center gap-2 w-fit rounded-xl px-5 py-2.5 border border-border text-sm font-semibold transition-all shadow-sm bg-primary text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {icon}
            <span>{label ?? "Save"}</span>
        </button>
    );
}

export function AddButton({ label, onClick, disabled, icon }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="group flex items-center justify-center gap-2 w-fit rounded-xl px-5 py-2.5 border border-border text-sm font-semibold transition-all shadow-sm bg-primary text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {icon}
            <span>{label ?? "Add"}</span>
        </button>
    );
}

export function CancelButton({ label = "Cancel", onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="group flex items-center justify-center gap-2 w-fit rounded-xl px-5 py-2.5 border border-border text-sm font-semibold transition-all shadow-sm bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <span>{label ?? "Cancel"}</span>
        </button>
    );
}

export function ArchiveButton({ label = "Archive", onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="group flex items-center justify-center gap-2 w-fit rounded-xl px-5 py-2.5 border border-border text-sm font-semibold transition-all shadow-sm bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <span>{label}</span>
        </button>
    );
}

export function ActionIconButton({ icon: Icon, onClick, title, colorClass }) {
    return (
        <button
            onClick={onClick}
            className={`text-gray-400 transition-colors ${colorClass}`}
            title={title}
        >
            <Icon size={15} />
        </button>
    );
}
