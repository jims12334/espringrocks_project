import {
  LayoutDashboard,
  NotepadText,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  ClipboardList,
  Menu,
  Archive,
} from "lucide-react";
import NavBarItem from "../ui/NavBarItem";
import { useAuth } from "../../context/AuthContext";
import logo from '../../assets/LOGO.png';

export default function NavigationBar({ collapse, setIsCollapsed }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "IT Administrator";

  return (
    <div
      className={`h-full flex flex-col transition-all duration-300 shadow-2xs 
      ${collapse ? "w-16" : "w-56"}`}
    >
      <nav className="flex-1 flex flex-col">
        {/* + MENU TOGGLE */}
        <div
          className={`flex items-center transition-a ${collapse ? "justify-center" : "justify-end"
            }`}
        >
          <button
            onClick={() => setIsCollapsed(!collapse)}
            className={`p-2 transition-colors rounded-lg hover:bg-black/20 ${collapse ? "mx-auto" : "mr-2"}`}
          >
            <Menu size={24} color="black" />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1">
          <li className={`list-none ${collapse ? "flex justify-center" : ""}`}>
            <ul className="space-y-2">
              {isAdmin ? (
                <>
                  <NavBarItem icon={LayoutDashboard} tolink="/dashboard" label="Dashboard" collapse={collapse} />
                  <NavBarItem icon={NotepadText} tolink="/orders" label="Orders" collapse={collapse} />
                  <NavBarItem icon={ShoppingBag} tolink="/products" label="Products" collapse={collapse} />
                  <NavBarItem icon={ShoppingCart} tolink="/customers" label="Customers" collapse={collapse} />
                  <NavBarItem icon={TrendingUp} tolink="/reports" label="Reports" collapse={collapse} />
                  <NavBarItem icon={Users} tolink="/usermanagement" label="User Management" collapse={collapse} />
                  <NavBarItem icon={Archive} tolink="/archive" label="Archive" collapse={collapse} />
                  <NavBarItem icon={ClipboardList} tolink="/audittrail" label="Audit Logs" collapse={collapse} />
                </>
              ) : (
                // Employee routes
                <>
                  <NavBarItem icon={LayoutDashboard} tolink="/employee/dashboard" label="Dashboard" collapse={collapse} />
                  <NavBarItem icon={NotepadText} tolink="/employee/orders" label="Orders" collapse={collapse} />
                  <NavBarItem icon={ShoppingBag} tolink="/employee/products" label="Products" collapse={collapse} />
                  <NavBarItem icon={ShoppingCart} tolink="/employee/customers" label="Customers" collapse={collapse} />
                  <NavBarItem icon={TrendingUp} tolink="/employee/reports" label="Reports" collapse={collapse} />
                </>
              )}
            </ul>
          </li>
        </div>
      </nav>
    </div>
  );
}