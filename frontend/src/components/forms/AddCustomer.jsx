import React, { useState } from 'react'
import Field from '../ui/Field'
import { CancelButton, AddButton } from '../ui/Button'

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all'

export default function AddCustomer({ onSave, onCancel }) {
    const [form, setForm] = useState({
        hauler_name: '',
        plate_number: '',
        location: '',
        address: '',
        length: '',
        width: '',
        contact_person: '',
        contact_number: '',
        email: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = { ...form };
            // Convert empty strings to null or parse to float so Django accepts them
            payload.length = payload.length ? parseFloat(payload.length) : null;
            payload.width = payload.width ? parseFloat(payload.width) : null;
            
            await onSave(payload);
            setForm({
                hauler_name: '',
                plate_number: '',
                location: '',
                address: '',
                length: '',
                width: '',
                contact_person: '',
                contact_number: '',
                email: ''
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    return (
        <div className='max-w-md mx-auto flex flex-col gap-3 w-full p-5 bg-white shadow-sm border border-gray-100 rounded-2xl'>

            <Field label='Hauler Name'>
                <input
                    className={inputClass}
                    value={form.hauler_name}
                    onChange={set('hauler_name')}
                    placeholder='Enter hauler name'
                />
            </Field>

            <div className='grid grid-cols-2 gap-3'>
                <Field label='Plate Number'>
                    <input
                        className={inputClass}
                        value={form.plate_number}
                        onChange={set('plate_number')}
                        placeholder='Plate #' />
                </Field>
                <Field label='Location'>
                    <input
                        className={inputClass}
                        value={form.location}
                        onChange={set('location')}
                        placeholder='Location' />
                </Field>
            </div>

            <Field label='Address'>
                <input
                    className={inputClass}
                    value={form.address}
                    onChange={set('address')}
                    placeholder='Enter company address' />
            </Field>

            <div className='grid grid-cols-2 gap-3 w-full'>
                <Field label='Length'>
                    <div className='flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'>
                        <input
                            type='number'
                            step='0.01'
                            value={form.length}
                            onChange={set('length')}
                            placeholder='0.00'
                            className='flex-1 min-w-0 outline-none text-sm bg-transparent text-gray-700' />
                        <span className='text-xs text-gray-400 ml-1'>m</span>
                    </div>
                </Field>
                <Field label='Width'>
                    <div className='flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'>
                        <input
                            type='number'
                            step='0.01'
                            value={form.width}
                            onChange={set('width')}
                            placeholder='0.00'
                            className='flex-1 min-w-0 outline-none text-sm bg-transparent text-gray-700' />
                        <span className='text-xs text-gray-400 ml-1'>m</span>
                    </div>
                </Field>
            </div>

            <Field label='Contact Person'>
                <input
                    className={inputClass}
                    value={form.contact_person}
                    onChange={set('contact_person')}
                    placeholder='Full name' />
            </Field>

            <div className='grid grid-cols-2 gap-3'>
                <Field label='Contact Number'>
                    <input
                        className={inputClass}
                        value={form.contact_number}
                        onChange={set('contact_number')}
                        placeholder='Phone #' />
                </Field>
                <Field label='Email Address'>
                    <input
                        type='email'
                        className={inputClass}
                        value={form.email}
                        onChange={set('email')}
                        placeholder='Email' />
                </Field>
            </div>
            <div className="flex justify-end gap-2 mt-2">
                {onCancel && (
                    <CancelButton onClick={onCancel} />
                )}
                <AddButton
                    label="Add Customer"
                    onClick={handleSave}
                    disabled={loading}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                />
            </div>
        </div >
    );
}