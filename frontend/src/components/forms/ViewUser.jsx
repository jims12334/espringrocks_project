export default function ViewUser({ user, onApprove, onReject }) {
    return (
        <div className="flex flex-col gap-4 max-w-md mx-auto text-sm">
            <div className="flex justify-between items-start mb-3">
                <h1 className='text-xl font-bold text-gray-800 tracking-tight'>User Details</h1>
            </div>
            <div className='grid grid-cols-2 gap-3 mb-3'>
                <div className='flex flex-col gap-1'>
                    <label className='text-[11px] text-gray-500'>First Name</label>
                    <div className='border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700'>
                        {user.first_name}
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-[11px] text-gray-500'>Last Name</label>
                    <div className='border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700'>
                        {user.last_name}
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-[11px] text-gray-500'>Username</label>
                    <div className='border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700'>
                        {user.username}
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-[11px] text-gray-500'>Email</label>
                    <div className='border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 '>
                        {user.email}
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-[11px] text-gray-500'>Phone</label>
                    <div className='border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 '>
                        {user.contact_number}
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-[11px] text-gray-500'>Role</label>
                    <div className='border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 '>
                        {user.role}
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-[11px] text-gray-500'>Is Active</label>
                    <div className='border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 '>
                        {user.is_active ? 'Yes' : 'No'}
                    </div>
                </div>
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-2 mt-2">
                {user.approval_status === 'Pending' && onApprove && (
                    <button
                        onClick={() => onApprove(user)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-all shadow-sm"
                    >
                        Accept
                    </button>
                )}
                {user.approval_status === 'Pending' && onReject && (
                    <button
                        onClick={() => onReject(user)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-all shadow-sm"
                    >
                        Reject
                    </button>
                )}
            </div>
        </div>
    );
}