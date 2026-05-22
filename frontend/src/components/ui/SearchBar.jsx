import { Search } from 'lucide-react'

export default function SearchBar({ name, value, placeholder, onChange }) {
    return (
        <div className="flex items-center gap-2.5 text-sm border border-gray-600/80 bg-white rounded-xl px-2.5 py-1.5 w-88">
            <Search size={15} className='text-gray-500' />
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder || 'Search'}
                className="outline-none text-sm placeholder:text-gray-500 bg-transparent w-92" />
        </div>
    )
}
