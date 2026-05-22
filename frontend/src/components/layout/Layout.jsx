import { useState, useRef, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Settings } from "lucide-react";
import FormModal from "../ui/FormModal";
import ProfileSettingsForm from "../forms/ProfileSettingsForm";
import { API_BASE } from '../../utils/api';
import LOGO from '../../assets/LOGO.png';

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [notificationList, setNotificationList] = useState([]);
  const { user, logout, apiFetch } = useAuth();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.role === 'IT Administrator') {
      const fetchPending = async () => {
        try {
          const res = await apiFetch(`${API_BASE}/dashboard/`);
          const notifRes = await apiFetch(`${API_BASE}/pending-approvals/`);
          if (res.ok) {
            const data = await res.json();
            setPendingApprovals(data.pending_approvals || 0);
          }
          if (notifRes.ok) {
            const notifData = await notifRes.json();
            setNotificationList(notifData);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchPending();
      const interval = setInterval(fetchPending, 30000);
      return () => clearInterval(interval);
    }
  }, [user, apiFetch]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="h-screen sticky top-0 py-5 px-3 bg-tertiary">
          <NavigationBar collapse={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </aside>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1">
          {/* HEADER */}
          <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
            {/* LEFT — Logo + Title */}
            <div className="flex items-center gap-3">
              <img src={LOGO} alt="Logo" width={60} height={60} />
              <div>
                <h1 className="text-lg font-semibold text-primary">
                  Espringrocks Aggregates Trading
                </h1>
                <p className="text-xs text-gray-400">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>{/* ← was missing */}

            {/* RIGHT — Notifications + Profile */}
            <div className="flex items-center gap-4 relative">
              {user?.role === 'IT Administrator' && (
                <div className="relative" ref={notificationRef}>
                  <div
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    {pendingApprovals > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </div>

                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[400px] flex flex-col overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <p className="text-sm font-semibold text-gray-800">Pending Approvals</p>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{pendingApprovals}</span>
                      </div>
                      <div className="overflow-y-auto flex-1">
                        {notificationList.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-gray-500">
                            No pending approvals at the moment.
                          </div>
                        ) : (
                          notificationList.map((notif) => (
                            <div
                              key={notif.id}
                              className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => {
                                setShowNotifications(false);
                                const idToView = notif.id.split('_')[1];
                                if (notif.type === 'Order') navigate('/orders', { state: { viewId: idToView } });
                                else if (notif.type === 'Product') navigate('/products', { state: { viewId: idToView } });
                                else if (notif.type === 'Customer') navigate('/customers', { state: { viewId: idToView } });
                                else if (notif.type === 'User') navigate('/users', { state: { viewId: idToView } });
                              }}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${notif.type === 'Order' ? 'bg-purple-100 text-purple-700'
                                  : notif.type === 'Product' ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                  }`}>
                                  {notif.type}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(notif.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-800 mb-0.5">{notif.name}</p>
                              <p className="text-xs text-gray-500">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 relative" ref={profileMenuRef}>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user?.full_name || "User"}</p>
                  <p className="text-xs text-gray-400">{user?.role || "—"}</p>
                </div>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  {getInitials(user?.full_name)}
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.full_name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    {user?.role === 'Employee' && (
                      <button
                        onClick={() => { setShowProfileMenu(false); setOpenSettings(true); }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings size={16} />
                        Profile Settings
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 py-5 px-5 bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>

      {/* GLOBAL MODALS */}
      <FormModal formtitle="Profile Settings" open={openSettings} handleClose={() => setOpenSettings(false)}>
        <ProfileSettingsForm onCancel={() => setOpenSettings(false)} />
      </FormModal>
    </div>
  );
}