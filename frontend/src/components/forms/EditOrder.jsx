import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Field from '../ui/Field';
import { SaveButton, CancelButton } from '../ui/Button';
import { API_BASE } from '../../utils/api';

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all';

export default function EditOrderForm({ order, onSave, onCancel }) {
  const { apiFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    gate_pass: '',
    customer: '',
    product: '',
    amount: '',
    is_onsite: true,
    is_delivery: false
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setFetchingData(true);
        const customersRes = await apiFetch(`${API_BASE}/customers/`);
        const productsRes = await apiFetch(`${API_BASE}/products/`);

        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(Array.isArray(customersData) ? customersData : customersData.results || []);
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(Array.isArray(productsData) ? productsData : productsData.results || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchInitialData();
  }, [apiFetch]);

  useEffect(() => {
    if (order) {
      setForm({
        gate_pass: order.gate_pass || '',
        customer: order.customer || '',
        product: order.product || '',
        amount: order.amount || '',
        is_onsite: order.is_onsite !== undefined ? order.is_onsite : true,
        is_delivery: order.is_delivery !== undefined ? order.is_delivery : false
      });
    }
  }, [order]);

  const handleSave = async () => {
    if (!form.gate_pass || !form.customer || !form.product || !form.amount) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch(`${API_BASE}/orders/${order.invoice_number}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          gate_pass: form.gate_pass,
          customer: parseInt(form.customer),
          product: parseInt(form.product),
          amount: parseFloat(form.amount),
          is_onsite: form.is_onsite,
          is_delivery: form.is_delivery
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to update order');
      }

      onSave();
    } catch (error) {
      alert("Error updating order: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (fetchingData) {
    return <div className='text-center py-4'>Loading customers and products...</div>;
  }

  return (
    <div className='max-w-md mx-auto flex flex-col gap-3 w-full p-5 bg-white shadow-sm border border-gray-100 rounded-2xl'>
      <Field label='Invoice #'>
        <div className='w-full border border-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50'>
          {order?.invoice_number || '—'}
        </div>
      </Field>

      <Field label='Gate Pass'>
        <input
          className={inputClass}
          value={form.gate_pass}
          onChange={set('gate_pass')}
          placeholder='Enter gate pass number'
          disabled={loading}
        />
      </Field>

      <div className='grid grid-cols-2 gap-3'>
        <Field label='Customer'>
          <select
            className={inputClass}
            value={form.customer}
            onChange={set('customer')}
            disabled={loading}
          >
            <option value="">Select customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.hauler_name}</option>
            ))}
          </select>
        </Field>
        <Field label='Product'>
          <select
            className={inputClass}
            value={form.product}
            onChange={set('product')}
            disabled={loading}
          >
            <option value="">Select product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label='Amount (meters)'>
        <div className='flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'>
          <input
            type='number'
            step='0.01'
            value={form.amount}
            onChange={set('amount')}
            placeholder='0.00'
            className='flex-1 min-w-0 outline-none text-sm bg-transparent text-gray-700'
            disabled={loading}
          />
          <span className='text-xs text-gray-400 ml-1'>m³</span>
        </div>
      </Field>

      <Field label='Delivery Option'>
        <select
          className={inputClass}
          value={form.is_delivery.toString()}
          onChange={(e) => {
            const isDelivery = e.target.value === 'true';
            setForm(f => ({ ...f, is_delivery: isDelivery, is_onsite: !isDelivery }));
          }}
          disabled={loading}
        >
          <option value="false">On-site</option>
          <option value="true">Delivery</option>
        </select>
      </Field>

      <div className='flex justify-end gap-2 mt-4'>
        <CancelButton onClick={onCancel} />
        <SaveButton label={loading ? "Updating..." : "Update Order"} onClick={handleSave} disabled={loading} />
      </div>
    </div>
  );
}
