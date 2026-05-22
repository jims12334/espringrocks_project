import React from "react";
import { Pencil, Eye, Archive } from "lucide-react";
import { ActionIconButton } from "./Button";

const UserTable = ({ users, selectedIds = [], onEdit, onDelete, onArchive, onView, onSelectionChange }) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = users.map(user => user.id);
      if (onSelectionChange) onSelectionChange(allIds);
    } else {
      if (onSelectionChange) onSelectionChange([]);
    }
  };

  const handleSelectOne = (id) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    if (onSelectionChange) onSelectionChange(newSelected);
  };

  const isAllSelected = users && users.length > 0 && selectedIds.length === users.length;

  return (
    <div className="overflow-x-auto w-full">
      <table className="rounded-xl w-full border overflow-hidden">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left w-10">
              <input
                type="checkbox"
                className="rounded border-gray-300 accent-black cursor-pointer"
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider">Username</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider">Email</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider">Role</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase text-black tracking-wider">Status</th>
            <th className="px-4 py-3 text-right text-xs font-bold uppercase text-black tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.id}
                className={`text-black border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.includes(user.id) ? "bg-blue-50/60" : ""
                  }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="accent-black rounded cursor-pointer"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => handleSelectOne(user.id)}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-black font-medium whitespace-nowrap">{user.full_name}</td>
                <td className="px-4 py-3 text-sm text-black font-mono whitespace-nowrap">{user.username}</td>
                <td className="px-4 py-3 text-sm text-black whitespace-nowrap">{user.email}</td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${user.role === "IT Administrator"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onView && (
                      <ActionIconButton icon={Eye} onClick={() => onView(user)} colorClass="hover:text-blue-500" title="View User" />
                    )}
                    {onEdit && (
                      <ActionIconButton icon={Pencil} onClick={() => onEdit(user)} colorClass="hover:text-blue-500" title="Edit User" />
                    )}
                    {onDelete && (
                      <ActionIconButton icon={Archive} onClick={() => onDelete(user)} colorClass="hover:text-amber-500" title="Archive User" />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;