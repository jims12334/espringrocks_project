import { CancelButton } from '../ui/Button';

export default function ArchiveProductForm({ product, onCancel, onArchive }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <p className="text-gray-700 text-[15px]">
                    Are you sure you want to archive product <span className="font-semibold">{product?.name}</span>?
                </p>
                <p className="text-amber-500 text-sm font-medium">
                    The product will be moved to archived and can be restored later.
                </p>
            </div>
            <div className="flex justify-end gap-2">
                <CancelButton onClick={onCancel} label="Cancel" />
                <button
                    onClick={() => onArchive(product?.name)}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-white font-semibold hover:bg-gray-700 transition-colors"
                >
                    Archive Product
                </button>
            </div>
        </div>
    );
}