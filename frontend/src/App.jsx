import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/layout/Layout";

// Admin Pages
import Dashboard from "./components/pages/Admin/Dashboard";
import Orders from "./components/pages/Admin/Orders";
import Products from "./components/pages/Admin/Products";
import Customers from "./components/pages/Admin/Customers";
import Reports from "./components/pages/Admin/Reports";
import UserManagement from "./components/pages/Admin/UserManagement";
import AuditTrail from "./components/pages/Admin/AuditTrail";
import Archive from "./components/pages/Admin/Archive";

// Employee Pages
import EmployeeDashboard from "./components/pages/Employee/Dashboard";
import EmployeeOrders from "./components/pages/Employee/Orders";
import EmployeeProducts from "./components/pages/Employee/Products";
import EmployeeCustomers from "./components/pages/Employee/Customers";
import EmployeeReports from "./components/pages/Employee/Reports";

import Login from "./components/pages/Login";
import { useAuth } from "./context/AuthContext";

// Protected Layout - checks authentication
function ProtectedLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout />;
}

function ProtectedLogin() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <Login />;
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'Employee') return <Navigate to="/employee/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

// Role-based protection for Admin routes
function AdminLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // Prevent Employees from accessing Admin routes
  if (user.role === 'Employee') return <Navigate to="/employee/dashboard" replace />;
  return <Outlet />;
}

// Role-based protection for Employee routes
function EmployeeLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Employee') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth routes */}

        <Route path="/" element={<RoleRedirect />} />
        <Route path="/login" element={<ProtectedLogin />} />

        {/* Protected routes — all under Layout */}
        <Route element={<ProtectedLayout />}>
          {/* Admin routes */}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/audittrail" element={<AuditTrail />} />
          </Route>

          {/* Employee routes */}
          <Route element={<EmployeeLayout />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/orders" element={<EmployeeOrders />} />
            <Route path="/employee/products" element={<EmployeeProducts />} />
            <Route path="/employee/customers" element={<EmployeeCustomers />} />
            <Route path="/employee/reports" element={<EmployeeReports />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
