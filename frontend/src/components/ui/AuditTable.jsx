const formatDate = (ts) => {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export default function AuditTable({ logs }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="rounded-xl w-full border overflow-hidden">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider w-16">#</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider">User</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider">Action</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider">Timestamp</th>
          </tr >
        </thead >
        <tbody className="divide-y divide-gray-100">
          {logs.map((log, i) => (
            <tr key={log.id} className="text-black border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-black font-mono whitespace-nowrap">
                {String(i + 1).padStart(3, "0")}
              </td>
              <td className="px-4 py-3 text-sm text-black whitespace-nowrap">{log.username}</td>
              <td className="px-4 py-3 text-sm text-black whitespace-nowrap">{log.action}</td>
              <td className="px-4 py-3 text-sm text-black font-mono whitespace-nowrap">{formatDate(log.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table >
    </div >
  );
}