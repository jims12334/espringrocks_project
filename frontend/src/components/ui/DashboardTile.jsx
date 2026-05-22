export default function DashboardTile({ title, stat, subtitle }) {
    return (
        <div className="w-full bg-white px-4 py-3.5 rounded-xl shadow-xs">
            <h1 className="text-lg text-secondary font-medium tracking-tight leading-none mb-1">{title}</h1>
            <p className="text-3xl font-medium mb-0.5">{stat}</p>
            <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
    );
}
