import { Pencil, Eye, Archive } from "lucide-react";
import { ActionIconButton } from "./Button";

export default function CheckboxTable({ fields = [], entries = [], selectedIds = [], onView, onEdit, onDelete, onArchive, onSelectionChange, onApprove, onReject }) {
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = entries.map((entry, i) => entry.id || i);
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
        <div>
            <table className="rounded-xl w-full border table-fixed overflow-hidden">
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
                        {fields.map((field) => (
                            <th key={field.key} className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider">
                                {field.name}
                            </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider w-24">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {entries.map((entry, i) => (
                        <tr key={entry.id || i} className={`text-black border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.includes(entry.id || i) ? 'bg-blue-50/60' : ''}`}>
                            <td className="px-4 py-3">
                                <input
                                    type="checkbox"
                                    className="accent-black rounded cursor-pointer"
                                    checked={selectedIds.includes(entry.id || i)}
                                    onChange={() => handleSelectOne(entry.id || i)}
                                />
                            </td>
                            {fields.map((field) => (
                                <td key={field.key} className="px-4 py-3 text-sm text-black truncate">
                                    {field.key === 'base_price'
                                        ? (typeof entry[field.key] === 'number' || !isNaN(parseFloat(entry[field.key]))
                                            ? `₱${parseFloat(entry[field.key]).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                            : entry[field.key])
                                        : field.key === 'approval_status' ? (
                                            <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${entry[field.key] === 'Approved' ? 'bg-green-100 text-green-700' :
                                                entry[field.key] === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {entry[field.key]}
                                            </span>
                                        ) : field.key === 'status'
                                            ? <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${entry[field.key] === 'Inactive' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {entry[field.key] || 'Active'}
                                            </span>
                                            : entry[field.key]}
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
                                            colorClass="hover:text-gray-700"
                                            title="Delete"
                                        />
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}