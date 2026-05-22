import React, { useState, useEffect } from 'react'
import InputBox from '../ui/InputBox'
import { CancelButton, SaveButton } from '../ui/Button'

export default function EditCustomerForm({ customer, onSave, onCancel }) {
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

    useEffect(() => {
        if (customer) {
            setForm({
                hauler_name: customer.hauler_name || '',
                plate_number: customer.plate_number || '',
                location: customer.location || '',
                address: customer.address || '',
                length: customer.length || '',
                width: customer.width || '',
                contact_person: customer.contact_person || '',
                contact_number: customer.contact_number || '',
                email: customer.email || ''
            });
        }
    }, [customer]);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    return (
        <div className='flex flex-col gap-4 text-sm max-w-md mx-auto'>
            <div className='w-full'>
                <InputBox
                    label="Hauler Name"
                    value={form.hauler_name}
                    onChange={set('hauler_name')}
                    placeholder="Hauler Name"
                />
            </div>
            <div className='w-full'>
                <InputBox
                    label="Plate Number"
                    value={form.plate_number}
                    onChange={set('plate_number')}
                    placeholder="Plate Number"
                />
            </div>
            <div className='grid grid-cols-2 gap-3 w-full'>
                <InputBox
                    label="Location"
                    value={form.location}
                    onChange={set('location')}
                    placeholder="Location"
                />
                <InputBox
                    label="Contact Person"
                    value={form.contact_person}
                    onChange={set('contact_person')}
                    placeholder="Contact Person"
                />
            </div>
            <div className='w-full'>
                <InputBox
                    label="Address"
                    value={form.address}
                    onChange={set('address')}
                    placeholder="Address"
                />
            </div>
            <div className='grid grid-cols-2 gap-3 w-full'>
                <InputBox
                    label="Length (m)"
                    value={form.length}
                    onChange={set('length')}
                    type="number"
                    step="0.01"
                    placeholder="Length"
                />
                <InputBox
                    label="Width (m)"
                    value={form.width}
                    onChange={set('width')}
                    type="number"
                    step="0.01"
                    placeholder="Width"
                />
            </div>
            <div className='grid grid-cols-2 gap-3 w-full'>
                <InputBox
                    label="Contact Number"
                    value={form.contact_number}
                    onChange={set('contact_number')}
                    placeholder="Contact Number"
                />
                <InputBox
                    label="Email"
                    value={form.email}
                    onChange={set('email')}
                    type="email"
                    placeholder="Email"
                />
            </div>
            <div className='flex justify-end gap-2 mt-4 w-full'>
                <CancelButton onClick={onCancel} />
                <SaveButton label="Update Customer" onClick={() => onSave(form)} />
            </div>
        </div>
    )
}