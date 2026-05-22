import React, { useState, useEffect } from "react";
import Container from "../../ui/Container";
import FormModal from "../../ui/FormModal";
import UserTable from "../../ui/UserTable";
import AddUser from "../../forms/AddUser";
import EditUser from "../../forms/EditUser";
import FormButton from "../../ui/Button";
import { useAuth } from "../../../context/AuthContext";
import DashboardHeader from "../../ui/DashboardHeader";
import ViewUser from "../../forms/ViewUser";
import ArchiveUser from "../../forms/ArchiveUser";
import { API_BASE } from '../../../utils/api';
import SearchBar from "../../ui/SearchBar";

import { useLocation, useNavigate } from 'react-router-dom';

const API = `${API_BASE}`;

export default function UserManagement() {
  const { token, apiFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [ArchiveUserTarget, setArchiveUserTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`${API}/users/`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      const all = Array.isArray(data) ? data : data.results || [];
      // Only show active users in UserManagement; deactivated ones go to Archive
      setUsers(all.filter(u => u.is_active !== false));
    } catch (e) {
      setError(e.message);
      console.error("Error fetching users:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (!loading && location.state?.viewId && users.length > 0) {
      const targetUser = users.find(u => u.id.toString() === location.state.viewId.toString());
      if (targetUser) {
        setViewTarget(targetUser);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [loading, location.state, users, navigate, location.pathname]);

  const handleAdd = async (form) => {
    try {
      const res = await apiFetch(`${API}/users/`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to add user: ${err.detail || "Unknown error"}`);
        return;
      }
      setOpenAdd(false);
      fetchUsers();
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const handleEdit = async (form) => {
    try {
      const body = { ...form };
      if (!body.password) delete body.password;
      const res = await apiFetch(`${API}/users/${editTarget.id}/`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to update user: ${err.detail || "Unknown error"}`);
        return;
      }
      setEditTarget(null);
      fetchUsers();
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const handleDeactivateUser = async () => {
    try {
      const res = await apiFetch(`${API}/users/${ArchiveUserTarget.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: false }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to deactivate user: ${err.detail || "Unknown error"}`);
        return;
      }
      setArchiveUserTarget(null);
      // Remove from selectedIds in case this user was checked
      setSelectedIds(prev => prev.filter(id => id !== ArchiveUserTarget.id));
      fetchUsers();
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) return;
    try {
      for (const id of selectedIds) {
        await apiFetch(`${API}/users/${id}/`, { method: 'DELETE' });
      }
      setSelectedIds([]);
      await fetchUsers();
      alert("Selected users deleted successfully.");
    } catch (err) {
      alert(`Error during bulk delete: ${err.message}`);
    }
  };

  const handleApprove = async (entry) => {
    if (!window.confirm(`Approve user ${entry.username}?`)) return;
    try {
      const res = await apiFetch(`${API}/users/${entry.id}/approve/`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to approve');
      await fetchUsers();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleReject = async (entry) => {
    if (!window.confirm(`Reject user ${entry.username}?`)) return;
    try {
      const res = await apiFetch(`${API}/users/${entry.id}/reject/`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reject');
      await fetchUsers();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredUsers = users.filter(u => {
    const s = search.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(s) ||
      u.username?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.role?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <Container>
        <div className="flex flex-row justify-between items-center">
          <DashboardHeader title="All Users" subtitle="Manage system access and roles." />
          <div className="flex gap-4 items-center">
            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">Total Users: {filteredUsers.length}</span>
            <FormButton label="Add New User" onClick={() => setOpenAdd(true)} bgcolor="" />
          </div>
        </div>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, username, email or role..." />
        {loading ? <p className="text-sm text-gray-400 py-6 text-center">Loading users...</p>
          : error ? <p className="text-sm text-red-400 py-6 text-center">{error}</p>
            : (
              <div className="flex flex-col gap-3">
                {selectedIds.length > 0 && (
                  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">{selectedIds.length} user(s) selected</span>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Clear</button>
                      <button onClick={handleBulkDelete} className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm">Delete Selected</button>
                    </div>
                  </div>
                )}
                <UserTable
                  users={filteredUsers}
                  selectedIds={selectedIds}
                  onEdit={setEditTarget}
                  onDelete={setArchiveUserTarget}
                  onView={setViewTarget}
                  onSelectionChange={setSelectedIds}
                />
              </div>
            )}
      </Container>

      <FormModal formtitle="Add New User" open={openAdd} handleClose={() => setOpenAdd(false)} size="2xl">
        <AddUser onSave={handleAdd} onCancel={() => setOpenAdd(false)} />
      </FormModal>

      <FormModal formtitle="Edit User" open={!!editTarget} handleClose={() => setEditTarget(null)}>
        <EditUser initial={editTarget || {}} onSave={handleEdit} onCancel={() => setEditTarget(null)} />
      </FormModal>

      <FormModal formtitle="Deactivate User" open={!!ArchiveUserTarget} handleClose={() => setArchiveUserTarget(null)}>
        <ArchiveUser user={ArchiveUserTarget} onArchive={handleDeactivateUser} onCancel={() => setArchiveUserTarget(null)} />
      </FormModal>

      <FormModal formtitle="View User" open={!!viewTarget} handleClose={() => setViewTarget(null)}>
        <ViewUser
          user={viewTarget}
          onApprove={async (user) => { await handleApprove(user); setViewTarget(null); }}
          onReject={async (user) => { await handleReject(user); setViewTarget(null); }}
        />
      </FormModal>
    </div>
  );
}