import { Pencil, Archive, Eye } from "lucide-react";
import { ActionIconButton } from "./Button";

export default function OrderTable({ fields = [], entries = [], selectedIds = [], onView, onEdit, onDelete, onSelectionChange, onApprove, onReject }) {
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = entries.map((entry) => entry.invoice_number || entry.id);
            if (onSelectionChange) onSelectionChange(allIds);
        } else {
            if (onSelectionChange) onSelectionChange([]);
        }
    };

    const handleSelectOne = (id) => {
        const newSelected = selectedIds.includes(id)
            ? selectedIds.filter(selectedId => selectedId !== id)
            : [...selectedIds, id];

        if (onSelectionChange) onSelectionChange(newSelected);
    };

    const isAllSelected = entries.length > 0 && selectedIds.length === entries.length;

    return (
        <div className="overflow-x-auto w-full">
            <table className="rounded-xl w-full border overflow-hidden">
                <thead>
                    <tr className="border-b">
                        <th className="px-4 py-2 text-left w-10">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 accent-black cursor-pointer"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                            />
                        </th>
                        {fields.map((f) => (
                            <th key={f.key} className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider">
                                {f.name}
                            </th>
                        ))}
                        <th className="px-4 py-3 text-right text-xs font-bold uppercase text-black tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {entries.map((entry, idx) => {
                        const rowId = entry.invoice_number || entry.id || idx;
                        return (
                            <tr key={rowId} className={`text-black border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.includes(rowId) ? 'bg-blue-50/60' : ''}`}>
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        className="accent-black rounded cursor-pointer"
                                        checked={selectedIds.includes(rowId)}
                                        onChange={() => handleSelectOne(rowId)}
                                    />
                                </td>
                                {fields.map((f) => (
                                    <td key={f.key} className="px-4 py-3 text-sm text-black whitespace-nowrap">
                                        {f.key === 'invoice_number' ? (
                                            <span>{entry[f.key]}</span>
                                        ) : f.key === 'status' ? (
                                            <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${entry[f.key] === 'Paid' ? 'bg-green-100 text-green-700' :
                                                entry[f.key] === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {entry[f.key] || 'Pending'}
                                            </span>
                                        ) : f.key === 'total_price' || f.key === 'amount' || f.key === 'total_cubic' ? (
                                            typeof entry[f.key] === 'number' ? entry[f.key].toLocaleString('en-PH', { minimumFractionDigits: 2 }) : entry[f.key]
                                        ) : (
                                            entry[f.key]
                                        )}
                                    </td>
                                ))}
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                    <div className="flex items-center justify-end gap-2">

                                        {onView && (
                                            <ActionIconButton
                                                icon={Eye}
                                                onClick={() => onView(entry)}
                                                colorClass="hover:text-blue-500"
                                                title="View"
                                            />
                                        )}
                                        {onEdit && (
                                            <ActionIconButton
                                                icon={Pencil}
                                                onClick={() => onEdit(entry)}
                                                colorClass="hover:text-blue-500"
                                                title="Edit"
                                            />
                                        )}
                                        {onDelete && (
                                            <ActionIconButton
                                                icon={Archive}
                                                onClick={() => onDelete(entry)}
                                                title="Archive"
                                                colorClass="hover:text-amber-500"
                                            />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {entries.length === 0 && (
                        <tr>
                            <td colSpan={fields.length + 2} className="px-4 py-8 text-center text-gray-500 text-sm">
                                No records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
