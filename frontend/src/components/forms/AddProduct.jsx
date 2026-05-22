import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Field from "../ui/Field";
import { CancelButton, AddButton } from "../ui/Button";
import { API_BASE } from "../../utils/api";

export default function AddProduct({ onSave, onCancel }) {
  const { apiFetch } = useAuth();
  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400";

  const [form, setForm] = useState({
    code: "",
    name: "",
    aggregate_type: "",
    volume_multiplier: "1.0",
    base_price: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.code || !form.name || !form.aggregate_type || !form.base_price) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const payload = {
        ...form,
        volume_multiplier: parseFloat(form.volume_multiplier) || 1.0,
        base_price: parseFloat(form.base_price),
      };
      const res = await apiFetch(`${API_BASE}/products/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // Django returns field-level errors as { field: ["msg"] }
        const messages = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
          .join(" | ");
        throw new Error(messages || "Failed to add product");
      }
      if (onSave) await onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Field label="Product Code">
        <input
          className={inputClass}
          placeholder="Enter product code"
          value={form.code}
          onChange={set("code")}
        />
      </Field>

      <Field label="Product Name">
        <input
          className={inputClass}
          placeholder="Enter product name"
          value={form.name}
          onChange={set("name")}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Aggregate Type">
          <select className={inputClass} value={form.aggregate_type} onChange={set("aggregate_type")}>
            <option value="">Select Type</option>
            <option value="Sand">Sand</option>
            <option value="Gravel">Gravel</option>
            <option value="Mixed">Mixed</option>
          </select>
        </Field>
        <Field label="Volume Multiplier">
          <input
            type="number"
            step="0.1"
            className={inputClass}
            placeholder="1.0"
            value={form.volume_multiplier}
            onChange={set("volume_multiplier")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Base Price (₱)">
          <input
            type="number"
            step="0.01"
            className={inputClass}
            placeholder="0.00"
            value={form.base_price}
            onChange={set("base_price")}
          />
        </Field>
        <Field label="Status">
          <select className={inputClass} value={form.status} onChange={set("status")}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </Field>
      </div>

      <div className="flex justify-end gap-2 mt-2">
        {onCancel && (
          <CancelButton onClick={onCancel} />
        )}
        <AddButton
          label="Add Product"
          onClick={handleSave}
          disabled={loading}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          }
        />
      </div>
    </div >
  );
}