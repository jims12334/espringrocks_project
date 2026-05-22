import React, { useState, useEffect } from "react";
import SearchBar from "../../ui/SearchBar";
import Container from "../../ui/Container";
import DashboardHeader from "../../ui/DashboardHeader";
import { useAuth } from "../../../context/AuthContext";
import CheckboxTable from "../../ui/CheckboxTable";
import UserTable from "../../ui/UserTable";
import ViewOrderForm from "../../forms/ViewOrder";
import ViewCustomer from "../../forms/ViewCustomer";
import ViewProduct from "../../forms/ViewProduct";
import ViewUser from "../../forms/ViewUser";
import FormModal from "../../ui/FormModal";
import { API_BASE } from '../../../utils/api';

export default function Archive() {
    const { token, apiFetch } = useAuth();
    const [activeTab, setActiveTab] = useState('orders');
    const [archivedOrders, setArchivedOrders] = useState([]);
    const [archivedCustomers, setArchivedCustomers] = useState([]);
    const [archivedProducts, setArchivedProducts] = useState([]);
    const [archivedUsers, setArchivedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [openView, setOpenView] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // Fields configuration for each tab
    const orderFields = [
        { key: "invoice_number", name: "Invoice #" },
        { key: "customer_name", name: "Customer" },
        { key: "amount", name: "Amount (m³)" },
        { key: "total_cubic", name: "Total Volume" },
        { key: "total_price", name: "Total Price" },
        { key: "status", name: "Payment Status" },
    ];

    const customerFields = [
        { key: "hauler_name", name: "Hauler Name" },
        { key: "plate_number", name: "Plate Number" },
        { key: "length", name: "Length" },
        { key: "width", name: "Width" },
        { key: "lxw", name: "L*W" },
        { key: "approval_status", name: "Approval Status" }
    ];

    const productFields = [
        { key: "code", name: "Code" },
        { key: "name", name: "Name" },
        { key: "aggregate_type", name: "Type" },
        { key: "base_price", name: "Base Price" },
        { key: "status", name: "Status" },
        { key: "created_at", name: "Created at" },
    ];

    const userFields = [
        { key: "full_name", name: "Full Name" },
        { key: "username", name: "Username" },
        { key: "email", name: "Email" },
        { key: "role", name: "Role" },
        { key: "is_active_label", name: "Status" },
    ];

    // Fetch all archived data
    const fetchArchivedData = async () => {
        if (!token) return;
        try {
            setLoading(true);

            const ordersRes = await apiFetch(`${API_BASE}/orders/`);
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                const ordersList = Array.isArray(ordersData) ? ordersData : ordersData.results || [];
                const archived = ordersList.filter(o => o.status === 'Archived');
                setArchivedOrders(archived.map(o => ({
                    ...o,
                    customer_name: o.customer_detail?.hauler_name || 'N/A',
                    total_cubic: `${o.total_cubic?.toFixed(2) || 0}m³`,
                    total_price: `₱${parseFloat(o.total_price || 0).toLocaleString('en-PH')}`,
                })));
            }

            const customersRes = await apiFetch(`${API_BASE}/customers/`);
            if (customersRes.ok) {
                const customersData = await customersRes.json();
                const customersList = Array.isArray(customersData) ? customersData : customersData.results || [];
                const archived = customersList.filter(c => c.approval_status === 'Archived');
                setArchivedCustomers(archived.map(c => ({
                    ...c,
                    lxw: c.lxw ? (typeof c.lxw === 'string' ? c.lxw : `${parseFloat(c.lxw).toFixed(2)}m²`) : 'N/A',
                    length: c.length ? `${c.length}m` : 'N/A',
                    width: c.width ? `${c.width}m` : 'N/A'
                })));
            }

            const productsRes = await apiFetch(`${API_BASE}/products/`);
            if (productsRes.ok) {
                const productsData = await productsRes.json();
                const productsList = Array.isArray(productsData) ? productsData : productsData.results || [];
                const archived = productsList.filter(p => p.status === 'Archived');
                setArchivedProducts(archived.map(p => ({
                    ...p,
                    created_at: new Date(p.created_at).toLocaleDateString('en-PH'),
                })));
            }

            // Fetch deactivated users (is_active === false)
            const usersRes = await apiFetch(`${API_BASE}/users/`);
            if (usersRes.ok) {
                const usersData = await usersRes.json();
                const usersList = Array.isArray(usersData) ? usersData : usersData.results || [];
                const deactivated = usersList.filter(u => u.is_active === false);
                setArchivedUsers(deactivated.map(u => ({
                    ...u,
                    is_active_label: 'Deactivated',
                })));
            }

            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchArchivedData(); }, [token]);

    // Clear selection when tab changes
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearch("");
        setSelectedIds([]);
    };

    // Restore logic per tab
    const handleRestoreSelected = async () => {
        if (!window.confirm(`Restore ${selectedIds.length} item(s)?`)) return;
        try {
            if (activeTab === 'orders') {
                for (const id of selectedIds) {
                    await apiFetch(`${API_BASE}/orders/${id}/`, {
                        method: 'PATCH',
                        body: JSON.stringify({ status: 'Pending' }),
                    });
                }
            } else if (activeTab === 'customers') {
                for (const id of selectedIds) {
                    await apiFetch(`${API_BASE}/customers/${id}/`, {
                        method: 'PATCH',
                        body: JSON.stringify({ approval_status: 'Approved' }),
                    });
                }
            } else if (activeTab === 'products') {
                for (const id of selectedIds) {
                    await apiFetch(`${API_BASE}/products/${id}/`, {
                        method: 'PATCH',
                        body: JSON.stringify({ status: 'Active' }),
                    });
                }
            } else if (activeTab === 'users') {
                // Reactivate user by setting is_active back to true
                for (const id of selectedIds) {
                    await apiFetch(`${API_BASE}/users/${id}/`, {
                        method: 'PATCH',
                        body: JSON.stringify({ is_active: true }),
                    });
                }
            }
            setSelectedIds([]);
            await fetchArchivedData();
            alert(`${selectedIds.length} item(s) restored successfully.`);
        } catch (err) {
            alert(`Error restoring: ${err.message}`);
        }
    };

    // Filter entries based on active tab and search
    const getFilteredEntries = () => {
        let entries = [];
        let fields = [];

        if (activeTab === 'orders') {
            entries = archivedOrders;
            fields = orderFields;
        } else if (activeTab === 'customers') {
            entries = archivedCustomers;
            fields = customerFields;
        } else if (activeTab === 'products') {
            entries = archivedProducts;
            fields = productFields;
        } else if (activeTab === 'users') {
            entries = archivedUsers;
            fields = userFields;
        }

        const filtered = entries.filter(item => {
            const s = search.toLowerCase();
            if (activeTab === 'orders') {
                return (
                    item.invoice_number?.toString().includes(s) ||
                    item.customer_name?.toLowerCase().includes(s)
                );
            } else if (activeTab === 'customers') {
                return (
                    item.hauler_name?.toLowerCase().includes(s) ||
                    item.plate_number?.toLowerCase().includes(s)
                );
            } else if (activeTab === 'products') {
                return (
                    item.name?.toLowerCase().includes(s) ||
                    item.code?.toLowerCase().includes(s) ||
                    item.aggregate_type?.toLowerCase().includes(s)
                );
            } else if (activeTab === 'users') {
                return (
                    item.full_name?.toLowerCase().includes(s) ||
                    item.username?.toLowerCase().includes(s) ||
                    item.email?.toLowerCase().includes(s) ||
                    item.role?.toLowerCase().includes(s)
                );
            }
            return true;
        });

        return { filtered, fields };
    };

    const { filtered: filteredEntries, fields } = getFilteredEntries();

    const getTableComponent = () => {
        // Users tab uses CheckboxTable with userFields (no special UserTable needed here)
        return (
            <CheckboxTable
                fields={fields}
                entries={filteredEntries}
                selectedIds={selectedIds}
                onView={(item) => { setSelectedItem(item); setOpenView(true); }}
                onSelectionChange={setSelectedIds}
            />
        );
    };

    const getViewComponent = () => {
        if (activeTab === 'orders') {
            return <ViewOrderForm order={selectedItem} onCancel={() => setOpenView(false)} />;
        } else if (activeTab === 'customers') {
            return <ViewCustomer customer={selectedItem} onCancel={() => setOpenView(false)} />;
        } else if (activeTab === 'products') {
            return <ViewProduct product={selectedItem} onClose={() => setOpenView(false)} />;
        } else if (activeTab === 'users') {
            return (
                <ViewUser
                    user={selectedItem}
                    // No approve/reject actions needed for archived view
                    onApprove={null}
                    onReject={null}
                />
            );
        }
    };

    const tabCounts = {
        orders: archivedOrders.length,
        customers: archivedCustomers.length,
        products: archivedProducts.length,
        users: archivedUsers.length,
    };

    return (
        <div className="flex flex-col gap-3">
            <Container>
                <div className="flex flex-col gap-3">
                    <DashboardHeader title="Archive" subtitle="View and restore archived items across the system." />

                    {/* Tab Navigation */}
                    <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                        {[
                            { id: 'orders', label: 'Orders', count: tabCounts.orders },
                            { id: 'customers', label: 'Customers', count: tabCounts.customers },
                            { id: 'products', label: 'Products', count: tabCounts.products },
                            { id: 'users', label: 'Users', count: tabCounts.users },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                {tab.label}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={
                            activeTab === 'orders' ? "Search by order number or customer..." :
                                activeTab === 'customers' ? "Search by hauler name or plate number..." :
                                    activeTab === 'users' ? "Search by name, username, email or role..." :
                                        "Search by name, code or type..."
                        }
                    />

                    {/* Restore Selection Bar */}
                    {selectedIds.length > 0 && (
                        <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                            <span className="text-sm font-semibold text-emerald-800">
                                {selectedIds.length} item(s) selected
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedIds([])}
                                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={handleRestoreSelected}
                                    className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                                >
                                    ↩ Restore Selected
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading archived items...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">Error: {error}</div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No archived {activeTab} found</div>
                    ) : (
                        getTableComponent()
                    )}
                </div>
            </Container>

            {/* View Modal */}
            <FormModal
                formtitle={`View Archived ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}`}
                open={openView}
                handleClose={() => setOpenView(false)}
            >
                {getViewComponent()}
            </FormModal>
        </div>
    );
}