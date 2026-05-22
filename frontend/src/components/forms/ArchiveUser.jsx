import { CancelButton } from '../ui/Button';

export default function ArchiveUser({ user, onCancel, onArchive }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <p className="text-gray-700 text-[15px]">
                    Are you sure you want to deactivate user <span className="font-semibold">{user?.full_name}</span>?
                </p>
                <p className="text-amber-500 text-sm font-medium">
                    The user will be marked as inactive but will remain in the user list.
                </p>
            </div>
            <div className="flex justify-end gap-2">
                <CancelButton onClick={onCancel} />
                <button
                    onClick={() => onArchive?.(user?.id)}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
                >
                    Deactivate User
                </button>
            </div>
        </div>
    );
}