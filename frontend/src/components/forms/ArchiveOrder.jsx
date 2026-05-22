import { CancelButton } from '../ui/Button';

export default function ArchiveOrderForm({ order, onConfirm, onCancel }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <p className="text-gray-700 text-[15px]">
                    Are you sure you want to archive order <span className="font-semibold">#{order?.invoice_number}</span>?
                </p>
                <p className="text-amber-500 text-sm font-medium">
                    The order will be moved to archived and can be restored later.
                </p>
            </div>
            <div className="flex justify-end gap-2">
                <CancelButton onClick={onCancel} />
                <button
                    onClick={() => onConfirm(order?.id)}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
                >
                    Archive Order
                </button>
            </div>
        </div>
    );
}