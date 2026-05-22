import { CancelButton } from '../ui/Button';

export default function ArchiveCustomerForm({ customer, onConfirm, onCancel }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <p className="text-gray-700 text-[15px]">
                    Are you sure you want to archive customer <span className="font-semibold">#{customer?.hauler_name}</span>?
                </p>
                <p className="text-amber-500 text-sm font-medium">
                    The customer will be moved to archived and can be restored later.
                </p>
            </div>
            <div className="flex justify-end gap-2">
                <CancelButton onClick={onCancel} />
                <button
                    onClick={() => onConfirm(customer?.id)}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-800 transition-colors"
                >
                    Deactivate Customer
                </button>
            </div>
        </div>
    );
}