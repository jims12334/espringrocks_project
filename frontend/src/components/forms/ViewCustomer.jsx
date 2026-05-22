import React from "react";
import { Pencil } from "lucide-react";

const ReadField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-gray-500">{label}</label>
    <div className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white">
      {value || "—"}
    </div>
  </div>
);

export default function ViewCustomer({ customer, onEdit, onClose, onApprove, onReject }) {
  if (!customer) return null;

  const lxw = customer.lxw
    ? (typeof customer.lxw === "string" ? customer.lxw : `${parseFloat(customer.lxw).toFixed(2)}m²`)
    : "N/A";

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="mb-1 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            {customer.hauler_name}
          </h2>
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mt-0.5">
            {customer.location || "—"}
            {customer.address && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                {customer.address}
              </>
            )}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${
            customer.approval_status === 'Approved' ? 'bg-green-100 text-green-700' :
            customer.approval_status === 'Rejected' ? 'bg-red-100 text-red-700' :
            'bg-amber-100 text-amber-700'
        }`}>
            {customer.approval_status}
        </span>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-3">
        <ReadField label="Length" value={customer.length ? `${customer.length} m` : "—"} />
        <ReadField label="Width" value={customer.width ? `${customer.width} m` : "—"} />
      </div>

      {/* Contact */}
      <ReadField label="Contact Person" value={customer.contact_person} />
      <ReadField label="Contact Number" value={customer.contact_number} />
      <ReadField label="Email Address" value={customer.email} />

      {/* Actions */}
      <div className="flex justify-end mt-2 gap-2">
        {customer.approval_status === 'Pending' && onApprove && (
          <button
            onClick={() => onApprove(customer)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-all shadow-sm"
          >
            Accept
          </button>
        )}
        {customer.approval_status === 'Pending' && onReject && (
          <button
            onClick={() => onReject(customer)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-all shadow-sm"
          >
            Reject
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(customer)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-gray-900 text-sm font-semibold rounded-xl hover:bg-amber-500 transition-all shadow-sm"
          >
            <Pencil size={14} /> Edit Customer
          </button>
        )}
      </div>
    </div>
  );
}
