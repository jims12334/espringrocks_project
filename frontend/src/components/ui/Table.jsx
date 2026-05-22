export default function Table({ fields, entries }) {
    return (
        <div className="overflow-x-auto w-full">
            <table className="rounded-xl w-full border overflow-hidden table-fixed">
                <thead>
                    <tr className="border-b">
                        {fields.map((field) => (
                            <th key={field.key} className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider">
                                {field.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {entries.map((entry, i) => (
                        <tr key={i} className="text-black border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            {fields.map((field) => (
                                <td key={field.key} className="px-4 py-3 text-sm text-black whitespace-nowrap">
                                    {entry[field.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
