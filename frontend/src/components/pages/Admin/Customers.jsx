import React, { useState, useEffect } from "react";
import CheckboxTable from "../../ui/CheckboxTable";
import Button from "../../ui/Button";
import FormModal from "../../ui/FormModal";
import AddCustomer from "../../forms/AddCustomer";
import EditCustomerForm from "../../forms/EditCustomer";
import ViewCustomer from "../../forms/ViewCustomer";
import ArchiveCustomerForm from "../../forms/ArchiveCustomer";
import SearchBar from "../../ui/SearchBar";
import Container from "../../ui/Container";
import DashboardHeader from "../../ui/DashboardHeader";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE } from '../../../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';


export default function Customers() {
    const { token, apiFetch } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const [openAdd, setOpenAdd] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openArchive, setOpenArchive] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const fields = [
        { key: "hauler_name", name: "Hauler Name" },
        { key: "plate_number", name: "Plate Number" },
        { key: "length", name: "Length" },
        { key: "width", name: "Width" },
        { key: "lxw", name: "L*W" },
        { key: "approval_status", name: "Approval Status" }
    ];

    const fetchCustomers = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await apiFetch(`${API_BASE}/customers/`);
            if (!response.ok) throw new Error('Failed to fetch customers');
            const data = await response.json();
            const customersArray = Array.isArray(data) ? data : data.results || [];

            const active = customersArray.filter(c => c.approval_status !== 'Archived');
            const transformedData = active.map(customer => ({
                ...customer,
                lxw: customer.lxw ? (typeof customer.lxw === 'string' ? customer.lxw : `${parseFloat(customer.lxw).toFixed(2)}m²`) : 'N/A',
                length: customer.length ? `${customer.length}m` : 'N/A',
                width: customer.width ? `${customer.width}m` : 'N/A'
            }));

            setCustomers(transformedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [token]);

    useEffect(() => {
        if (!loading && location.state?.viewId && customers.length > 0) {
            const targetCustomer = customers.find(c => c.id.toString() === location.state.viewId.toString());
            if (targetCustomer) {
                setSelectedCustomer(targetCustomer);
                setOpenView(true);
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [loading, location.state, customers, navigate, location.pathname]);

    const handleAdd = async (form) => {
        try {
            const response = await apiFetch(`${API_BASE}/customers/`, {
                method: 'POST',
                body: JSON.stringify(form)
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(JSON.stringify(errData));
            }
            await fetchCustomers();
            setOpenAdd(false);
            alert("Customer added successfully!");
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleEdit = async (form) => {
        try {
            const response = await apiFetch(`${API_BASE}/customers/${selectedCustomer.id}/`, {
                method: 'PUT',
                body: JSON.stringify(form)
            });
            if (!response.ok) throw new Error('Failed to update');
            await fetchCustomers();
            setOpenEdit(false);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleArchive = async () => {
        try {
            const res = await apiFetch(`${API_BASE}/customers/${selectedCustomer.id}/`, {
                method: 'PATCH',
                body: JSON.stringify({ approval_status: 'Archived' }),
            });
            if (!res.ok) throw new Error('Failed to archive customer');
            await fetchCustomers();
            setOpenArchive(false);
            setSelectedIds([]);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleBulkArchive = async () => {
        if (!window.confirm(`Are you sure you want to archive ${selectedIds.length} customers?`)) return;
        try {
            for (const id of selectedIds) {
                await apiFetch(`${API_BASE}/customers/${id}/`, {
                    method: 'PATCH',
                    body: JSON.stringify({ status: 'Archived' }),
                });
            }
            setSelectedIds([]);
            await fetchCustomers();
            alert("Selected customers archived successfully.");
        } catch (err) {
            alert(`Error during bulk archive: ${err.message}`);
        }
    };

    const handleApprove = async (entry) => {
        if (!window.confirm(`Approve customer ${entry.hauler_name}?`)) return;
        try {
            const res = await apiFetch(`${API_BASE}/customers/${entry.id}/approve/`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to approve');
            await fetchCustomers();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleReject = async (entry) => {
        if (!window.confirm(`Reject customer ${entry.hauler_name}?`)) return;
        try {
            const res = await apiFetch(`${API_BASE}/customers/${entry.id}/reject/`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to reject');
            await fetchCustomers();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const onEditClick = (customer) => {
        setSelectedCustomer(customer);
        setOpenEdit(true);
    };

    const onArchiveClick = (customer) => {
        setSelectedCustomer(customer);
        setOpenArchive(true);
    };

    const filteredEntries = customers.filter(customer => {
        const searchLower = search.toLowerCase();
        return (
            customer.approval_status !== 'Archived' && (
                customer.hauler_name?.toLowerCase().includes(searchLower) ||
                customer.plate_number?.toLowerCase().includes(searchLower)
            )
        );
    });

    return (
        <div className="flex flex-col gap-2">
            <Container>
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-row justify-between items-center">
                        <DashboardHeader title="All Customers" subtitle="Manage and view your hauling clients." />
                        <div className="flex gap-4 items-center">
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">Total Customers: {filteredEntries.length}</span>
                            <Button label="Add Customer" onClick={() => setOpenAdd(true)} />
                        </div>
                    </div>

                    <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by hauler name or plate number" />

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading customers...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">Error loading customers: {error}</div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No customers found</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {selectedIds.length > 0 && (
                                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-xl border border-gray-200">
                                    <span className="text-sm font-semibold text-gray-700">{selectedIds.length} item(s) selected</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Clear</button>
                                        <button onClick={handleBulkArchive} className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">Archive Selected</button>
                                    </div>
                                </div>
                            )}
                            <CheckboxTable
                                fields={fields}
                                entries={filteredEntries}
                                selectedIds={selectedIds}
                                onView={(c) => { setSelectedCustomer(c); setOpenView(true); }}
                                onEdit={onEditClick}
                                onDelete={(c) => { setSelectedCustomer(c); setOpenArchive(true); }}
                                onSelectionChange={setSelectedIds}
                            />
                        </div>
                    )}
                </div>
            </Container>

            {/* ADD MODAL */}
            <FormModal formtitle="Add Customer" open={openAdd} handleClose={() => setOpenAdd(false)}>
                <AddCustomer onSave={handleAdd} onCancel={() => setOpenAdd(false)} />
            </FormModal>

            {/* VIEW MODAL */}
            <FormModal formtitle="View Customer" open={openView} handleClose={() => setOpenView(false)}>
                <ViewCustomer
                    customer={selectedCustomer}
                    onCancel={() => setOpenView(false)}
                    onApprove={async (customer) => { await handleApprove(customer); setOpenView(false); }}
                    onReject={async (customer) => { await handleReject(customer); setOpenView(false); }}
                />
            </FormModal>

            {/* EDIT MODAL */}
            <FormModal formtitle="Edit Customer" open={openEdit} handleClose={() => setOpenEdit(false)}>
                <EditCustomerForm
                    customer={selectedCustomer}
                    onSave={handleEdit}
                    onCancel={() => setOpenEdit(false)}
                />
            </FormModal>

            {/* ARCHIVE MODAL */}
            <FormModal formtitle="Archive Customer" open={openArchive} handleClose={() => setOpenArchive(false)}>
                <ArchiveCustomerForm
                    customer={selectedCustomer}
                    onConfirm={handleArchive}
                    onCancel={() => setOpenArchive(false)}
                />
            </FormModal>

        </div>
    );
}