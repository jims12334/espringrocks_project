import { Menu, MenuButton, MenuItem, MenuItems,} from '@headlessui/react'
import { ChevronDown } from 'lucide-react'

export default function Dropdown({

    label = 'Options',
    items = [],
    className = '',
    }) {

    return (
        
        <Menu as="div" className={`relative inline-block w-full ${className}`}>
            <MenuButton className="inline-flex w-100 justify-between gap-x-1.5 border border-border bg-white rounded-xl px-2.5 py-2 text-gray-500 text-sm inset-ring-1 inset-ring-white/5 hover:bg-white/20">
                {label}
                <ChevronDown aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>

            <MenuItems transition className="scrollbar-none absolute left-0 z-10 mt-2 h-32 overflow-y-scroll w-full origin-top-right border border-border bg-white rounded-xl px-2.5 py-2 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                <div className="py-1">
                    {items.map((item, index) => (
                    <MenuItem key={index}>
                    {item.href ? (
                <a href={item.href} className="block px-4 py-2 text-sm rounded-xl text-gray-500 hover:bg-primary hover:text-white">
                    {item.label}
                </a>
                ) : (
                <button type="button" onClick={item.onClick} className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                {item.label}
                </button>
                    )}
                    </MenuItem>
                ))}
                </div>
            </MenuItems>
        </Menu>
    )
}