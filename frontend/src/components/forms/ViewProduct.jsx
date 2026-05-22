import React from "react";
import { Pencil } from 'lucide-react';

const ReadField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold">{label}</label>
    <div className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 ">
      {value || "—"}
    </div>
  </div>
);

export default function ViewProduct({ product, onEdit, onClose, onApprove, onReject }) {
  if (!product) return null;

  const statusColor =
    product.status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-500";

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-sm text-gray-500 font-mono">{product.code}</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full ${statusColor}`}>
            {product.status}
          </span>
          <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full ${product.approval_status === 'Approved' ? 'bg-green-100 text-green-700' :
              product.approval_status === 'Rejected' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
          }`}>
            {product.approval_status}
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-3">
        <ReadField label="Aggregate Type" value={product.aggregate_type} />
        <ReadField label="Volume Multiplier" value={product.volume_multiplier ? `${product.volume_multiplier}×` : "—"} />
      </div>
      <ReadField label="Base Price (₱)" value={product.base_price} />
      <ReadField label="Created At" value={product.created_at} />

      {/* Actions */}
      <div className="flex justify-end mt-2 gap-2">
        {product.approval_status === 'Pending' && onApprove && (
          <button
            onClick={() => onApprove(product)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-all shadow-sm"
          >
            Accept
          </button>
        )}
        {product.approval_status === 'Pending' && onReject && (
          <button
            onClick={() => onReject(product)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-all shadow-sm"
          >
            Reject
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(product)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-gray-900 text-sm font-semibold rounded-xl hover:bg-amber-500 transition-all shadow-sm"
          >
            <Pencil size={14} /> Edit Product
          </button>
        )}
      </div>
    </div>
  );
}
