import React, { useState, useEffect } from "react";
import SearchBar from "../../ui/SearchBar";
import Button from "../../ui/Button";
import FormModal from "../../ui/FormModal";
import AddOrder from "../../forms/AddOrder";
import Container from "../../ui/Container";
import DashboardHeader from "../../ui/DashboardHeader";
import { useAuth } from "../../../context/AuthContext";
import EditOrderForm from "../../forms/EditOrder";
import OrderTable from "../../ui/OrderTable";
import ViewOrderForm from "../../forms/ViewOrder";
import { API_BASE } from '../../../utils/api';


export default function Orders() {
    const { token, apiFetch } = useAuth();
    const [orders, setOrders] = useState([]);
    const [rawOrders, setRawOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    const fields = [
        { key: "invoice_number", name: "Invoice #" },
        { key: "customer_name", name: "Customer" },
        { key: "amount", name: "Amount (m³)" },
        { key: "total_cubic", name: "Total Volume" },
        { key: "total_price", name: "Total Price" },
        { key: "status", name: "Status" },
    ];

    const fetchOrders = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await apiFetch(`${API_BASE}/orders/`);
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            const arr = Array.isArray(data) ? data : data.results || [];
            const active = arr.filter(o => o.status !== 'Archived');
            setRawOrders(active);
            setOrders(active.map(o => ({
                ...o,
                id: o.invoice_number,
                customer_name: o.customer_detail?.hauler_name || 'N/A',
                total_cubic: `${o.total_cubic?.toFixed(2) || 0}m³`,
                total_price: `₱${parseFloat(o.total_price || 0).toLocaleString('en-PH')}`,
            })));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, [token]);

    const handleEdit = async (form) => {
        try {
            const res = await apiFetch(`${API_BASE}/orders/${selectedOrder.invoice_number}/`, {
                method: 'PATCH',
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Failed to update order');
            await fetchOrders();
            setOpenEdit(false);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const filteredEntries = orders.filter(o => {
        const s = search.toLowerCase();
        return (
            o.invoice_number?.toString().includes(s) ||
            o.customer_name?.toLowerCase().includes(s) ||
            o.status?.toLowerCase().includes(s)
        );
    });

    return (
        <div className="flex flex-col gap-3">
            <Container>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between items-center">
                        <DashboardHeader title="All Orders" subtitle="Track and manage transaction history." />
                        <div className="flex gap-4 items-center">
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">Total Orders: {filteredEntries.length}</span>
                            <Button label="Add Order" onClick={() => setOpenAdd(true)} />
                        </div>
                    </div>
                    <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order number, customer or status..." />

                    {/* Add Modal */}
                    <FormModal formtitle="Add Order" open={openAdd} handleClose={() => setOpenAdd(false)}>
                        <AddOrder onSave={async () => { await fetchOrders(); setOpenAdd(false); }} />
                    </FormModal>

                    {/* Edit Modal */}
                    <FormModal formtitle="Edit Order" open={openEdit} handleClose={() => setOpenEdit(false)}>
                        <EditOrderForm
                            order={selectedOrder}
                            onSave={handleEdit}
                            onCancel={() => setOpenEdit(false)}
                        />
                    </FormModal>

                    {/* View Modal */}
                    <FormModal formtitle="View Order" open={openView} handleClose={() => setOpenView(false)}>
                        <ViewOrderForm
                            order={selectedOrder}
                            onCancel={() => setOpenView(false)}
                        />
                    </FormModal>

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading orders...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">Error loading orders: {error}</div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No orders found</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {selectedIds.length > 0 && (
                                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-xl border border-gray-200">
                                    <span className="text-sm font-semibold text-gray-700">{selectedIds.length} order(s) selected</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Clear Selection</button>
                                    </div>
                                </div>
                            )}
                            <OrderTable
                                fields={fields}
                                entries={filteredEntries}
                                selectedIds={selectedIds}
                                onView={(o) => { setSelectedOrder(o); setOpenView(true); }}
                                onEdit={(o) => { setSelectedOrder(o); setOpenEdit(true); }}
                                onSelectionChange={setSelectedIds}
                            />
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}
