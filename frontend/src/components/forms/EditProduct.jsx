import React, { useState, useEffect } from "react";
import Field from "../ui/Field";
import { CancelButton, SaveButton } from "../ui/Button";

export default function EditProduct({ product, onSave, onCancel }) {
  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400";

  const [form, setForm] = useState({
    code: "",
    name: "",
    aggregate_type: "",
    volume_multiplier: "",
    base_price: "",
    status: "Active",
  });

  useEffect(() => {
    if (product) {
      setForm({
        code: product.code || "",
        name: product.name || "",
        aggregate_type: product.aggregate_type || "",
        volume_multiplier: product.volume_multiplier || "",
        base_price: product.base_price || "",
        status: product.status || "Active",
      });
    }
  }, [product]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="flex flex-col gap-3 w-full p-4 bg-white shadow-sm border border-gray-100 rounded-2xl max-w-105 mx-auto">
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
        <CancelButton onClick={onCancel} />
        <SaveButton label="Update Product" onClick={() => onSave(form)} />
      </div>
    </div>
  );
}
