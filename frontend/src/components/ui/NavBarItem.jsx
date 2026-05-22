import { NavLink } from "react-router-dom";

export default function NavBarItem({ tolink, label, icon: Icon, collapse }) {
    return (
        <li className="group">
            <NavLink
                to={tolink}
                className={({ isActive }) =>
                    `flex items-center tracking-tight leading-none font-medium transition-all duration-300 ease-out
                    ${isActive
                        ? "bg-[#FDF1E3] text-gray-900 shadow-sm"
                        : "text-gray-800 hover:bg-black/5"
                    }
                    ${collapse
                        ? "w-11 h-11 justify-center rounded-2xl hover:rounded-[14px]"
                        : "px-4 py-3 gap-3.5 rounded-2xl w-full"
                    }`
                }
            >
                <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                {!collapse && <span>{label}</span>}
            </NavLink>
        </li>
    );
}