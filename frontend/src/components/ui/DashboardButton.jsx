export default function DashboardButton({ icon: Icon, label, onClick }) {
    return (
        <div className='flex flex-col items-center group'>
            <button
                onClick={onClick}
                className="rounded-full bg-header p-1.5 hover:bg-primary transition-colors duration-300"
            >
                <Icon size={20} className="text-primary group-hover:text-white" />
            </button>
            <p className='text-[12px] text-black mt-2 font-medium w-18 text-center'>{label}</p>
        </div>
    )
}
