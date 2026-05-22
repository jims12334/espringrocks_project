import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { X } from 'lucide-react';

const sizeMap = {
    sm: 'w-[360px] max-w-[80vw]',
    md: 'w-[480px] max-w-[80vw]',
    lg: 'w-[580px] max-w-[80vw]',
    xl: 'w-[680px] max-w-[80vw]',
    '2xl': 'w-[800px] max-w-[90vw]',
};

export default function FormModal({ formtitle, open, handleClose, children, size = 'md' }) {
    return (
        <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" className="flex items-center justify-center">
                <Box className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col ${sizeMap[size] || sizeMap.md} max-h-[90vh]`}>
                    <div className='flex flex-row justify-between shrink-0 bg-primary py-3 px-4'>
                        <h1 className="text-2xl font-bold tracking-tight leading-none">{formtitle}</h1>
                        <button onClick={handleClose}>
                            <X className='hover:text-white' />
                        </button>
                    </div>
                    <div className='py-4 px-5 overflow-y-auto flex-grow'>
                        {children}
                    </div>
                </Box>
            </Modal>
        </div>
    )
}
