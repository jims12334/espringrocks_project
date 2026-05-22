export default function DashboardHeader({ title, subtitle }) {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl text-secondary font-bold tracking-tight leading-none">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 font-medium">{subtitle}</p>}
        </div>
    );
}   