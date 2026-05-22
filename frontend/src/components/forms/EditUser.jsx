import React, { useState } from "react";
import InputBox from "../ui/InputBox";
import { CancelButton, AddButton } from "../ui/Button";

export default function EditUser({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    first_name: initial.first_name || "",
    middle_name: initial.middle_name || "",
    last_name: initial.last_name || "",
    username: initial.username || "",
    email: initial.email || "",
    contact_number: initial.contact_number || "",
    role: initial.role || "Employee",
    is_active: initial.is_active !== undefined ? initial.is_active : true,
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="flex flex-col gap-3 text-sm  bg-white rounded-2xl p-6 shadow-lg border border-gray-200 border-1">
      <div className="grid grid-cols-3 gap-2">
        <InputBox label="First Name" value={form.first_name} onChange={set("first_name")} />
        <InputBox label="Middle Name" value={form.middle_name} onChange={set("middle_name")} />
        <InputBox label="Last Name" value={form.last_name} onChange={set("last_name")} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <InputBox label="Username" value={form.username} onChange={set("username")} />
        <InputBox label="Email" value={form.email} onChange={set("email")} type="email" />
      </div>
      <div className="flex flex-col gap-1">
        <InputBox label="Contact Number" value={form.contact_number} onChange={set("contact_number")} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-gray-500 font-medium">Role</label>
          <select className="border border-gray-500 rounded-lg px-3 py-2 focus:outline-none"
            value={form.role} onChange={set("role")}>
            <option>Admin</option>
            <option>Employee</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-500 font-medium">Status</label>
          <select className="border border-gray-500 rounded-lg px-3 py-2 focus:outline-none"
            value={form.is_active ? "Active" : "Inactive"}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value === "Active" }))}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <CancelButton onClick={onCancel} />
        <AddButton onClick={() => onSave(form)} label="Save Changes" />
      </div>
    </div>
  );
}