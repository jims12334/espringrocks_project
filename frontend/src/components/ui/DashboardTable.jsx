export default function DashboardTable({ fields, entries }) {
    return (
        <div>
            <table className="rounded-xl w-full border overflow-hidden">
                <thead className="bg-primary">
                    <tr>
                        {fields.map((field) => (
                            <th key={field.id} className="px-4 py-2 text-left">
                                {field.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, i) => (
                        <tr key={i}>
                            {fields.map((field) => (
                                <td key={field.key} className="px-4 py-2 text-sm">
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
