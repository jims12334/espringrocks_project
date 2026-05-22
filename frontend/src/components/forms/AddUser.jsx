import React, { useState } from "react";
import InputBox from "../ui/InputBox";
import { Eye, EyeOff } from "lucide-react";

export default function AddUser({ onSave, onCancel }) {
  const [form, setForm] = useState({
    first_name: "", middle_name: "", last_name: "",
    username: "", email: "", contact_number: "",
    role: "Employee", is_active: true, password: "employee123",
    confirm_password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Intercept role changes to auto-set/clear the password
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setForm(f => ({
      ...f, 
      role: newRole,
      password: newRole === "Employee" ? "employee123" : "",
      confirm_password: "",
    }));
    setError("");
  };

  const handleSave = () => {
    if (!form.first_name || !form.last_name || !form.username || !form.email) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.role === "IT Administrator") {
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      if (form.password !== form.confirm_password) {
        setError("Passwords do not match.");
        return;
      }
    }
    
    // Clean up confirm_password before sending to backend
    const { confirm_password, ...submitForm } = form;
    setError("");
    onSave(submitForm);
  };

  return (
    <div className="border border-gray-200 rounded-lg px-5 py-5 shadow-sm w-max[100px]">
      <div className="flex flex-col gap-3 text-sm py-3">
        {error && <div className="text-red-500 text-xs font-semibold mb-2">{error}</div>}
        <div className="grid grid-cols-3 gap-3">
          <InputBox label="First Name *" value={form.first_name} onChange={set("first_name")} placeholder="Enter First Name" />
          <InputBox label="Middle Name" value={form.middle_name} onChange={set("middle_name")} placeholder="Enter Middle Name" />
          <InputBox label="Last Name *" value={form.last_name} onChange={set("last_name")} placeholder="Enter Last Name" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputBox label="Username *" value={form.username} onChange={set("username")} placeholder="Enter Username" />
          <InputBox label="Email *" value={form.email} onChange={set("email")} type="email" placeholder="Enter Email" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputBox label="Contact Number" value={form.contact_number} onChange={set("contact_number")} placeholder="Enter Contact Number" />
          <div className="relative">
            <InputBox 
              label="Password *" 
              value={form.password} 
              onChange={set("password")} 
              type={form.role === "Employee" ? "text" : (showPassword ? "text" : "password")} 
              placeholder="••••••••" 
              disabled={form.role === "Employee"}
            />
            {form.role !== "Employee" && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            )}
          </div>
        </div>
        {form.role === "IT Administrator" && (
            <div className="grid grid-cols-2 gap-3">
                <div className="col-start-2 relative">
                    <InputBox 
                      label="Confirm Password *" 
                      value={form.confirm_password} 
                      onChange={set("confirm_password")} 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>
        )}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 text-left ml-1 uppercase tracking-wider">Role</label>
            <select className="border border-border bg-white text-sm rounded-xl px-2.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={form.role} onChange={handleRoleChange}>
              <option value="IT Administrator">IT Administrator</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 text-left ml-1 uppercase tracking-wider">Status</label>
            <select className="border border-border bg-white text-sm rounded-xl px-2.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={form.is_active ? "Active" : "Inactive"}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value === "Active" }))}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel}
            className="px-4 py-2 text-gray-500 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-sm">
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}