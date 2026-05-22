export default function InputBox({ type = 'text', name, value, placeholder, className, onChange, label, disabled }) {
  return (
    <div className='flex flex-col gap-1 w-full'>
      {label && (
        <label className='text-[11px] font-semibold text-gray-500 text-left ml-1 uppercase tracking-wider'>
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`text-sm border border-border ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'} rounded-xl px-2.5 py-2 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${className || ''}`}
      />
    </div>
  )
}
