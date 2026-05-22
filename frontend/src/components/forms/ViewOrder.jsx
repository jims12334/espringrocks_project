import React, { useRef } from "react";
import { Pencil, Printer } from "lucide-react";

const Row = ({ label, value, valueClass = "" }) => (
  <div className="flex justify-between items-start py-1">
    <span className="text-sm text-black font-bold">{label}</span>
    <span className={`text-sm text-right text-gray-800 ${valueClass}`}>{value}</span>
  </div>
);

const ReadField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-bold text-gray-800">{label}</label>
    <div className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white">
      {value || "—"}
    </div>
  </div>
);

export default function ViewOrder({ order, onEdit, onClose, onCancel, onApprove, onReject, onMarkPaid }) {
  const printRef = useRef();

  if (!order) return null;

  // Raw numeric values for calculations
  const lxw = parseFloat(order.lxw) || 0;
  const amount = parseFloat(order.amount) || 0;
  const totalCubic = parseFloat(order.total_cubic) || 0;
  const basePrice = parseFloat(order.product_detail?.base_price) || 0;

  const totalCubicWithWaste = totalCubic + (totalCubic * 0.07);

  const initialPrice = totalCubicWithWaste * basePrice;
  const initialWithVat = initialPrice + (initialPrice * 0.12);
  const taxRow = totalCubicWithWaste * 30; // 15 + 15
  const totalPrice = initialWithVat + taxRow;

  const fmtDate = (ts) => ts ? new Date(ts).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) : "—";
  const fmtTime = (ts) => ts ? new Date(ts).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—";

  // Helper function to format currency
  const fmt = (n) => {
    if (typeof n !== "number" && typeof n !== "string") return "₱0.00";
    const num = parseFloat(n);
    if (isNaN(num)) return "₱0.00";
    return `₱${num.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };


  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=600,height=800");
    win.document.write(`
      <html>
        <head>
          <title>Receipt #${order.invoice_number}</title>
          <style>
            @page { size: landscape; margin: 10mm; }
            body { font-family: sans-serif; padding: 24px; font-size: 13px; color: #333; }
            h2 { margin-bottom: 4px; }
            .section { margin-bottom: 16px; }
            .section-title { font-weight: bold; font-size: 15px; margin-bottom: 8px; border-bottom: 2px solid #f59e0b; padding-bottom: 4px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
            .field label { font-size: 10px; color: #888; text-transform: uppercase; }
            .field .val { border: 1px solid #ddd; border-radius: 6px; padding: 6px 10px; margin-top: 2px; background: #f9f9f9; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }
            .total { font-weight: bold; font-size: 15px; color: #16a34a; }
            .processed { text-align: center; font-size: 11px; color: #888; margin-top: 16px; }
            .processed span { color: #f59e0b; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto text-sm">
      {/* ── Order Details ── */}
      <div>
        <div className="flex justify-between items-start mb-3">
            <h2 className="text-base font-bold text-gray-800">Order Details</h2>
            <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${order.approval_status === 'Approved' ? 'bg-green-100 text-green-700' :
                order.approval_status === 'Rejected' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
            }`}>
                {order.approval_status}
            </span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <ReadField label="Hauler" value={order.customer_detail?.hauler_name} />
          <ReadField label="Plate Number" value={order.customer_detail?.plate_number} />
          <ReadField label="Product" value={order.product_detail?.name} />
          <ReadField label="Amount" value={`${amount} m`} />
          <ReadField label="Date" value={fmtDate(order.created_at)} />
          <ReadField label="Total Price" value={fmt(totalPrice)} />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-black">{order.is_delivery ? "Delivery" : "On-site"}</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-black">
            Processed by:{' '}
            <span className="text-green-600 font-medium">{order.processed_by_name || "—"}</span>
          </p>
          {onEdit && (
            <button
              onClick={() => onEdit(order)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#fcd48e] text-gray-900 text-sm font-semibold hover:bg-[#f3c26d] transition-colors"
            >
              <Pencil size={14} /> Edit Order
            </button>
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* ── Receipt (printable area) ── */}
      <div ref={printRef}>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Receipt</h2>

        <div className="space-y-3">
          {/* Block 1 */}
          <div className="pb-3 border-b border-gray-200">
            <Row label="L*W" value={`${parseFloat(lxw).toFixed(2)} m²`} />
            <Row label="Aggregate Amount" value={`${amount} m`} />
          </div>

          <div className="pb-3 border-b border-gray-200">
            <Row label="Total Cubic" value={`${parseFloat(totalCubic).toFixed(2)} m³`} />
            <Row label="Waste (7%)" value={`${(totalCubic * 0.07).toFixed(2)} m³`} />
            <Row label="Total Cubic + Waste" value={`${parseFloat(totalCubicWithWaste).toFixed(2)} m³`} valueClass="font-bold text-black" />
          </div>

          {/* Block 2 */}
          <div className="pb-3 border-b border-gray-200">
            <Row label="Total Cubic + Waste" value={`${parseFloat(totalCubicWithWaste).toFixed(2)} m³`} />
            <Row label="Price per Cubic Meter" value={`${fmt(basePrice).replace("₱", "")} per m³`} />
          </div>

          {/* Initial Price */}
          <div className="pb-3 border-b border-gray-200">
            <Row label="Initial Price" value={fmt(initialPrice)} valueClass="font-bold text-black" />
          </div>

          {/* Block 3 — VAT */}
          <div className="pb-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-black font-bold">Initial Price with VAT</span>
              <span className="text-[11px] font-bold text-gray-700">
                {fmt(initialPrice)} <span className="text-amber-500">+</span> ({fmt(initialPrice)} <span className="text-amber-500">* 0.12</span>)
              </span>
            </div>
            <div className="text-right font-bold text-black text-sm pt-2">
              {fmt(initialWithVat)}
            </div>
          </div>

          {/* Block 4 — Tax + ROW */}
          <div className="pb-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-black font-bold">Total Cubic + Tax + ROW</span>
              <span className="text-[11px] font-bold text-gray-700">
                {parseFloat(totalCubicWithWaste).toFixed(2)} m³ <span className="text-amber-500">* 30</span>
              </span>
            </div>
            <div className="text-right font-bold text-black text-sm pt-2">
              {fmt(taxRow)}
            </div>
          </div>

          {/* Block 5 — Totals */}
          <div className="pb-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-black font-bold">Initial Price with VAT + Tax</span>
              <span className="text-[11px] font-bold text-gray-700">
                {fmt(initialWithVat)} <span className="text-amber-500">+</span> {fmt(taxRow)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="text-sm font-bold text-gray-900">Total Price</span>
            <span className="text-sm font-bold text-green-600">{fmt(totalPrice)}</span>
          </div>
        </div>

        <p className="text-center text-xs text-black mt-6 mb-2">
          Processed by:{" "}
          <span className="text-green-600 font-medium">{order.processed_by_name || "—"}</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-2 gap-2">
        {order.approval_status === 'Pending' && onApprove && (
          <button
            onClick={() => onApprove(order)}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors"
          >
            Accept
          </button>
        )}
        {order.approval_status === 'Pending' && onReject && (
          <button
            onClick={() => onReject(order)}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
          >
            Reject
          </button>
        )}
        {order.approval_status !== 'Pending' && (
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-black/80 transition-colors"
          >
            <Printer size={15} /> Print Receipt
          </button>
        )}
        {order.approval_status === 'Approved' && order.status !== 'Paid' && onMarkPaid && (
          <button
            onClick={() => onMarkPaid(order)}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
          >
            Mark as Paid
          </button>
        )}
      </div>
    </div>
  );
}
