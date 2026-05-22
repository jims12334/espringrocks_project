import React, { useState, useEffect } from 'react';
import InputBox from '../ui/InputBox';
import { AddButton, CancelButton } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/api';


export default function ProfileSettingsForm({ onCancel }) {
    const { user, apiFetch } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        username: "",
        email: "",
        contact_number: "",
        password: "",
        role: "",
        is_active: true,
        date_joined: ""
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.id) return;
            try {
                const res = await apiFetch(`${API_BASE}/users/${user.id}/`);
                if (res.ok) {
                    const data = await res.json();
                    setForm({
                        first_name: data.first_name || "",
                        middle_name: data.middle_name || "",
                        last_name: data.last_name || "",
                        username: data.username || "",
                        email: data.email || "",
                        contact_number: data.contact_number || "",
                        password: "",
                        role: data.role || "Employee",
                        is_active: data.is_active,
                        date_joined: data.date_joined ? new Date(data.date_joined).toLocaleDateString('en-PH') : ""
                    });
                }
            } catch (err) {
                console.error("Failed to load user data:", err);
            }
        };
        fetchUserData();
    }, [user, apiFetch]);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = { ...form };
            if (!payload.password) {
                delete payload.password;
            }
            // Remove read-only fields from payload
            delete payload.date_joined;
            delete payload.role;
            delete payload.is_active;

            const res = await apiFetch(`${API_BASE}/users/${user.id}/`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(JSON.stringify(err));
            }
            alert("Profile updated successfully! If you changed your username or password, please log in again.");
            setForm(prev => ({ ...prev, password: "" })); // clear password field
            if (onCancel) onCancel();
        } catch (error) {
            alert("Error updating profile: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 text-sm bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="grid grid-cols-3 gap-3">
                <InputBox label="First Name" value={form.first_name} onChange={set("first_name")} />
                <InputBox label="Middle Name" value={form.middle_name} onChange={set("middle_name")} placeholder="Optional" />
                <InputBox label="Last Name" value={form.last_name} onChange={set("last_name")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <InputBox label="Username" value={form.username} onChange={set("username")} />
                <InputBox label="Email" value={form.email} onChange={set("email")} type="email" />
            </div>

            <div className="pt-4 border-t border-gray-100 mt-1">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Additional Details</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <InputBox label="Contact Number" value={form.contact_number} onChange={set("contact_number")} />
                    <InputBox label="Role" value={form.role} disabled={true} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <InputBox label="Account Status" value={form.is_active ? "Active" : "Inactive"} disabled={true} />
                    <InputBox label="Date Joined" value={form.date_joined} disabled={true} />
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-2">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Security</h3>
                <InputBox
                    label="New Password"
                    placeholder="Leave blank to keep current password"
                    value={form.password}
                    onChange={set("password")}
                    type="password"
                />
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <CancelButton onClick={onCancel} />
                <AddButton
                    label={loading ? "Saving..." : "Save Changes"}
                    onClick={handleSave}
                />
            </div>
        </div>
    );
}
