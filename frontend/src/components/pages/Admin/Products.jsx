import { useState, useEffect } from "react";
import SearchBar from "../../ui/SearchBar";
import FormModal from "../../ui/FormModal";
import AddProduct from "../../forms/AddProduct";
import EditProduct from "../../forms/EditProduct";
import ViewProduct from "../../forms/ViewProduct";
import CheckboxTable from "../../ui/CheckboxTable";
import Container from "../../ui/Container";
import DashboardHeader from "../../ui/DashboardHeader";
import { useAuth } from "../../../context/AuthContext";
import FormButton from "../../ui/Button";
import { API_BASE } from '../../../utils/api';
import ArchiveProductForm from "../../forms/ArchiveProduct";
import { useLocation, useNavigate } from 'react-router-dom';


export default function Products() {
    const { token, apiFetch } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openArchive, setOpenArchive] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const fields = [
        { key: "code", name: "Code" },
        { key: "name", name: "Name" },
        { key: "aggregate_type", name: "Type" },
        { key: "base_price", name: "Base Price" },
        { key: "status", name: "Status" },
        { key: "created_at", name: "Created at" },
    ];

    const fetchProducts = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await apiFetch(`${API_BASE}/products/`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            const arr = Array.isArray(data) ? data : data.results || [];
            const active = arr.filter(p => p.status !== 'Archived');
            setProducts(active.map(p => ({
                ...p,
                created_at: new Date(p.created_at).toLocaleDateString('en-PH'),
            })));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [token]);

    const handleEdit = async (form) => {
        try {
            const res = await apiFetch(`${API_BASE}/products/${selectedProduct.id}/`, {
                method: 'PUT',
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Failed to update product');
            await fetchProducts();
            setOpenEdit(false);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleArchive = async () => {
        try {
            const res = await apiFetch(`${API_BASE}/products/${selectedProduct.id}/`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'Archived' }),
            });
            if (!res.ok) throw new Error('Failed to archive product');
            await fetchProducts();
            setOpenArchive(false);
            setSelectedIds([]);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleBulkArchive = async () => {
        if (!window.confirm(`Are you sure you want to archive ${selectedIds.length} products?`)) return;
        try {
            for (const id of selectedIds) {
                await apiFetch(`${API_BASE}/products/${id}/`, {
                    method: 'PATCH',
                    body: JSON.stringify({ status: 'Archived' }),
                });
            }
            setSelectedIds([]);
            await fetchProducts();
            alert("Selected products archived successfully.");
        } catch (err) {
            alert(`Error during bulk archive: ${err.message}`);
        }
    };

    const handleApprove = async (entry) => {
        if (!window.confirm(`Approve product ${entry.name}?`)) return;
        try {
            const res = await apiFetch(`${API_BASE}/products/${entry.id}/approve/`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to approve');
            await fetchProducts();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleReject = async (entry) => {
        if (!window.confirm(`Reject product ${entry.name}?`)) return;
        try {
            const res = await apiFetch(`${API_BASE}/products/${entry.id}/reject/`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to reject');
            await fetchProducts();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const filteredEntries = products.filter(p => {
        const s = search.toLowerCase();
        return (
            p.status !== 'Archived' && (
                p.name?.toLowerCase().includes(s) ||
                p.code?.toLowerCase().includes(s) ||
                p.aggregate_type?.toLowerCase().includes(s)
            )
        );
    });

    return (
        <div className="flex flex-col gap-3">
            <Container>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between items-center">
                        <DashboardHeader title="All Products" subtitle="Manage aggregate inventory and pricing." />
                        <div className="flex gap-4 items-center">
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">Total Products: {filteredEntries.length}</span>
                            <FormButton label="Add Product" onClick={() => setOpenAdd(true)} bgcolor="" />
                        </div>
                    </div>
                    <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, code or type..." />

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading products...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">Error loading products: {error}</div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No products found</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {selectedIds.length > 0 && (
                                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-xl border border-gray-200">
                                    <span className="text-sm font-semibold text-gray-700">{selectedIds.length} item(s) selected</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Clear</button>
                                        <button onClick={handleBulkArchive} className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors shadow-sm">Archive Selected</button>
                                    </div>
                                </div>
                            )}
                            <CheckboxTable
                                fields={fields}
                                entries={filteredEntries}
                                selectedIds={selectedIds}
                                onView={(p) => { setSelectedProduct(p); setOpenView(true); }}
                                onEdit={(p) => { setSelectedProduct(p); setOpenEdit(true); }}
                                onDelete={(p) => { setSelectedProduct(p); setOpenArchive(true); }}
                                onSelectionChange={setSelectedIds}
                            />
                        </div>
                    )}
                </div>
            </Container>

            {/* Add Modal */}
            <FormModal formtitle="Add Product" open={openAdd} handleClose={() => setOpenAdd(false)}>
                <AddProduct
                    onSave={async () => {
                        await fetchProducts();
                        setOpenAdd(false);
                    }}
                    onCancel={() => setOpenAdd(false)}
                />
            </FormModal>

            {/* Edit Modal */}
            <FormModal formtitle="Edit Product" open={openEdit} handleClose={() => setOpenEdit(false)}>
                <EditProduct
                    product={selectedProduct}
                    onSave={handleEdit}
                    onCancel={() => setOpenEdit(false)}
                />
            </FormModal>

            {/* View Modal */}
            <FormModal formtitle="View Product" open={openView} handleClose={() => setOpenView(false)}>
                <ViewProduct
                    product={selectedProduct}
                    onClose={() => setOpenView(false)}
                    onApprove={async (product) => { await handleApprove(product); setOpenView(false); }}
                    onReject={async (product) => { await handleReject(product); setOpenView(false); }}
                />
            </FormModal>

            {/* Archive Confirm Modal */}
            <FormModal formtitle="Archive Product" open={openArchive} handleClose={() => setOpenArchive(false)}>
                <ArchiveProductForm
                    product={selectedProduct}
                    onCancel={() => setOpenArchive(false)}
                    onDelete={handleArchive}
                />
            </FormModal>
        </div>
    );
}
